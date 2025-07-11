import ssl
import joblib
import mysql.connector
import nltk
from data.database import get_db_connection
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

# Désactiver la vérification SSL pour le téléchargement des stopwords
ssl._create_default_https_context = ssl._create_unverified_context

# Télécharger les stopwords (si ce n'est pas déjà fait)
nltk.download("stopwords")
from nltk.corpus import stopwords

# Fonction pour récupérer les tweets stockés en base
def get_training_data():
    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("SELECT text, positive, negative FROM tweets")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    X_train = [row[0] for row in data]  # Texte des tweets
    y_train = [1 if row[1] == 1 else 0 for row in data]  # Labels (1 positif, 0 négatif)

    return X_train, y_train

# Récupérer les données
X_train, y_train = get_training_data()

if len(X_train) > 0:  # Vérifier si on a des tweets en base
    print(f"Réentraînement avec {len(X_train)} tweets...")

    # Vectorisation du texte
    vectorizer = CountVectorizer(stop_words=stopwords.words("french"))
    X_train_vectorized = vectorizer.fit_transform(X_train)

    # Réentraîner le modèle
    model = LogisticRegression()
    model.fit(X_train_vectorized, y_train)

    # Sauvegarder le nouveau modèle
    joblib.dump(model, "sentiment_model.joblib")
    joblib.dump(vectorizer, "vectorizer.joblib")

    print("✅ Modèle réentraîné et sauvegardé avec succès !")
else:
    print("❌ Pas assez de tweets en base pour réentraîner le modèle.")