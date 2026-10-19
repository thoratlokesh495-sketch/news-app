import os

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)


API_KEY = os.environ.get("c3452460cdec41a590d05ff51117d4f2")

BASE_URL = "https://newsapi.org/v2/top-headlines"


@app.route("/")
def home():

    return "News App Backend is Running!"


@app.route("/api/news")
def get_news():

    category = request.args.get("category", "general")

    params = {
        "apiKey": API_KEY,
        "country": "us",
        "category": category,
        "pageSize": 10
    }

    response = requests.get(
        BASE_URL,
        params=params
    )

    if response.status_code != 200:

        return jsonify({
            "error": "Unable to fetch news"
        }), response.status_code

    data = response.json()

    return jsonify(data.get("articles", []))


@app.route("/api/search")
def search_news():

    keyword = request.args.get("q", "")

    if not keyword:

        return jsonify([])

    url = "https://newsapi.org/v2/everything"

    params = {
        "apiKey": API_KEY,
        "q": keyword,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 10
    }

    response = requests.get(
        url,
        params=params
    )

    if response.status_code != 200:

        return jsonify({
            "error": "Unable to search news"
        }), response.status_code

    data = response.json()

    return jsonify(data.get("articles", []))


if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )
