import os
import json
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

# MongoDB Connection settings
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/skybound")
logger.info(f"Connecting to MongoDB at {MONGO_URI}")

db_connected = False
client = None
db = None

# Local JSON Fallback DB Settings
JSON_DB_PATH = os.path.join(os.path.dirname(__file__), "db.json")

DEFAULT_DB = {
    "dojo_info": {
        "name": "Sky Bound Martial Arts Academy",
        "phone": "+91 85100 00838",
        "email": "contact@skyboundkarate.in",
        "address": "X-1/32, Daal Mill Road, Budh Vihar, Phase-1, New Delhi-110086, India",
        "map_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.4239857905183!2d77.098485!3d28.736785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d068593a201c1%3A0xe54fb7a28e932ec3!2sBudh%20Vihar%20Phase%20I%2C%20Budh%20Vihar%2C%20Delhi%2C%20110086!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        "affiliations": [
            {"name": "Goju-Ryu Karate-Do Sports Federation"},
            {"name": "Martial Arts Games Federation of India (MGFI)"},
            {"name": "Karate India Organisation (KIO)"},
            {"name": "Delhi Olympic Association"}
        ]
    },
    "instructors": [
        {
            "_id": "inst_1",
            "name": "Sensei Pavan Kumar M",
            "rank": "Black Belt 2nd Dan",
            "role": "Coach (KIO)",
            "location": "Bangalore, Karnataka",
            "phone": "+91 6362630742",
            "email": "pavankumarm209@gmail.com",
            "image_url": "C:\\Users\\Pavan kumar M\\OneDrive\\Pictures\\Camera Roll\\1VE22CS109_PAVAN_KUMAR_M.jpeg"
        },
        {
            "_id": "inst_2",
            "name": "Sensei Samarth",
            "rank": "Black Belt 2nd Dan",
            "role": "Senior Coach",
            "location": "Bangalore, Karnataka",
            "phone": "+91 8510000838",
            "email": "samarth12@gmail.com",
            "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_3",
            "name": "Sensei nitya",
            "rank": "Black Belt 2st Dan",
            "role": "Instructor (KFP)",
            "location": "Bangalore, Karnataka",
            "phone": "+91 9069118692",
            "email": "tarun123@gmail.com",
            "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_4",
            "name": "Sensei Lakshay Mittal",
            "rank": "Black Belt 2nd Dan (KAI)",
            "role": "Instructor",
            "location": "Rama Vihar, Delhi",
            "phone": "+91 9599712469",
            "email": "lakshay@example.com",
            "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_5",
            "name": "Sampai Rishap Yadav",
            "rank": "Black Belt 1st Dan (GKSF)",
            "role": "Assistant Instructor",
            "location": "Mundka, Delhi",
            "phone": "+91 9540607078",
            "email": "rishap@example.com",
            "image_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop"
        }
    ],
    "news": [
        {
            "_id": "news_1",
            "title": "6th Royal Challenges Cup 2022",
            "organizer": "TRADI",
            "date": "2022-10-15",
            "description": "Annual championship attracting teams from multiple states. Focus on Kumite and Kata categories.",
            "image_url": "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop"
        },
        {
            "_id": "news_2",
            "title": "KSKAI ALL INDIA KARATE CHAMPIONSHIP 2022",
            "organizer": "KSKAI",
            "date": "2022-12-05",
            "description": "Elite tournament for brown and black belts to qualify for national selections.",
            "image_url": "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=600&auto=format&fit=crop"
        }
    ],
    "bookings": [
        {
            "_id": "book_1",
            "student_name": "Aarav Sharma",
            "student_age": 8,
            "phone": "+91 99999 88888",
            "program": "Regular Training",
            "date": "2026-06-10",
            "status": "Pending"
        },
        {
            "_id": "book_2",
            "student_name": "Pooja Patel",
            "student_age": 12,
            "phone": "+91 98888 77777",
            "program": "Belt Grading",
            "date": "2026-06-12",
            "status": "Confirmed"
        }
    ]
}

