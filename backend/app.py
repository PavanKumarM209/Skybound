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
from twilio.rest import Client

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

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", "")
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

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
            {"name": "Karate India"},
            {"name": "Karnataka State Karate Association"},
            {"name": "WAKO India Kickboxing"},
            {"name": "Khelo India"},
            {"name": "Shotokan Karate-Do International"},
            {"name": "Sports Authority of India (SAI)"}
        ]
    },
    "trustees": [
        {
            "_id": "tr_1",
            "name": "Renshi Umapathi S S",
            "role": "Founder, President & Chief Coach",
            "image_url": "/umapathi_ss.png"
        }
    ],
    "instructors": [
        {
            "_id": "inst_1",
<<<<<<< HEAD
            "name": "Sensei Rajesh Kumar",
            "rank": "Black Belt 3rd Dan",
            "role": "Head Coach",
            "location": "New Delhi, Delhi",
            "phone": "+91 98765 43210",
            "email": "rajesh@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
        },
        {
            "_id": "inst_2",
            "name": "Sensei Priya Sharma",
            "rank": "Black Belt 2nd Dan",
            "role": "Kata Specialist",
            "location": "Budh Vihar, Delhi",
            "phone": "+91 98764 32109",
            "email": "priya@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
        },
        {
            "_id": "inst_3",
            "name": "Sensei Arjun Singh",
            "rank": "Black Belt 2nd Dan",
            "role": "Kumite Coach",
            "location": "Rohini, Delhi",
            "phone": "+91 98763 21098",
            "email": "arjun@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
        },
        {
            "_id": "inst_4",
            "name": "Sensei Deepika Patel",
            "rank": "Black Belt 1st Dan",
            "role": "Assistant Coach",
            "location": "Pitampura, Delhi",
            "phone": "+91 98762 10987",
            "email": "deepika@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop"
        },
        {
            "_id": "inst_5",
            "name": "Sensei Amar Verma",
            "rank": "Black Belt 1st Dan",
            "role": "Training Instructor",
            "location": "Dwarka, Delhi",
            "phone": "+91 98761 09876",
            "email": "amar@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop"
=======
            "name": "Sensei Chandana U S",
            "rank": "Black Belt 3rd Dan",
            "role": "Disciplinary Head and Data Analyst",
            "location": "Bangalore, Karnataka",
            "phone": "+91 89517 07028",
            "email": "chandana@example.com",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_2",
            "name": "Sensei Samarth S",
            "rank": "Black Belt 2nd Dan",
            "role": "Head Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 76764 56528",
            "email": "samarth@example.com",
            "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_3",
            "name": "Sensei Pavan Kumar M",
            "rank": "Black Belt 2nd Dan",
            "role": "Head Examiner",
            "location": "Bangalore, Karnataka",
            "phone": "+91 63626 30742",
            "email": "pavankumarm209@gmail.com",
            "image_url": "/instructor_pavan.png?v=2"
        },
        {
            "_id": "inst_4",
            "name": "Sensei Nithyanandham P",
            "rank": "Black Belt 2nd Dan",
            "role": "Kata and Technical Head",
            "location": "Bangalore, Karnataka",
            "phone": "+91 86187 83967",
            "email": "nithyanandham@example.com",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_5",
            "name": "Sensei Ajay P K",
            "rank": "Black Belt 2nd Dan",
            "role": "Kubudo Head",
            "location": "Bangalore, Karnataka",
            "phone": "+91 93538 29671",
            "email": "ajay@example.com",
            "image_url": "/instructor_ajay.png?v=2"
        },
        {
            "_id": "inst_6",
            "name": "Sensei Sannidhi S",
            "rank": "Black Belt 2nd Dan",
            "role": "Kumite and Kickboxing Head",
            "location": "Bangalore, Karnataka",
            "phone": "+91 91082 43741",
            "email": "sannidhi@example.com",
            "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "inst_7",
            "name": "Sensei Deva Dharshini",
            "rank": "Black Belt 2nd Dan",
            "role": "Tournament Head",
            "location": "Bangalore, Karnataka",
            "phone": "+91 78290 67812",
            "email": "devadharshini@example.com",
            "image_url": "/instructor_deva.png?v=2"
        },
        {
            "_id": "inst_8",
            "name": "Senpai Rishith M",
            "rank": "Black Belt 1st Dan",
            "role": "Media Officer and Financial Advisor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 76193 62848",
            "email": "rishith@example.com",
            "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
>>>>>>> 57761f6 (added new file)
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

# ----------------- LOGIN ENDPOINT -----------------
@app.route("/api/login", methods=["POST"])
def login():
    req_data = request.json or {}
    username = req_data.get("username")
    password = req_data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if db_connected and db is not None:
        try:
            admin = db["admins"].find_one({"username": username, "password": password})
            if admin:
                token = pyjwt.encode(
                    {"username": username, "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS)},
                    JWT_SECRET,
                    algorithm="HS256"
                )
                return jsonify({
                    "token": token,
                    "user": {
                        "username": username,
                        "role": "admin",
                        "force_password_change": False
                    }
                }), 200
            else:
                return jsonify({"error": "Invalid credentials"}), 401
        except Exception as e:
            logger.error(f"Mongo login error: {e}")

    # JSON Fallback
    try:
        with open(JSON_DB_PATH, "r") as f:
            db_data = json.load(f)
    except:
        return jsonify({"error": "Database error"}), 500

    admins = db_data.get("admins", [])
    for admin in admins:
        if admin.get("username") == username and admin.get("password") == password:
            token = pyjwt.encode(
                {"username": username, "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS)},
                JWT_SECRET,
                algorithm="HS256"
            )
            return jsonify({
                "token": token,
                "user": {
                    "username": username,
                    "role": "admin",
                    "force_password_change": False
                }
            }), 200

    return jsonify({"error": "Invalid credentials"}), 401

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
            instructor_id = request.args.get("instructor_id")
            query = {}
            if instructor_id:
                query["instructor_id"] = instructor_id

            bookings = []
            for doc in db["bookings"].find(query):
                doc["_id"] = str(doc["_id"])
                bookings.append(doc)
            return jsonify(bookings), 200
        except Exception as e:
            logger.error(f"Mongo fetch bookings error: {e}")

    return jsonify({"error": "Database error or disconnected"}), 500

@app.route("/api/bookings", methods=["POST"])
def add_booking():
    req_data = request.json or {}
    if not req_data.get("student_name") or not req_data.get("phone") or not req_data.get("instructor_id"):
        return jsonify({"error": "Student name, phone number, and instructor ID are required"}), 400

    new_booking = {
        "student_name": req_data["student_name"],
        "student_age": int(req_data.get("student_age", 4)),
        "phone": req_data["phone"],
        "program": req_data.get("program", "Regular Training"),
        "date": req_data.get("date", ""),
        "instructor_id": req_data["instructor_id"],
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
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
    if not status or status not in ["pending", "accepted", "rejected"]:
        return jsonify({"error": "Invalid status value"}), 400

    if db_connected and db is not None:
        try:
            booking = db["bookings"].find_one({"_id": ObjectId(id)})
            if not booking:
                return jsonify({"error": "Booking not found"}), 404

            result = db["bookings"].update_one({"_id": ObjectId(id)}, {"$set": {"status": status}})

            # Send SMS if booking is accepted
            if status == "accepted" and twilio_client:
                phone = booking.get("phone", "")
                if phone:
                    # Add +91 prefix if not present (for India)
                    if not phone.startswith("+"):
                        phone = "+91" + phone.lstrip("0")

                    try:
                        student_name = booking.get("student_name", "Student")
                        twilio_client.messages.create(
                            body=f"Hi {student_name}! Your trial class booking has been accepted! Our Sensei will contact you soon. Thank you for choosing Skybound Academy!",
                            from_=TWILIO_PHONE_NUMBER,
                            to=phone
                        )
                        logger.info(f"SMS sent successfully to {phone}")
                    except Exception as sms_error:
                        logger.warning(f"Failed to send SMS: {sms_error}")

            if result.modified_count > 0 or result.matched_count > 0:
                return jsonify({"success": True, "status": status}), 200
        except Exception as e:
            logger.error(f"Mongo update booking error: {e}")

    return jsonify({"error": "Booking not found or database disconnected"}), 404

# --------- STUDENTS ENDPOINTS --------

@app.route("/api/students", methods=["POST"])
def create_student():
    req_data = request.json or {}
    required_fields = ["name", "email", "father_name", "age", "gender", "class", "phone", "password", "instructor_id"]

    if not all(field in req_data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    if db_connected and db is not None:
        try:
            student_data = {
                "name": req_data.get("name"),
                "email": req_data.get("email"),
                "father_name": req_data.get("father_name"),
                "age": req_data.get("age"),
                "gender": req_data.get("gender"),
                "class": req_data.get("class"),
                "phone": req_data.get("phone"),
                "password": req_data.get("password"),
                "instructor_id": req_data.get("instructor_id"),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "attendance": 0,
                "fees_paid": 0,
                "status": "active"
            }

            result = db["students"].insert_one(student_data)
            student_id = str(result.inserted_id)

            return jsonify({
                "success": True,
                "student_id": student_id,
                "message": "Student added successfully"
            }), 201
        except Exception as e:
            logger.error(f"Error creating student: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Database error"}), 500

@app.route("/api/students", methods=["GET"])
def get_students():
    instructor_id = request.args.get("instructor_id")

    if db_connected and db is not None:
        try:
            if instructor_id:
                students = list(db["students"].find({"instructor_id": instructor_id}))
            else:
                students = list(db["students"].find())

            # Convert ObjectId to string
            for student in students:
                student["_id"] = str(student["_id"])

            return jsonify(students), 200
        except Exception as e:
            logger.error(f"Error fetching students: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Database error"}), 500

@app.route("/api/students/<student_id>", methods=["GET"])
def get_student(student_id):
    if db_connected and db is not None:
        try:
            student = db["students"].find_one({"_id": ObjectId(student_id)})
            if not student:
                return jsonify({"error": "Student not found"}), 404

            student["_id"] = str(student["_id"])
            return jsonify(student), 200
        except Exception as e:
            logger.error(f"Error fetching student: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Database error"}), 500

# --------- ATTENDANCE ENDPOINTS --------

@app.route("/api/attendance", methods=["POST"])
def mark_attendance():
    req_data = request.json or {}
    instructor_id = req_data.get("instructor_id")
    date = req_data.get("date")
    student_ids = req_data.get("student_ids", [])

    if not instructor_id or not date or not student_ids:
        return jsonify({"error": "Missing required fields"}), 400

    if db_connected and db is not None:
        try:
            # Create attendance record
            attendance_record = {
                "instructor_id": instructor_id,
                "date": date,
                "students": student_ids,
                "created_at": datetime.now(timezone.utc).isoformat()
            }

            db["attendance"].insert_one(attendance_record)

            # Update student attendance count
            for student_id in student_ids:
                db["students"].update_one(
                    {"_id": ObjectId(student_id)},
                    {"$inc": {"attendance": 1}}
                )

            return jsonify({
                "success": True,
                "message": f"Attendance marked for {len(student_ids)} students"
            }), 201
        except Exception as e:
            logger.error(f"Error marking attendance: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Database error"}), 500

@app.route("/api/attendance", methods=["GET"])
def get_attendance():
    student_id = request.args.get("student_id")
    instructor_id = request.args.get("instructor_id")

    if db_connected and db is not None:
        try:
            query = {}
            if student_id:
                query = {"students": student_id}
            elif instructor_id:
                query = {"instructor_id": instructor_id}

            attendance = list(db["attendance"].find(query))

            # Convert ObjectId to string
            for record in attendance:
                record["_id"] = str(record["_id"])

            return jsonify(attendance), 200
        except Exception as e:
            logger.error(f"Error fetching attendance: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Database error"}), 500

# --------- UNIFIED LOGIN ENDPOINTS --------

# Instructor Login by Email (Unified)
@app.route("/api/instructor-login-email", methods=["POST"])
def instructor_login_email():
    req_data = request.json or {}
    email = req_data.get("email")
    password = req_data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if db_connected and db is not None:
        try:
            # Find instructor by email
            instructor = db["instructors"].find_one({"email": email})
            if not instructor:
                return jsonify({"error": "Invalid credentials"}), 401

            # Check password
            stored_password = instructor.get("password", os.getenv("INSTRUCTOR_DEFAULT_PASSWORD", email))
            if password != stored_password:
                return jsonify({"error": "Invalid credentials"}), 401

            # Generate JWT token
            instructor_id = str(instructor["_id"])
            payload = {
                "user_id": instructor_id,
                "role": "instructor",
                "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
            }
            token = pyjwt.encode(payload, JWT_SECRET, algorithm="HS256")
            return jsonify({
                "token": token,
                "user_id": instructor_id,
                "name": instructor.get("name", ""),
                "role": "instructor"
            }), 200
        except Exception as e:
            logger.error(f"Login error: {e}")
            return jsonify({"error": "Login failed"}), 500

    return jsonify({"error": "Database error"}), 500

# Admin Login (Unified)
@app.route("/api/admin-login", methods=["POST"])
def admin_login():
    req_data = request.json or {}
    email = req_data.get("email")
    password = req_data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if db_connected and db is not None:
        try:
            # Find admin user
            admin = db["users"].find_one({"email": email, "role": "admin"})
            if not admin:
                return jsonify({"error": "Invalid credentials"}), 401

            # Check password (in production, use proper hashing)
            stored_password = admin.get("password", "admin123")
            if password != stored_password:
                return jsonify({"error": "Invalid credentials"}), 401

            # Generate JWT token
            user_id = str(admin["_id"])
            payload = {
                "user_id": user_id,
                "role": "admin",
                "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
            }
            token = pyjwt.encode(payload, JWT_SECRET, algorithm="HS256")
            return jsonify({
                "token": token,
                "user_id": user_id,
                "name": admin.get("name", ""),
                "role": "admin"
            }), 200
        except Exception as e:
            logger.error(f"Admin login error: {e}")
            return jsonify({"error": "Login failed"}), 500

    return jsonify({"error": "Database error"}), 500

# Student Login
@app.route("/api/student-login", methods=["POST"])
def student_login():
    req_data = request.json or {}
    email = req_data.get("email")
    password = req_data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if db_connected and db is not None:
        try:
            # Find student by email
            student = db["students"].find_one({"email": email})
            if not student:
                return jsonify({"error": "Invalid credentials"}), 401

            # Check password
            stored_password = student.get("password", "")
            if password != stored_password:
                return jsonify({"error": "Invalid credentials"}), 401

            # Generate JWT token
            student_id = str(student["_id"])
            payload = {
                "user_id": student_id,
                "role": "student",
                "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
            }
            token = pyjwt.encode(payload, JWT_SECRET, algorithm="HS256")
            return jsonify({
                "token": token,
                "user_id": student_id,
                "name": student.get("name", ""),
                "role": "student"
            }), 200
        except Exception as e:
            logger.error(f"Student login error: {e}")
            return jsonify({"error": "Login failed"}), 500

    return jsonify({"error": "Database error"}), 500

# Legacy Instructor Login (by ID - for backward compatibility)
@app.route("/api/instructor-login", methods=["POST"])
def instructor_login():
    req_data = request.json or {}
    instructor_id = req_data.get("instructor_id")
    password = req_data.get("password")

    if not instructor_id or not password:
        return jsonify({"error": "Instructor ID and password required"}), 400

    if db_connected and db is not None:
        try:
            instructor = db["instructors"].find_one({"_id": ObjectId(instructor_id)})
            if not instructor:
                return jsonify({"error": "Instructor not found"}), 404

            correct_password = os.getenv("INSTRUCTOR_DEFAULT_PASSWORD", instructor_id)
            if password == correct_password:
                payload = {
                    "instructor_id": instructor_id,
                    "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
                }
                token = pyjwt.encode(payload, JWT_SECRET, algorithm="HS256")
                return jsonify({"token": token, "instructor_id": instructor_id}), 200
            else:
                return jsonify({"error": "Invalid password"}), 401
        except Exception as e:
            logger.error(f"Login error: {e}")

    return jsonify({"error": "Database error or disconnected"}), 500

# --------- INSTRUCTOR CHANGE PASSWORD ENDPOINT --------
@app.route("/api/instructor-change-password", methods=["POST"])
def change_instructor_password():
    req_data = request.json or {}
    instructor_id = req_data.get("instructor_id")
    old_password = req_data.get("old_password")
    new_password = req_data.get("new_password")

    if not all([instructor_id, old_password, new_password]):
        return jsonify({"error": "All fields required"}), 400

    if db_connected and db is not None:
        try:
            instructor = db["instructors"].find_one({"_id": ObjectId(instructor_id)})
            if not instructor:
                return jsonify({"error": "Instructor not found"}), 404

            # Verify old password
            correct_password = os.getenv("INSTRUCTOR_DEFAULT_PASSWORD", instructor_id)
            stored_password = instructor.get("password", correct_password)

            if old_password != stored_password:
                return jsonify({"error": "Incorrect current password"}), 401

            # Update with new password
            db["instructors"].update_one(
                {"_id": ObjectId(instructor_id)},
                {"$set": {"password": new_password}}
            )

            return jsonify({"success": True, "message": "Password changed successfully"}), 200
        except Exception as e:
            logger.error(f"Change password error: {e}")

    return jsonify({"error": "Database error or disconnected"}), 500

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


# ----------------- TRIAL REQUESTS ENDPOINTS -----------------
@app.route("/api/trial-requests", methods=["POST"])
def submit_trial_request():
    req_data = request.json or {}

    required_fields = ["student_name", "student_age", "phone"]
    if not all(req_data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    trial_request = {
        "student_name": req_data.get("student_name"),
        "student_age": int(req_data.get("student_age")),
        "phone": req_data.get("phone"),
        "program": req_data.get("program", "Regular Training"),
        "preferred_date": req_data.get("preferred_date", ""),
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
        "admin_notes": ""
    }

    if db_connected and db is not None:
        try:
            result = db["trial_requests"].insert_one(trial_request)
            trial_request["_id"] = str(result.inserted_id)
            return jsonify({"success": True, "message": "Trial request submitted successfully"}), 201
        except Exception as e:
            logger.error(f"Mongo trial request error: {e}")
            return jsonify({"error": "Database error"}), 500

    return jsonify({"error": "Database not connected"}), 500

@app.route("/api/trial-requests", methods=["GET"])
@token_required
def get_trial_requests():
    if db_connected and db is not None:
        try:
            requests = []
            for doc in db["trial_requests"].find().sort("created_at", -1):
                doc["_id"] = str(doc["_id"])
                doc["created_at"] = doc["created_at"].isoformat() if hasattr(doc["created_at"], "isoformat") else str(doc["created_at"])
                requests.append(doc)
            return jsonify(requests), 200
        except Exception as e:
            logger.error(f"Mongo fetch trial requests error: {e}")
            return jsonify({"error": "Database error"}), 500

    return jsonify({"error": "Database not connected"}), 500

@app.route("/api/trial-requests/<id>", methods=["PATCH"])
@token_required
def update_trial_request(id):
    req_data = request.json or {}
    status = req_data.get("status")
    admin_notes = req_data.get("admin_notes", "")

    if status not in ["pending", "approved", "rejected"]:
        return jsonify({"error": "Invalid status"}), 400

    if db_connected and db is not None:
        try:
            from bson.objectid import ObjectId
            result = db["trial_requests"].update_one(
                {"_id": ObjectId(id)},
                {"$set": {"status": status, "admin_notes": admin_notes}}
            )
            if result.modified_count > 0:
                return jsonify({"success": True}), 200
            else:
                return jsonify({"error": "Request not found"}), 404
        except Exception as e:
            logger.error(f"Mongo update trial request error: {e}")
            return jsonify({"error": "Database error"}), 500

    return jsonify({"error": "Database not connected"}), 500

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
