import os
import json
import logging
import jwt as pyjwt
from datetime import datetime, timedelta, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import certifi

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Enable CORS for all routes (important for local development & staging)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# MongoDB Connection settings
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/skybound")
JWT_SECRET = os.getenv("JWT_SECRET", "skybound-super-secret-key-change-in-production")
JWT_EXPIRY_HOURS = 24
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
            {"name": "Shotokon Karate-Do Sports Federation"},
            {"name": "Martial Arts Games Federation of India (MGFI)"},
            {"name": "Karate India Organisation (KIO)"},
            {"name": "Delhi Olympic Association"}
        ]
    },
    "trustees": [
        {
            "_id": "tr_1",
            "name": "Renshi Umapathi S S",
            "role": "Founder, President & Chief Coach",
            "image_url": "/umapathi_ss.png"
        },
        {
            "_id": "tr_2",
            "name": "Nethravathi M B",
            "role": "Founder / Treasurer",
            "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "tr_3",
            "name": "Somashekhar S S",
            "role": "Trustee",
            "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
        }
    ],
    "instructors": [
        {
            "_id": "inst_1",
            "name": "Sensei Samarth S",
            "rank": "Black Belt 3rd Dan",
            "role": "Head Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 8510000838",
            "email": "samarth@example.com",
            "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_2",
            "name": "Sensei Pavan Kumar M",
            "rank": "Black Belt 2nd Dan",
            "role": "Head Examiner",
            "location": "Bangalore, Karnataka",
            "phone": "+91 6362630742",
            "email": "pavankumarm209@gmail.com",
            "image_url": "C:\\Users\\Pavan kumar M\\OneDrive\\Pictures\\Camera Roll\\1VE22CS109_PAVAN_KUMAR_M.jpeg"
        },
        {
            "_id": "inst_3",
            "name": "Sensei Chandana U S",
            "rank": "Black Belt 2nd Dan",
            "role": "Disciplinary Head and Data Analyst",
            "location": "Bangalore, Karnataka",
            "phone": "+91 77777 66666",
            "email": "chandana@example.com",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_4",
            "name": "Sensei Nithyanandham P",
            "rank": "Black Belt 2nd Dan",
            "role": "Kata and Technical Head",
            "location": "Bangalore, Karnataka",
            "phone": "+91 9069118692",
            "email": "nithyanandham@example.com",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_5",
            "name": "Sensei Ajay P K",
            "rank": "Black Belt 2nd Dan",
            "role": "Kubudo Head",
            "location": "Bangalore, Karnataka",
            "phone": "+91 33333 22222",
            "email": "ajay@example.com",
            "image_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_6",
            "name": "Sensei Sannidhi S",
            "rank": "Black Belt 2nd Dan",
            "role": "Kumite and Kickboxing Head",
            "location": "Bangalore, Karnataka",
            "phone": "+91 55555 44444",
            "email": "sannidhi@example.com",
            "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_7",
            "name": "Sensei Deva Dharshini",
            "rank": "Black Belt 2nd Dan",
            "role": "Tournament Head",
            "location": "Bangalore, Karnataka",
            "phone": "+91 22222 11111",
            "email": "devadharshini@example.com",
            "image_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_8",
            "name": "Sensei Rishith M",
            "rank": "Black Belt 2nd Dan",
            "role": "Media Officer and Financial Advisor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 66666 55555",
            "email": "rishith@example.com",
            "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
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
    ],
    "supporting_instructors": [
        {
            "_id": "supp_1",
            "name": "Sempai Pallavi",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 11111",
            "email": "pallavi@example.com",
            "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "supp_2",
            "name": "Sempai Yashaswini M",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 22222",
            "email": "yashaswini@example.com",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "supp_3",
            "name": "Sempai Shravya S Hegde",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 33333",
            "email": "shravya@example.com",
            "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "supp_4",
            "name": "Sempai Trisha",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 44444",
            "email": "trisha@example.com",
            "image_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "supp_5",
            "name": "Sempai Phanindra Achari V",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 55555",
            "email": "phanindra@example.com",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
        }
    ]
}


