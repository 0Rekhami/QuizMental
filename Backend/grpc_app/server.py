import grpc
from concurrent import futures
import numpy as np
from grpc_app import predictor_pb2
from grpc_app import predictor_pb2_grpc
import joblib

import os
import threading

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PROJECT_ROOT = os.path.dirname(BASE_DIR)

MODEL_DIR = os.path.join(PROJECT_ROOT, "model")

model = joblib.load(os.path.join(MODEL_DIR, "random_forest_model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

print("MODEL_DIR =", MODEL_DIR)
print("Files in model dir =", os.listdir(MODEL_DIR))


label_names = {
    0: 'Normal',
    1: 'Bipolar Type-1',
    2: 'Bipolar Type-2',
    3: 'Depression'
}

# -----------------------------
# Implémentation du service gRPC
# -----------------------------

model_lock = threading.Lock()
class PredictorService(predictor_pb2_grpc.PredictorServicer):

    def Predict(self, request, context):
        # 1) convertir la liste reçue en numpy array
        features = np.array(request.features, dtype=np.float64).reshape(1, -1)

        # 2) normalisation + prédiction (thread-safe)
        with model_lock:
            features_scaled = scaler.transform(features)
            predicted_class = int(model.predict(features_scaled)[0])

            if hasattr(model, "predict_proba"):
                percentages = (
                    model.predict_proba(features_scaled)[0] * 100
                ).round(2).tolist()
            else:
                percentages = []

        # 3) réponse gRPC
        return predictor_pb2.PredictResponse(
            predicted_label=label_names[predicted_class],
            percentages=percentages,
            label_names=label_names
        )




# -----------------------------
# Lancer le serveur gRPC
# -----------------------------

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    predictor_pb2_grpc.add_PredictorServicer_to_server(PredictorService(), server)

    server.add_insecure_port("[::]:50051")
    print("🚀 gRPC Server running on port 50051...")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
