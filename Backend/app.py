from flask import Flask, send_from_directory, request, jsonify, redirect, session, url_for
from flask_mysqldb import MySQL
from flask_cors import CORS
import joblib
from werkzeug.security import generate_password_hash, check_password_hash
import numpy as np
import traceback
import jwt
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from werkzeug.utils import secure_filename
import grpc
import sys
from grpc_app.grpc_client import grpc_predict_quiz

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

app.secret_key = 'ee1d7202fd9481472a7f118d711812a54a4386a2d2b4d418'

UPLOAD_FOLDER = 'profile_pictures'

# CONFIGURATION
app.config['SESSION_TYPE'] = 'filesystem'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'mentalhealth'
mysql = MySQL(app)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ---- QA / TF-IDF stuff (unchanged) ----
data = pd.read_csv(r'C:\Users\admin\my-react-app\Backend\newdata3.csv')
data = data.dropna(subset=['Question'])
answer_vectorizer = TfidfVectorizer()
answer_X = answer_vectorizer.fit_transform(data['Question'].astype(str))

def get_answer(question):
    question_vec = answer_vectorizer.transform([question])
    similarities = cosine_similarity(question_vec, answer_X)
    most_similar_idx = similarities.argmax()
    return data['Answer'].iloc[most_similar_idx]

