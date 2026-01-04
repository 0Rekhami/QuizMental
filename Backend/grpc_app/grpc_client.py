import grpc
from grpc_app import predictor_pb2
from grpc_app import predictor_pb2_grpc

def grpc_predict_quiz(features_array):
    """
    Envoie les données du quiz au serveur gRPC
    et retourne la prédiction du modèle ML.

    features_array : numpy array (1, N) ou liste
    """

    # 1️⃣ transformer en liste plate
    if hasattr(features_array, "flatten"):
        features_list = features_array.flatten().tolist()
    else:
        features_list = list(features_array)

    # 2️⃣ créer la connexion gRPC
    channel = grpc.insecure_channel("localhost:50051")
    stub = predictor_pb2_grpc.PredictorStub(channel)

    # 3️⃣ construire la requête
    request = predictor_pb2.PredictRequest(
        features=features_list
    )

    # 4️⃣ appel gRPC
    response = stub.Predict(request)

    # 5️⃣ retourner les résultats
    # return (
    #     response.predicted_label,
    #     response.percentages,
    #     dict(response.label_names)
    # )
    percentages_list = list(response.percentages)
    label_names_dict = dict(response.label_names)

    return response.predicted_label, percentages_list, label_names_dict