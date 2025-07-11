import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",  # Change selon ton utilisateur MySQL
        password="rootroot",  # Ton mot de passe MySQL
        database="sentiment_analysis"
    )
