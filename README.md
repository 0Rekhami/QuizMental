# 🧠 QuizMental

**Prédiction de l'état mental à partir d'un quiz, avec React, gRPC et Machine Learning.**

QuizMental est une application web où l'utilisateur répond à un questionnaire. Les réponses sont envoyées via **gRPC** à un backend qui les analyse avec un modèle de Machine Learning pour prédire un état mental (par exemple : stress, anxiété, bien-être).

> ⚠️ **Avertissement** : ce projet est à but éducatif. Il ne remplace en aucun cas un avis médical ou psychologique professionnel.

---

## ✨ Fonctionnalités

- Quiz interactif côté interface React
- Communication client/serveur performante via gRPC (Protocol Buffers)
- Prédiction de l'état mental par un modèle de Machine Learning
- Gestion des profils utilisateurs avec photo (`profile_pictures/`)

## 🏗️ Architecture

```
┌──────────────┐    gRPC / Protobuf    ┌──────────────┐      ┌──────────────┐
│   Frontend   │ ────────────────────► │   Backend    │ ───► │  Modèle ML   │
│    (React)   │ ◄──────────────────── │ (serveur     │ ◄─── │ (prédiction) │
│              │      réponse          │   gRPC)      │      │              │
└──────────────┘                       └──────────────┘      └──────────────┘
```

## 📁 Structure du projet

```
my-react-ml-grpc/
├── Backend/            # Serveur gRPC, logique métier et modèle ML
├── Frontend/           # Application React (interface du quiz)
├── profile_pictures/   # Photos de profil des utilisateurs
├── .vscode/            # Configuration VS Code
└── .gitignore
```

## 🛠️ Technologies

| Couche | Technologies |
|--------|--------------|
| Frontend | React, JavaScript |
| Communication | gRPC, Protocol Buffers |
| Backend | `<Python / autre>` |
| Machine Learning | `<scikit-learn / TensorFlow / autre>` |

## 🚀 Installation et lancement

### Prérequis

- Node.js (v18 ou plus)
- `<Python 3.10+>`
- Git

### 1. Cloner le dépôt

```bash
git clone https://github.com/0Rekhami/my-react-ml-grpc.git
cd my-react-ml-grpc
```

### 2. Lancer le Backend

```bash
cd Backend
pip install -r requirements.txt
python server.py
```

### 3. Lancer le Frontend

```bash
cd Frontend
npm install
npm start
```

L'application est ensuite accessible sur `http://localhost:3000`.

## 🔌 Exemple de contrat gRPC

```proto
service MentalService {
  rpc Predict (QuizRequest) returns (PredictionResponse);
}

message QuizRequest {
  repeated int32 answers = 1;
}

message PredictionResponse {
  string mental_state = 1;
  float confidence = 2;
}
```

## 🗺️ Pistes d'amélioration

- [ ] Ajouter des tests unitaires
- [ ] Dockeriser le backend et le frontend
- [ ] Améliorer le modèle et documenter ses performances
- [ ] Ajouter une authentification

## 👤 Auteur

**Abdessamad Rekhami**
GitHub : [@0Rekhami](https://github.com/0Rekhami)