# MongoDB connection attempt
try:
    client = MongoClient(
        MONGO_URI, 
        serverSelectionTimeoutMS=5000,
        tlsAllowInvalidCertificates=True
    )
    # Ping
    client.server_info()
    # Explicitly set the database
    db = client["skybound"]
    db_connected = True
    logger.info("Successfully connected to MongoDB Atlas.")
except Exception as e:
    logger.critical(f"FATAL: MongoDB not available. Enforcing MongoDB only mode: {e}")
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
            
        # Seeding trustees
        if db["trustees"].count_documents({}) == 0:
            db["trustees"].insert_many(DEFAULT_DB["trustees"])
            logger.info("Seeded MongoDB trustees.")
            
        # Seeding news
        if db["news"].count_documents({}) == 0:
            db["news"].insert_many(DEFAULT_DB["news"])
            logger.info("Seeded MongoDB news.")
            
        # Seeding bookings
        if db["bookings"].count_documents({}) == 0:
            db["bookings"].insert_many(DEFAULT_DB["bookings"])
            logger.info("Seeded MongoDB bookings.")
            
        # Seeding supporting_instructors
        if db["supporting_instructors"].count_documents({}) == 0:
            db["supporting_instructors"].insert_many(DEFAULT_DB["supporting_instructors"])
            logger.info("Seeded MongoDB supporting_instructors.")

        # Ensure Users collection exists and has unique index on username
        if "users" not in db.list_collection_names():
            db.create_collection("users")
            db["users"].create_index("username", unique=True)
            logger.info("Created users collection with unique index on username.")
            
    except Exception as ex:
        logger.error(f"Error seeding MongoDB: {ex}")

# Trigger initialization
if db_connected:
    init_mongodb()
else:
    logger.error("Skipping MongoDB initialization due to connection failure.")

@app.route("/api/health", methods=["GET"])
def health_check():
    status = "healthy"
    db_status = "connected" if db_connected else "disconnected"
    return jsonify({
        "status": status,
        "database": db_status,
        "service": "Flask API (Local Fallback Mode)" if not db_connected else "Flask API"
    }), 200

# ----------------- TRUSTEES ENDPOINTS -----------------
@app.route("/api/trustees", methods=["GET"])
def get_trustees():
    if db_connected and db is not None:
        try:
            trustees = []
            for doc in db["trustees"].find():
                doc["_id"] = str(doc["_id"])
                trustees.append(doc)
            return jsonify(trustees), 200
        except Exception as e:
            logger.error(f"Mongo fetch trustees error: {e}")
    return jsonify({"error": "Database error or disconnected"}), 500

# ----------------- SUPPORTING INSTRUCTORS ENDPOINTS -----------------
@app.route("/api/supporting-instructors", methods=["GET"])
def get_supporting_instructors():
    if db_connected and db is not None:
        try:
            supporting = []
            for doc in db["supporting_instructors"].find():
                doc["_id"] = str(doc["_id"])
                supporting.append(doc)
            return jsonify(supporting), 200
        except Exception as e:
            logger.error(f"Mongo fetch supporting error: {e}")
    return jsonify({"error": "Database error or disconnected"}), 500


@app.route("/api/supporting-instructors", methods=["POST"])
def add_supporting_instructor():
    req_data = request.json or {}
    if not req_data.get("name") or not req_data.get("rank"):
        return jsonify({"error": "Name and rank are required"}), 400

    new_instructor = {
        "name": req_data["name"],
        "rank": req_data["rank"],
        "role": req_data.get("role", "Supporting Instructor"),
        "location": req_data.get("location", ""),
        "phone": req_data.get("phone", ""),
        "email": req_data.get("email", ""),
        "image_url": req_data.get("image_url", "")
    }

    if db_connected and db is not None:
        try:
            from werkzeug.security import generate_password_hash
            from datetime import datetime, timezone

            # Create user account if email provided
            inst_email = new_instructor.get("email")
            if inst_email:
                user_exists = db["users"].find_one({"email": inst_email})
                if not user_exists:
                    new_user = {
                        "username": inst_email.split('@')[0],
                        "email": inst_email,
                        "role": "instructor",
                        "password_hashed": generate_password_hash("password123"),
                        "force_password_change": True,
                        "created_at": datetime.now(timezone.utc).isoformat()
                    }
                    db["users"].insert_one(new_user)

            result = db["supporting_instructors"].insert_one(new_instructor)
            new_instructor["_id"] = str(result.inserted_id)
            return jsonify(new_instructor), 201
        except Exception as e:
            logger.error(f"Mongo add supporting instructor error: {e}")

    return jsonify({"error": "Database error or disconnected"}), 500

