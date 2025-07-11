from flask import Flask, request, jsonify
import joblib
from data.database import get_db_connection

# Charger le modèle et le vectorizer
model = joblib.load("sentiment_model.joblib")
vectorizer = joblib.load("vectorizer.joblib")

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API Sentiment Analysis connectée à MySQL ! 🚀"})

@app.route("/analyze", methods=["POST"])
def analyze_sentiment():
    data = request.get_json()

    if not data or "tweets" not in data:
        return jsonify({"error": "Format invalide, veuillez envoyer une liste de tweets."}), 400

    tweets = data["tweets"]
    tweets_vectorized = vectorizer.transform(tweets)
    predictions = model.predict(tweets_vectorized)

    results = {}
    conn = get_db_connection()
    cursor = conn.cursor()

    for tweet, label in zip(tweets, predictions):
        sentiment = "Positif" if label == 1 else "Négatif"
        results[tweet] = sentiment

        # Enregistrer dans la base de données
        cursor.execute(
            "INSERT INTO tweets (text, positive, negative) VALUES (%s, %s, %s)",
            (tweet, 1 if label == 1 else 0, 1 if label == 0 else 0)
        )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(results)

@app.route("/tweets", methods=["GET"])
def get_tweets():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tweets")
    tweets = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tweets)

if __name__ == "__main__":
    app.run(debug=True)