questions_data = { 'Sadness': { 'question': 'How often do you experience sadness?', 'choices': [ {'value': 0, 'label': 'Seldom'}, {'value': 1, 'label': 'Sometimes'}, {'value': 2, 'label': 'Usually'}, {'value': 3, 'label': 'Most-Often'}, ] }, 'Euphoric': { 'question': 'How often do you experience euphoria?', 'choices': [ {'value': 0, 'label': 'Seldom'}, {'value': 1, 'label': 'Sometimes'}, {'value': 2, 'label': 'Usually'}, {'value': 3, 'label': 'Most-Often'}, ] }, 'Exhausted': { 'question': 'How often do you feel exhausted?', 'choices': [ {'value': 0, 'label': 'Seldom'}, {'value': 1, 'label': 'Sometimes'}, {'value': 2, 'label': 'Usually'}, {'value': 3, 'label': 'Most-Often'}, ] }, 'Sleep dissorder': { 'question': 'How often do you experience sleep disorders?', 'choices': [ {'value': 0, 'label': 'Seldom'}, {'value': 1, 'label': 'Sometimes'}, {'value': 2, 'label': 'Usually'}, {'value': 3, 'label': 'Most-Often'}, ] }, 'Mood Swing': { 'question': 'Do you experience mood swings?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Suicidal thoughts': { 'question': 'Do you have suicidal thoughts?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Anorxia': { 'question': 'Do you experience anorexia?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Authority Respect': { 'question': 'Do you respect authority?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Try-Explanation': { 'question': 'Do you try to explain things?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Aggressive Response': { 'question': 'Do you respond aggressively?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Ignore & Move-On': { 'question': 'Do you ignore and move on?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Nervous Break-down': { 'question': 'Have you experienced a nervous breakdown?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Admit Mistakes': { 'question': 'Do you admit your mistakes?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Overthinking': { 'question': 'Do you tend to overthink?', 'choices': [ {'value': 0, 'label': 'NO'}, {'value': 1, 'label': 'YES'}, ] }, 'Sexual Activity': { 'question': 'Rate your sexual activity on a scale of 0 to 10:', 'inputType': 'number', 'minValue': 0, 'maxValue': 10, }, 'Concentration': { 'question': 'Rate your concentration on a scale of 0 to 10:', 'inputType': 'number', 'minValue': 0, 'maxValue': 10, }, 'Optimisim': { 'question': 'Rate your optimism on a scale of 0 to 10:', 'inputType': 'number', 'minValue': 0, 'maxValue': 10, }, }

quiz_responses = {}

question_order = [
    'Sadness', 'Euphoric', 'Exhausted', 'Sleep dissorder', 'Mood Swing',
    'Suicidal thoughts', 'Anorxia', 'Authority Respect', 'Try-Explanation',
    'Aggressive Response', 'Ignore & Move-On', 'Nervous Break-down',
    'Admit Mistakes', 'Overthinking', 'Sexual Activity', 'Concentration', 'Optimisim'
]

label_names = {
    0: 'Normal',
    1: 'Bipolar Type-1',
    2: 'Bipolar Type-2',
    3: 'Depression'
}

# ---- Helpers / Auth / DB helpers (inchangés) ----
# def is_email_exists(email):
#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
#     user = cursor.fetchone()
#     cursor.close()
#     return user is not None

def hash_password(password):
    return generate_password_hash(password, method='pbkdf2:sha256')

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def softmax(x):
    exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

def forward_propagation(X, W1, b1, W2, b2):
    z1 = np.dot(X, W1) + b1
    a1 = sigmoid(z1)
    z2 = np.dot(a1, W2) + b2
    a2 = softmax(z2)
    return a1, a2


def verify_token(token):
    return isinstance(token, str) and len(token) > 0



# def grpc_predict_quiz(features_numpy):
#     """
#     Envoie les features (numpy 1xN) au serveur gRPC et retourne :
#     (predicted_label_str, percentages_list, label_names_dict)
#     """
#     if predictor_pb2 is None or predictor_pb2_grpc is None:
#         raise RuntimeError("Les modules gRPC ne sont pas importés. Vérifie predictor_pb2.py et predictor_pb2_grpc.py")

#     features_list = features_numpy.flatten().astype(float).tolist()

#     # se connecter au serveur gRPC local
#     channel = grpc.insecure_channel("localhost:50051")
#     stub = predictor_pb2_grpc.PredictorStub(channel)

#     # construire la requête
#     req = predictor_pb2.PredictRequest(features=features_list)

#     # appel RPC
#     resp = stub.Predict(req)

#     # resp.predicted_label : string
#     # resp.percentages : repeated double -> on convertit en liste Python
#     # resp.label_names : map<int32, string> -> on convertit en dict Python (cles int)
#     percentages_list = list(resp.percentages)
#     # la map dans protobuf est typiquement str->str ou int->str ; on force int keys si nécessaire
#     try:
#         label_names_dict = {int(k): v for k, v in resp.label_names.items()}
#     except Exception:
#         # fallback si les clés sont déjà int
#         label_names_dict = dict(resp.label_names)

#     return resp.predicted_label, percentages_list, label_names_dict

# -------------------
# Routes (inchangées sauf /api/submit)
# -------------------

# @app.route('/sign-up', methods=['POST'])
# def signup():
#     if request.method == 'POST':
#         try:
#             if request.is_json:
#                 data = request.json
#                 first_name = data.get('first_name')
#                 last_name = data.get('last_name')
#                 email = data.get('email')
#                 password = data.get('password')
#             else:
#                 first_name = request.form['first_name']
#                 last_name = request.form['last_name']
#                 email = request.form['email']
#                 password = request.form['password']

#             validation_conditions = [
#                 (len(password) < 8, 'Password should be at least 8 characters long'),
#                 (not any(char.isupper() for char in password), 'Password should contain at least one uppercase letter'),
#                 (not any(char.islower() for char in password), 'Password should contain at least one lowercase letter'),
#                 (not any(char.isdigit() for char in password), 'Password should contain at least one digit'),
#                 (not any(char in '!@#$%^&*()-_=+[]{}|;:\'",.<>/?' for char in password),
#                  'Password should contain at least one special character')
#             ]

#             for condition, error_message in validation_conditions:
#                 if condition:
#                     return jsonify({'error': error_message})

#             if is_email_exists(email):
#                 return jsonify({'error': 'Email already exists'})

#             hashed_password = hash_password(password)

#             cursor = mysql.connection.cursor()
#             try:
#                 cursor.execute("INSERT INTO users (first_name, last_name, email, password) VALUES (%s, %s, %s, %s)",
#                                (first_name, last_name, email, hashed_password))
#                 cursor.commit()
#                 return jsonify({'message': 'Sign-up successful!'})
#             except Exception as e:
#                 return jsonify({'error': f'Database error: {str(e)}'})
#             finally:
#                 cursor.close()

#         except Exception as e:
#             return jsonify({'error': f'Error during sign-up: {str(e)}'})

@app.route('/profile_pictures/<filename>')
def get_profile_picture(filename):
    return send_from_directory(
        os.path.join(app.root_path, app.config['UPLOAD_FOLDER']),
        filename
    )

def get_default_profile_picture(gender):
    if gender == 'Male':
        return 'profile_pictures/male.png'
    elif gender == 'Female':
        return 'profile_pictures/female.png'
    else:
        return 'profile_pictures/male.png'

# @app.route('/Login', methods=['POST'])
# def login():
#     if request.method == 'POST':
#         try:
#             if request.is_json:
#                 data = request.json
#                 email = data.get('email')
#                 password = data.get('password')
#             else:
#                 email = request.form['email']
#                 password = request.form['password']

#             if not is_email_exists(email):
#                 return jsonify({'error': 'Invalid credentials'})

#             cursor = mysql.connection.cursor()
#             cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
#             user = cursor.fetchone()
#             cursor.close()

#             if (user[4] == hash_password(password)):
#                 return jsonify({'error': 'Incorrect password'})

#             user_data = {
#                 'id': user[0],
#                 'first_name': user[1],
#                 'last_name': user[2],
#                 'email': user[3],
#                 'gender': user[5],
#                 'phone': user[7],
#                 'profile_picture': user[6] if user[5] else get_default_profile_picture(user[5])
#             }
#             session['user'] = user_data
#             print("Session Data:", session['user'])

#             token = jwt.encode({'email': email}, app.secret_key, algorithm='HS256')

#             return jsonify({'message': 'Login successful', 'token': token, 'user': session['user']})
#         except Exception as e:
#             return jsonify({'error': f'Error during login: {str(e)}'})

@app.route('/api/questions', methods=['GET'])
def get_questions():
    return jsonify({'questions': questions_data})

# ---- HERE: submit_quiz now calls gRPC for predictions ----
@app.route('/api/submit', methods=['POST'])
def submit_quiz():
    global quiz_responses

    data = request.json

    if not data:
        return jsonify({'error': 'No data provided in the request'}), 400

    try:
        app.logger.info(f"Received data: {data}")

        # 1️⃣ garder l’ordre exact des questions
        ordered_responses = [
            (question, data.get(question, 0))
            for question in question_order
        ]

        # 2️⃣ construire numpy array (1, N) en float
        ordered_responses_array = np.array(
            [value for _ , value in ordered_responses],
            dtype=np.float64
        ).reshape(1, -1)

        # 3️⃣ appel gRPC (PREDICTION)
        predicted_label_name, percentages_list, label_names_dict = grpc_predict_quiz(
            ordered_responses_array
        )

        # 4️⃣ sauvegarder les réponses (optionnel)
        quiz_responses = dict(ordered_responses)

        # 5️⃣ rendre les données JSON-safe
        ordered_responses_list = []
        for question, value in ordered_responses:
            try:
                if isinstance(value, (np.integer, np.floating)):
                    value = float(value)
                ordered_responses_list.append((question, value))
            except Exception:
                ordered_responses_list.append((question, value))

        # 6️⃣ réponse finale vers React
        return jsonify({
            'message': 'Quiz responses submitted successfully',
            'ordered_responses': ordered_responses_list,
            'predicted_label': predicted_label_name,
            'percentages': percentages_list,
            'labelNames': label_names_dict
        }), 200

    except Exception as e:
        app.logger.error(f"Error in submit_quiz: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        app.logger.error(f'Error during logout: {str(e)}')
        return jsonify({'error': 'An unexpected error occurred during logout'}), 500

@app.route('/api/posts/<int:topic_id>', methods=['GET'])
def get_posts(topic_id):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM posts WHERE topic_id = %s", (topic_id,))
        posts = cursor.fetchall()
        post_list = []

        for post in posts:
            cursor.execute("SELECT * FROM users WHERE id = %s", (post[2],))
            user_data = cursor.fetchone()
            post_data = {
                'id': post[0],
                'topic_id': post[1],
                'user_data': {
                    'id': user_data[0],
                    'first_name': user_data[1],
                    'last_name': user_data[2],
                    'email': user_data[3]
                },
                'content': post[3],
                'created_at': post[4].strftime('%Y-%m-%d %H:%M:%S')
            }
            post_list.append(post_data)

        cursor.close()
        return jsonify(post_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/introduction', methods=['POST'])
def add_introductions():
    if request.method == 'POST':
        try:
            data = request.json
            comment_text = data.get('introduction')
            topic_id = data.get('topicId')
            user_id = data.get('user_id')

            if user_id and comment_text and topic_id:
                cur = mysql.connection.cursor()
                cur.execute('INSERT INTO posts (topic_id, user_id, content) VALUES (%s, %s, %s)', (topic_id, user_id, comment_text))
                cur.commit()
                cur.close()
                return jsonify({'message': 'Comment added successfully'}), 201
            else:
                return jsonify({'error': 'User ID and comment text are required'}), 400

        except Exception as e:
            return jsonify({'error': f'Error during processing: {str(e)}'}), 500

@app.route('/api/response/<int:topic_id>', methods=['GET'])
def get_responses(topic_id):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(""" SELECT r.* FROM responses r JOIN posts p ON r.post_id = p.post_id WHERE p.topic_id = %s """, (topic_id,))
        posts = cursor.fetchall()
        responses_list = []

        for post in posts:
            cursor.execute("SELECT * FROM users WHERE id = %s", (post[2],))
            user_data = cursor.fetchone()
            response_data = {
                'response_id': post[0],
                'post_id': post[1],
                'user_data': {
                    'id': user_data[0],
                    'first_name': user_data[1],
                    'last_name': user_data[2],
                    'email': user_data[3]
                },
                'content': post[3],
                'created_at': post[4].strftime('%Y-%m-%d %H:%M:%S')
            }
            responses_list.append(response_data)

        cursor.close()
        return jsonify(responses_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/responses', methods=['POST'])
def add_response():
    if request.method == 'POST':
        try:
            data = request.json
            response_text = data.get('resvalue')
            topic_id = data.get('topicId')
            user_id = data.get('user_id')
            post_id = data.get('postid')

            if user_id and response_text and topic_id:
                cur = mysql.connection.cursor()
                cur.execute('INSERT INTO responses (post_id, user_id,content) VALUES (%s, %s, %s)', (post_id, user_id, response_text))
                mysql.get_db().commit()
                cur.close()
                return jsonify({'message': 'Comment added successfully'}), 201
            else:
                return jsonify({'error': 'User ID and comment text are required'}), 400

        except Exception as e:
            return jsonify({'error': f'Error during processing: {str(e)}'}), 500

def update_user_data(user_id, first_name, last_name, gender, profile_picture_path=None):
    try:
        cursor = mysql.connection.cursor()
        if profile_picture_path:
            update_query = "UPDATE users SET first_name = %s, last_name = %s, gender = %s, profile_picture = %s WHERE id = %s"
            user_data = (first_name, last_name, gender, profile_picture_path, user_id)
        else:
            update_query = "UPDATE users SET first_name = %s, last_name = %s, gender = %s WHERE id = %s"
            user_data = (first_name, last_name, gender, user_id)

        cursor.execute(update_query, user_data)
        mysql.get_db().commit()
        cursor.close()
        return True
    except Exception as e:
        print("Error:", e)
        return False

def get_user_data_by_id(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, first_name, last_name, gender, profile_picture_path FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    user_data = {
        'id': user[0],
        'first_name': user[1],
        'last_name': user[2],
        'email': user[3],
        'gender': user[5],
        'phone': user[7],
        'profile_picture': user[6] if user[6] else get_default_profile_picture(user[5])
    }
    cursor.close()
    return user_data

@app.route('/update-profile', methods=['POST'])
def update_profile():
    user_id = request.form.get('id')
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    gender = request.form.get('gender')

    cursor = mysql.connection.cursor()
    try:
        profile_picture_db_value = None
        if 'profile_picture' in request.files:
            profile_picture = request.files['profile_picture']
            if profile_picture.filename != '':
                filename = secure_filename(profile_picture.filename)
                save_path = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], filename)
                profile_picture.save(save_path)
                profile_picture_db_value = filename

        if profile_picture_db_value:
            update_query = """
                UPDATE users 
                SET first_name=%s, last_name=%s, gender=%s, profile_picture=%s
                WHERE id=%s
            """
            cursor.execute(update_query, (first_name, last_name, gender, profile_picture_db_value, user_id))
        else:
            update_query = """
                UPDATE users 
                SET first_name=%s, last_name=%s, gender=%s
                WHERE id=%s
            """
            cursor.execute(update_query, (first_name, last_name, gender, user_id))

        mysql.connection.commit()

        cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
        updated_user = cursor.fetchone()

        user_data = {
            'id': updated_user[0],
            'first_name': updated_user[1],
            'last_name': updated_user[2],
            'email': updated_user[3],
            'gender': updated_user[5],
            'phone': updated_user[7],
            'profile_picture': updated_user[6] if updated_user[6] else get_default_profile_picture(updated_user[5])
        }

        return jsonify({'message': 'Profile updated successfully', 'user': user_data})

    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({'error': 'Failed to update profile'}), 500
    finally:
        cursor.close()

@app.route('/api/ask', methods=['POST'])
def ask_question():
    if request.method == 'POST':
        question = request.json.get('message')
        response = get_answer(question)
        return jsonify({'response': response})

@app.route('/')
def home():
    return 'Welcome to the home page!'

# @app.route('/api/verifyToken', methods=['POST'])
# def verify_token_route():
#     try:
#         data = request.json
#         token = data.get('token')
#         if verify_token(token):
#             return jsonify({'valid': True}), 200
#         else:
#             return jsonify({'valid': False}), 401
#     except Exception as e:
#         app.logger.error(f'Error verifying token: {str(e)}')
#         return jsonify({'error': 'An unexpected error occurred during token verification'}), 500

# @app.route('/api/community')
# def get_topics():
#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT * FROM topics")
#     topics = cursor.fetchall()
#     cursor.close()
#     return jsonify(topics)

if __name__ == '__main__':
    app.run(debug=True)
