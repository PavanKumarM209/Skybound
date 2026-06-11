import jwt as pyjwt
from functools import wraps
from flask import request, jsonify
from twilio.rest import Client
from bson.objectid import ObjectId
from config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, JWT_SECRET, logger
from database import db, db_connected

# Initialize Twilio Client
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    except Exception as e:
        logger.error(f"Failed to initialize Twilio client: {e}")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token is missing"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            data = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            user_id = data.get("user_id")
            role = data.get("role")
            
            if db_connected and db is not None and user_id:
                try:
                    if role == "student":
                        user_exists = db["students"].find_one({"_id": ObjectId(user_id)})
                    elif role == "instructor":
                        user_exists = db["instructors"].find_one({"_id": ObjectId(user_id)})
                    else:
                        user_exists = db["users"].find_one({"_id": ObjectId(user_id), "role": "admin"})
                    
                    if not user_exists:
                        return jsonify({"error": "User has been deleted or does not exist"}), 401
                except Exception:
                    return jsonify({"error": "User verification failed"}), 401
        except pyjwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except pyjwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated
