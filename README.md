
# 🧠 QuizMental
 
**Application web de dépistage préliminaire de l'état mental à partir d'un quiz, avec React, Flask, gRPC et Machine Learning.**
 
L'utilisateur répond à un questionnaire de 17 questions. Ses réponses sont envoyées à une API Flask, qui interroge un serveur **gRPC** chargé de la prédiction. Un modèle **Random Forest** renvoie l'état le plus probable ainsi que les pourcentages pour chaque classe.
 
> ⚠️ **Avertissement** : ce projet est à but éducatif. Il ne constitue pas un diagnostic et ne remplace en aucun cas l'avis d'un professionnel de santé. En cas de détresse, contactez un professionnel ou les services d'urgence de votre pays.
 
---
 
## ✨ Fonctionnalités
 
- **Quiz de 17 questions** (fréquence de la tristesse, de l'épuisement, troubles du sommeil, sautes d'humeur, concentration, optimisme, etc.)
- **Prédiction ML** parmi 4 classes : `Normal`, `Bipolar Type-1`, `Bipolar Type-2`, `Depression`, avec les pourcentages de probabilité
- **Page de résultats** avec visualisation graphique (Chart.js / Victory)
- **Chatbot d'aide** : répond aux questions de l'utilisateur par recherche de similarité (TF-IDF et cosinus) dans une base de questions/réponses (`newdata3.csv`)
- **Espace communautaire** : présentations, partage d'expériences, questions, soutien aux autres
- **Profil utilisateur** avec photo de profil
- Page de **ressources** sur la santé mentale
## 🏗️ Architecture
 
```
┌──────────────┐  HTTP/JSON  ┌──────────────┐  gRPC / Protobuf  ┌──────────────┐
│   Frontend   │ ──────────► │  API Flask   │ ────────────────► │ Serveur gRPC │
│  React :3000 │ ◄────────── │ (app.py)     │ ◄──────────────── │  :50051      │
└──────────────┘             │    :5000     │                   │ scaler +     │
                             └──────┬───────┘                   │ RandomForest │
                                                                └──────────────┘
              
```
 
1. React envoie les réponses du quiz à `POST /api/submit`.
2. Flask ordonne les réponses (17 variables) et les transmet au serveur gRPC via `grpc_client.py`.
3. Le serveur gRPC (`server.py`) normalise les données avec `scaler.pkl`, prédit avec `random_forest_model.pkl` et renvoie le label et les pourcentages.
4. Flask renvoie le résultat au frontend, qui l'affiche.
## 📁 Structure du projet
 
```
my-react-ml-grpc/
├── Backend/
│   ├── app.py                       # API Flask (quiz, chatbot, communauté, profil)
│   ├── grpc_app/
│   │   ├── predictor.proto          # Contrat gRPC (service Predictor)
│   │   ├── predictor_pb2.py         # Messages Protobuf (généré)
│   │   ├── predictor_pb2_grpc.py    # Stubs gRPC (généré)
│   │   ├── server.py                # Serveur gRPC de prédiction
│   │   └── grpc_client.py           # Client gRPC utilisé par Flask
│   ├── model/
│   │   ├── random_forest_model.pkl  # Modèle Random Forest entraîné
│   │   ├── scaler.pkl               # Normalisation des features
│   │   └── features(1).pkl          # Liste des features
│   ├── newdata3.csv                 # Base questions/réponses du chatbot
│   ├── quizmodel.pkl                # Ancien modèle
│   ├── profile_pictures/            # Photos de profil
│   └── requirements.txt             # Dépendances Python
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/              # Pages et composants React
│   │   ├── Styles/                  # Fichiers CSS
│   │   └── Images/                  # Images et icônes
│   └── package.json
└── .gitignore
```
 
## 🛠️ Technologies
 
| Couche | Technologies |
|--------|--------------|
| Frontend | React 18, React Router, Axios, Chart.js, Victory |
| API | Python, Flask, Flask-CORS, Flask-MySQLdb |
| Communication interne | gRPC, Protocol Buffers |
| Machine Learning | scikit-learn (RandomForestClassifier, scaler), NumPy, pandas, joblib |
| Chatbot | TF-IDF et similarité cosinus (scikit-learn) |
| Base de données | MySQL |
 
## 🚀 Installation et lancement
 
### Prérequis
 
- Python 3.10 ou plus
- Node.js 18 ou plus
- MySQL (base nommée `mentalhealth`)
- Git
### 1. Cloner le dépôt
 
```bash
git clone https://github.com/0Rekhami/my-react-ml-grpc.git
cd my-react-ml-grpc
```
 
### 2. Backend
 
```bash
cd Backend
python -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
```
 
> Le modèle a été sauvegardé avec **scikit-learn 1.6.1**. Garder cette version évite les erreurs de chargement.
 
Dans **deux terminaux** séparés (depuis le dossier `Backend/`) :
 
```bash
# Terminal 1 : serveur gRPC (port 50051)
python -m grpc_app.server
 
# Terminal 2 : API Flask (port 5000)
python app.py
```
 
### 3. Base de données MySQL
 
L'API se connecte à une base `mentalhealth` sur `localhost` (paramètres dans `app.py`). Créez la base avant de lancer l'API :
 
```sql
CREATE DATABASE mentalhealth;
```
 
Les fonctionnalités de la communauté utilisent les tables `users`, `posts`, `responses` et `topics`.
 
### 4. Frontend
 
```bash
cd Frontend
npm install
npm start
```
 
L'application est accessible sur http://localhost:3000.
 
## 🔌 Contrat gRPC
 
Défini dans [`Backend/grpc_app/predictor.proto`](Backend/grpc_app/predictor.proto) :
 
```proto
service Predictor {
  rpc Predict (PredictRequest) returns (PredictResponse) {}
}
 
message PredictRequest {
  repeated double features = 1;          // 17 réponses du quiz, dans l'ordre
}
 
message PredictResponse {
  string predicted_label = 1;            // ex. "Depression"
  repeated double percentages = 2;       // probabilité de chaque classe (%)
  map<int32, string> label_names = 3;    // 0..3 -> nom de la classe
}
```
 
Pour régénérer les fichiers Python après modification du `.proto` (depuis `Backend/`) :
 
```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. grpc_app/predictor.proto
```
 
## 🌐 Endpoints de l'API Flask
 
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/questions` | Liste des questions du quiz |
| POST | `/api/submit` | Envoie les réponses, renvoie la prédiction et les pourcentages |
| POST | `/api/ask` | Chatbot : renvoie la réponse la plus proche de la question |
| GET | `/api/posts/<topic_id>` | Publications d'un sujet de la communauté |
| POST | `/api/introduction` | Ajoute une publication |
| GET | `/api/response/<topic_id>` | Réponses d'un sujet |
| POST | `/api/responses` | Ajoute une réponse |
| POST | `/update-profile` | Met à jour le profil et la photo |
| POST | `/api/logout` | Déconnexion |
 
## 🗺️ Pistes d'amélioration
 
- [ ] Réactiver et finaliser l'authentification (inscription, connexion, JWT)
- [ ] Externaliser la configuration (clé secrète, accès MySQL) dans un fichier `.env`
- [ ] Ajouter un script SQL de création des tables
- [ ] Documenter l'entraînement et les performances du modèle (précision, matrice de confusion)
- [ ] Dockeriser le backend, le serveur gRPC et le frontend
- [ ] Ajouter des tests unitaires
## 👤 Auteur
 
**Abdessamad Rekhami**
GitHub : [@0Rekhami](https://github.com/0Rekhami)
 
