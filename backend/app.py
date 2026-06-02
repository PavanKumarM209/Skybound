import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Enable CORS for all routes (important for local development & staging)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/skybound")
logger.info(f"Connecting to MongoDB at {MONGO_URI}")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client.get_default_database("skybound")
    destinations_collection = db["destinations"]
    # Check connection
    client.server_info()
    logger.info("Successfully connected to MongoDB.")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    destinations_collection = None

# Initialize database with some default destinations if empty
def init_db():
    if destinations_collection is not None and destinations_collection.count_documents({}) == 0:
        default_destinations = [
            {
                "title": "Mount Everest, Nepal",
                "description": "Reach the rooftop of the world and feel the sky bound.",
                "difficulty": "Extreme",
                "altitude": "8,848m",
                "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop"
            },
            {
                "title": "Cappadocia, Turkey",
                "description": "Drift in hot air balloons over spectacular fairy chimneys.",
                "difficulty": "Easy",
                "altitude": "1,000m",
                "image_url": "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=600&auto=format&fit=crop"
            },
            {
                "title": "Swiss Alps, Switzerland",
                "description": "Soar above alpine lakes and snow-covered peaks.",
                "difficulty": "Medium",
                "altitude": "4,809m",
                "image_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop"
            }
        ]
        destinations_collection.insert_many(default_destinations)
        logger.info("Initialized database with default destinations.")

try:
    init_db()
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")

@app.route("/api/health", methods=["GET"])
def health_check():
    db_status = "connected"
    try:
        if client:
            client.server_info()
        else:
            db_status = "disconnected"
    except Exception:
        db_status = "disconnected"
        
    return jsonify({
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "service": "Flask API"
    }), 200

@app.route("/api/destinations", methods=["GET"])
def get_destinations():
    if destinations_collection is None:
        return jsonify({"error": "Database not available"}), 500
    try:
        destinations = []
        for doc in destinations_collection.find():
            doc["_id"] = str(doc["_id"])
            destinations.append(doc)
        return jsonify(destinations), 200
    except Exception as e:
        logger.error(f"Error fetching destinations: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/destinations", methods=["POST"])
def add_destination():
    if destinations_collection is None:
        return jsonify({"error": "Database not available"}), 500
    try:
        data = request.json
        if not data or not data.get("title") or not data.get("description"):
            return jsonify({"error": "Title and description are required"}), 400
            
        new_destination = {
            "title": data["title"],
            "description": data["description"],
            "difficulty": data.get("difficulty", "Medium"),
            "altitude": data.get("altitude", "Unknown"),
            "image_url": data.get("image_url", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop")
        }
        
        result = destinations_collection.insert_one(new_destination)
        new_destination["_id"] = str(result.inserted_id)
        
        return jsonify(new_destination), 201
    except Exception as e:
        logger.error(f"Error adding destination: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