@app.route("/api/supporting-instructors/<id>", methods=["DELETE"])
def delete_supporting_instructor(id):
    if db_connected and db is not None:
        try:
            result = db["supporting_instructors"].delete_one({"_id": ObjectId(id)})
            if result.deleted_count > 0:
                return jsonify({"success": True}), 200
        except Exception as e:
            logger.error(f"Mongo delete supporting instructor error: {e}")

    return jsonify({"error": "Supporting instructor not found or database disconnected"}), 404

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
            
    return jsonify({"error": "Dojo info not found or database disconnected"}), 404

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

    return jsonify({"error": "Database error or disconnected"}), 500

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

    return jsonify({"error": "Database error or disconnected"}), 500

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
        "image_url": req_data.get("image_url", "")
    }

    if db_connected and db is not None:
        try:
            from werkzeug.security import generate_password_hash
            from datetime import datetime, timezone
            
            # Create a user account if an email is provided
            inst_email = new_instructor.get("email")
            if inst_email:
                user_exists = db["users"].find_one({"email": inst_email})
                if not user_exists:
                    new_user = {
                        "username": inst_email.split('@')[0],
                        "email": inst_email,
                        "role": "instructor",
                        "password_hashed": generate_password_hash("password123"),
                        "force_password_change": True,
                        "created_at": datetime.now(timezone.utc).isoformat()
                    }
                    db["users"].insert_one(new_user)

            result = db["instructors"].insert_one(new_instructor)
            new_instructor["_id"] = str(result.inserted_id)
            return jsonify(new_instructor), 201
        except Exception as e:
            logger.error(f"Mongo add instructor error: {e}")

    return jsonify({"error": "Database error or disconnected"}), 500

@app.route("/api/instructors/<id>", methods=["DELETE"])
def delete_instructor(id):
    if db_connected and db is not None:
        try:
            result = db["instructors"].delete_one({"_id": ObjectId(id)})
            if result.deleted_count > 0:
                return jsonify({"success": True}), 200
        except Exception as e:
            logger.error(f"Mongo delete instructor error: {e}")

    return jsonify({"error": "Instructor not found or database disconnected"}), 404

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

    return jsonify({"error": "Database error or disconnected"}), 500

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

    return jsonify({"error": "Database error or disconnected"}), 500

@app.route("/api/news/<id>", methods=["DELETE"])
def delete_news(id):
    if db_connected and db is not None:
        try:
            result = db["news"].delete_one({"_id": ObjectId(id)})
            if result.deleted_count > 0:
                return jsonify({"success": True}), 200
        except Exception as e:
            logger.error(f"Mongo delete news error: {e}")
    return jsonify({"error": "News not found or database disconnected"}), 404

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

    return jsonify({"error": "Database error or disconnected"}), 500

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

    return jsonify({"error": "Database error or disconnected"}), 500

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

    return jsonify({"error": "Booking not found or database disconnected"}), 404

# ----------------- USERS ENDPOINTS -----------------
@app.route("/api/users", methods=["GET"])
def get_users():
    if db_connected and db is not None:
        try:
            users = []
            for doc in db["users"].find():
                doc["_id"] = str(doc["_id"])
                # Don't return hashed passwords in list
                if "password_hashed" in doc:
                    del doc["password_hashed"]
                users.append(doc)
            return jsonify(users), 200
        except Exception as e:
            logger.error(f"Mongo fetch users error: {e}")
    
    return jsonify({"error": "Database error or disconnected"}), 500

