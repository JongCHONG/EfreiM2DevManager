import joblib
import nltk
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import os

nltk.download("stopwords")
from nltk.corpus import stopwords

# Liste de tweets annotés (dataset d'exemple)
tweets = [
    ("J'adore ce produit, il est génial !", 1),
    ("C'est horrible, je déteste ça.", 0),
    ("Quelle belle journée !", 1),
    ("Ce film est trop nul.", 0),
    ("Je ne sais pas quoi penser, c'est moyen.", 0),
    ("Superbe qualité, je recommande !", 1),
    ("Ce service est une catastrophe.", 0)
]

# Séparer les textes et les labels
X_train = [tweet[0] for tweet in tweets]
y_train = [tweet[1] for tweet in tweets]

# Vectorisation du texte (Bag of Words)
vectorizer = CountVectorizer(stop_words=stopwords.words("french"))
X_train_vectorized = vectorizer.fit_transform(X_train)

# Entraînement du modèle
model = LogisticRegression()
model.fit(X_train_vectorized, y_train)

# Sauvegarde du modèle et du vectorizer
joblib.dump(model, "sentiment_model.joblib")
joblib.dump(vectorizer, "vectorizer.joblib")

print("Modèle entraîné et sauvegardé ! ✅")
