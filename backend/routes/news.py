from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

from config import logger
from database import db, db_connected

news_bp = Blueprint('news', __name__)

# ----------------- NEWS ENDPOINTS -----------------
@news_bp.route("/api/news", methods=["GET"])
def get_news():
    if db_connected and db is not None:
        try:
            news = []
            for doc in db["news"].find().sort("date", -1):
                doc["_id"] = str(doc["_id"])
                news.append(doc)
            return jsonify(news), 200
        except Exception as e:
            logger.error(f"Mongo fetch news error: {e}")

    return jsonify({"error": "Database error or disconnected"}), 500

@news_bp.route("/api/news", methods=["POST"])
def add_news():
    req_data = request.json or {}
    if not req_data.get("title") or not req_data.get("description"):
        return jsonify({"error": "Title and description are required"}), 400

    new_item = {
        "title": req_data["title"],
        "description": req_data["description"],
        "organizer": req_data.get("organizer", "Dojo"),
        "date": req_data.get("date", "2026-06-03"),
        "image_url": req_data.get("image_url", "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop")
    }

    if db_connected and db is not None:
        try:
            result = db["news"].insert_one(new_item)
            new_item["_id"] = str(result.inserted_id)
            return jsonify(new_item), 201
        except Exception as e:
            logger.error(f"Mongo add news error: {e}")

    return jsonify({"error": "Database error or disconnected"}), 500

@news_bp.route("/api/news/<id>", methods=["DELETE"])
def delete_news(id):
    if db_connected and db is not None:
        try:
            query_id = id
            try:
                query_id = ObjectId(id)
            except Exception:
                pass
            result = db["news"].delete_one({"_id": query_id})
            if result.deleted_count > 0:
                return jsonify({"success": True}), 200
        except Exception as e:
            logger.error(f"Mongo delete news error: {e}")
    return jsonify({"error": "News not found or database disconnected"}), 404