@app.route("/api/users", methods=["POST"])
def register_user():
    req_data = request.json or {}
    required_fields = ["username", "email", "role", "position", "phone_number", "photo_image_url", "password"]
    
    for field in required_fields:
        if not req_data.get(field):
            return jsonify({"error": f"Field '{field}' is required"}), 400

    new_user = {
        "username": req_data["username"],
        "email": req_data["email"],
        "role": req_data["role"],
        "position": req_data["position"],
        "phone_number": req_data["phone_number"],
        "photo_image_url": req_data["photo_image_url"],
        "password_hashed": generate_password_hash(req_data["password"]),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    if db_connected and db is not None:
        try:
            # Check if user already exists
            if db["users"].find_one({"username": req_data["username"]}):
                return jsonify({"error": "Username already exists"}), 409
            
            result = db["users"].insert_one(new_user)
            new_user["_id"] = str(result.inserted_id)
            del new_user["password_hashed"]
            return jsonify(new_user), 201
        except Exception as e:
            logger.error(f"Error registering user: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Database not connected"}), 500

def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token is missing"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except pyjwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except pyjwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route("/api/verify-token", methods=["POST"])
def verify_token():
    """Verify a JWT token and return the decoded user payload."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    token = auth_header.split(" ", 1)[1]
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        # Remove JWT metadata fields
        payload.pop("exp", None)
        payload.pop("iat", None)
        return jsonify({"valid": True, "user": payload}), 200
    except pyjwt.ExpiredSignatureError:
        return jsonify({"valid": False, "error": "Token has expired"}), 401
    except pyjwt.InvalidTokenError as e:
        return jsonify({"valid": False, "error": str(e)}), 401

@app.route("/api/login", methods=["POST"])
def login():
    req_data = request.json or {}
    username_or_email = req_data.get("username")
    password = req_data.get("password")

    if not username_or_email or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if not db_connected or db is None:
        return jsonify({"error": "Database not connected"}), 500

    try:
        # Check by username or email
        user = db["users"].find_one({
            "$or": [
                {"username": username_or_email},
                {"email": username_or_email}
            ]
        })

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        if not check_password_hash(user["password_hashed"], password):
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Success — issue JWT
        user_data = {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "position": user.get("position", ""),
            "force_password_change": user.get("force_password_change", False)
        }

        payload = {
            **user_data,
            "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
            "iat": datetime.now(timezone.utc),
        }
        token = pyjwt.encode(payload, JWT_SECRET, algorithm="HS256")

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": user_data
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"error": "An internal error occurred"}), 500


@app.route("/api/change-password", methods=["POST"])
@token_required
def change_password():
    if not db_connected:
        return jsonify({"error": "Database not connected"}), 500
        
    req_data = request.json or {}
    new_password = req_data.get("new_password")
    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
        
    # Get user id from token
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.split(" ", 1)[1]
    payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    user_id = payload.get("id")
    
    if not user_id:
        return jsonify({"error": "Invalid user token"}), 400
        
    try:
        db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "password_hashed": generate_password_hash(new_password),
                    "force_password_change": False
                }
            }
        )
        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        logger.error(f"Error updating password: {e}")
        return jsonify({"error": "Failed to update password"}), 500


@app.route("/api/update-account", methods=["POST"])
@token_required
def update_account():
    if not db_connected:
        return jsonify({"error": "Database not connected"}), 500

    auth_header = request.headers.get("Authorization", "")
    token = auth_header.split(" ", 1)[1]
    payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    user_id = payload.get("id")
    if not user_id:
        return jsonify({"error": "Invalid user token"}), 400

    req_data = request.json or {}
    updates = {}

    new_username = req_data.get("username", "").strip()
    new_password = req_data.get("new_password", "").strip()
    profile_photo = req_data.get("profile_photo", "").strip()

    if new_username:
        # Check username uniqueness
        existing = db["users"].find_one({"username": new_username, "_id": {"$ne": ObjectId(user_id)}})
        if existing:
            return jsonify({"error": "Username already taken"}), 409
        updates["username"] = new_username

    if new_password:
        if len(new_password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        updates["password_hashed"] = generate_password_hash(new_password)

    if profile_photo:
        updates["profile_photo"] = profile_photo

    if not updates:
        return jsonify({"error": "No changes provided"}), 400

    try:
        db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": updates})
        user = db["users"].find_one({"_id": ObjectId(user_id)}, {"password_hashed": 0})
        user["_id"] = str(user["_id"])
        return jsonify({"message": "Account updated", "user": user}), 200
    except Exception as e:
        logger.error(f"Error updating account: {e}")
        return jsonify({"error": "Failed to update account"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