def load_json_db():
    if not os.path.exists(JSON_DB_PATH):
        try:
            with open(JSON_DB_PATH, "w") as f:
                json.dump(DEFAULT_DB, f, indent=4)
            return DEFAULT_DB
        except Exception as e:
            logger.error(f"Failed to create json db file: {e}")
            return DEFAULT_DB
    try:
        with open(JSON_DB_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to read json db: {e}")
        return DEFAULT_DB

def save_json_db(data):
    try:
        with open(JSON_DB_PATH, "w") as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        logger.error(f"Failed to save json db: {e}")

# Attempt MongoDB connection
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client.get_default_database("skybound")
    # Ping
    client.server_info()
    db_connected = True
    logger.info("Successfully connected to MongoDB.")
except Exception as e:
    logger.error(f"MongoDB not available, using local JSON fallback: {e}")
    db_connected = False
    client = None
    db = None

# Initialize MongoDB if connected
def init_mongodb():
    if not db_connected or db is None:
        return
        
    try:
        # Seeding dojo_info
        if db["dojo_info"].count_documents({}) == 0:
            db["dojo_info"].insert_one(DEFAULT_DB["dojo_info"])
            logger.info("Seeded MongoDB dojo_info.")
            
        # Seeding instructors
        if db["instructors"].count_documents({}) == 0:
            db["instructors"].insert_many(DEFAULT_DB["instructors"])
            logger.info("Seeded MongoDB instructors.")
            
        # Seeding news
        if db["news"].count_documents({}) == 0:
            db["news"].insert_many(DEFAULT_DB["news"])
            logger.info("Seeded MongoDB news.")
            
        # Seeding bookings
        if db["bookings"].count_documents({}) == 0:
            db["bookings"].insert_many(DEFAULT_DB["bookings"])
            logger.info("Seeded MongoDB bookings.")
            
    except Exception as ex:
        logger.error(f"Error seeding MongoDB: {ex}")

# Trigger initialization
if db_connected:
    init_mongodb()
else:
    # Ensure JSON DB exists locally
    load_json_db()

@app.route("/api/health", methods=["GET"])
def health_check():
    status = "healthy"
    db_status = "connected" if db_connected else "disconnected"
    return jsonify({
        "status": status,
        "database": db_status,
        "service": "Flask API (Local Fallback Mode)" if not db_connected else "Flask API"
    }), 200

# ----------------- DOJO INFO ENDPOINTS -----------------
@app.route("/api/dojo-info", methods=["GET"])
def get_dojo_info():
    if db_connected and db is not None:
        try:
            info = db["dojo_info"].find_one()
            if info:
                info["_id"] = str(info["_id"])
                return jsonify(info), 200
        except Exception as e:
            logger.error(f"Mongo fetch error: {e}")
            
    # JSON Fallback
    data = load_json_db()
    return jsonify(data["dojo_info"]), 200

@app.route("/api/dojo-info", methods=["POST"])
def update_dojo_info():
    req_data = request.json or {}
    update_data = {
        "name": req_data.get("name"),
        "phone": req_data.get("phone"),
        "email": req_data.get("email"),
        "address": req_data.get("address"),
        "map_embed": req_data.get("map_embed"),
        "affiliations": req_data.get("affiliations", DEFAULT_DB["dojo_info"]["affiliations"])
    }
    # Filter out None values
    update_data = {k: v for k, v in update_data.items() if v is not None}

    if db_connected and db is not None:
        try:
            current_info = db["dojo_info"].find_one()
            if current_info:
                db["dojo_info"].update_one({"_id": current_info["_id"]}, {"$set": update_data})
            else:
                db["dojo_info"].insert_one(update_data)
                
            updated = db["dojo_info"].find_one()
            updated["_id"] = str(updated["_id"])
            return jsonify(updated), 200
        except Exception as e:
            logger.error(f"Mongo update settings error: {e}")

    # JSON Fallback
    db_data = load_json_db()
    db_data["dojo_info"].update(update_data)
    save_json_db(db_data)
    return jsonify(db_data["dojo_info"]), 200

# ----------------- INSTRUCTORS ENDPOINTS -----------------
@app.route("/api/instructors", methods=["GET"])
def get_instructors():
    if db_connected and db is not None:
        try:
            instructors = []
            for doc in db["instructors"].find():
                doc["_id"] = str(doc["_id"])
                instructors.append(doc)
            return jsonify(instructors), 200
        except Exception as e:
            logger.error(f"Mongo fetch instructors error: {e}")

    # JSON Fallback
    db_data = load_json_db()
    return jsonify(db_data["instructors"]), 200

@app.route("/api/instructors", methods=["POST"])
def add_instructor():
    req_data = request.json or {}
    if not req_data.get("name") or not req_data.get("rank"):
        return jsonify({"error": "Name and rank are required"}), 400

    new_instructor = {
        "name": req_data["name"],
        "rank": req_data["rank"],
        "role": req_data.get("role", "Instructor"),
        "location": req_data.get("location", ""),
        "phone": req_data.get("phone", ""),
        "email": req_data.get("email", ""),
        "image_url": req_data.get("image_url", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop")
    }

    if db_connected and db is not None:
        try:
            result = db["instructors"].insert_one(new_instructor)
            new_instructor["_id"] = str(result.inserted_id)
            return jsonify(new_instructor), 201
        except Exception as e:
            logger.error(f"Mongo add instructor error: {e}")

    # JSON Fallback
    db_data = load_json_db()
    new_instructor["_id"] = f"inst_{str(int(len(db_data['instructors']) + 10))}"
    db_data["instructors"].append(new_instructor)
    save_json_db(db_data)
    return jsonify(new_instructor), 201

@app.route("/api/instructors/<id>", methods=["DELETE"])
def delete_instructor(id):
    if db_connected and db is not None:
        try:
            result = db["instructors"].delete_one({"_id": ObjectId(id)})
            if result.deleted_count > 0:
                return jsonify({"success": True}), 200
        except Exception as e:
            logger.error(f"Mongo delete instructor error: {e}")

    # JSON Fallback
    db_data = load_json_db()
    original_len = len(db_data["instructors"])
    db_data["instructors"] = [i for i in db_data["instructors"] if i.get("_id") != id]
    if len(db_data["instructors"]) < original_len:
        save_json_db(db_data)
        return jsonify({"success": True}), 200
    return jsonify({"error": "Instructor not found"}), 404

# ----------------- NEWS ENDPOINTS -----------------
@app.route("/api/news", methods=["GET"])
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

    # JSON Fallback
    db_data = load_json_db()
    sorted_news = sorted(db_data["news"], key=lambda k: k.get("date", ""), reverse=True)
    return jsonify(sorted_news), 200

@app.route("/api/news", methods=["POST"])
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

    # JSON Fallback
    db_data = load_json_db()
    new_item["_id"] = f"news_{str(int(len(db_data['news']) + 10))}"
    db_data["news"].append(new_item)
    save_json_db(db_data)
    return jsonify(new_item), 201

@app.route("/api/news/<id>", methods=["DELETE"])
def delete_news(id):
    if db_connected and db is not None:
        try:
            result = db["news"].delete_one({"_id": ObjectId(id)})
            if result.deleted_count > 0:
                return jsonify({"success": True}), 200
        except Exception as e:
            logger.error(f"Mongo delete news error: {e}")

    # JSON Fallback
    db_data = load_json_db()
    original_len = len(db_data["news"])
    db_data["news"] = [item for item in db_data["news"] if item.get("_id") != id]
    if len(db_data["news"]) < original_len:
        save_json_db(db_data)
        return jsonify({"success": True}), 200
    return jsonify({"error": "News not found"}), 404

# ----------------- BOOKINGS ENDPOINTS -----------------
@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    if db_connected and db is not None:
        try:
            bookings = []
            for doc in db["bookings"].find():
                doc["_id"] = str(doc["_id"])
                bookings.append(doc)
            return jsonify(bookings), 200
        except Exception as e:
            logger.error(f"Mongo fetch bookings error: {e}")

    # JSON Fallback
    db_data = load_json_db()
    return jsonify(db_data["bookings"]), 200

@app.route("/api/bookings", methods=["POST"])
def add_booking():
    req_data = request.json or {}
    if not req_data.get("student_name") or not req_data.get("phone"):
        return jsonify({"error": "Student name and phone number are required"}), 400

    new_booking = {
        "student_name": req_data["student_name"],
        "student_age": int(req_data.get("student_age", 4)),
        "phone": req_data["phone"],
        "program": req_data.get("program", "Regular Training"),
        "date": req_data.get("date", ""),
        "status": "Pending"
    }

    if db_connected and db is not None:
        try:
            result = db["bookings"].insert_one(new_booking)
            new_booking["_id"] = str(result.inserted_id)
            return jsonify(new_booking), 201
        except Exception as e:
            logger.error(f"Mongo add booking error: {e}")

    # JSON Fallback
    db_data = load_json_db()
    new_booking["_id"] = f"book_{str(int(len(db_data['bookings']) + 10))}"
    db_data["bookings"].append(new_booking)
    save_json_db(db_data)
    return jsonify(new_booking), 201

@app.route("/api/bookings/<id>", methods=["PATCH"])
def update_booking_status(id):
    req_data = request.json or {}
    status = req_data.get("status")
    if not status or status not in ["Pending", "Confirmed", "Completed", "Archived"]:
        return jsonify({"error": "Invalid status value"}), 400

    if db_connected and db is not None:
        try:
            result = db["bookings"].update_one({"_id": ObjectId(id)}, {"$set": {"status": status}})
            if result.modified_count > 0 or result.matched_count > 0:
                return jsonify({"success": True, "status": status}), 200
        except Exception as e:
            logger.error(f"Mongo update booking error: {e}")

    # JSON Fallback
    db_data = load_json_db()
    found = False
    for b in db_data["bookings"]:
        if b.get("_id") == id:
            b["status"] = status
            found = True
            break
    if found:
        save_json_db(db_data)
        return jsonify({"success": True, "status": status}), 200
    return jsonify({"error": "Booking not found"}), 404

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
