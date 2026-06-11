import json
import os
import jwt as pyjwt
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

from config import JWT_SECRET, JWT_EXPIRY_HOURS, JSON_DB_PATH, logger
from database import db, db_connected
from utils import token_required

auth_bp = Blueprint('auth', __name__)

# ----------------- LOGIN ENDPOINT -----------------
@auth_bp.route("/api/login", methods=["POST"])
def login():
    req_data = request.json or {}
    identifier = req_data.get("username") or req_data.get("email") or req_data.get("identifier")
    password = req_data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Username/email and password are required"}), 400

    if db_connected and db is not None:
        try:
            admin = db["admins"].find_one({
                "$or": [
                    {"username": identifier},
                    {"email": identifier}
                ],
                "password": password
            })
            if admin:
                username = admin.get("username", identifier)
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
        if (admin.get("username") == identifier or admin.get("email") == identifier) and admin.get("password") == password:
            username = admin.get("username", identifier)
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

# ----------------- UNIFIED LOGIN ENDPOINTS -----------------

# Instructor Login by Email or Username (Unified)
@auth_bp.route("/api/instructor-login-email", methods=["POST"])
def instructor_login_email():
    req_data = request.json or {}
    identifier = req_data.get("email") or req_data.get("username") or req_data.get("identifier")
    password = req_data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Email/username and password required"}), 400

    if db_connected and db is not None:
        try:
            # Find instructor directly by email
            instructor = db["instructors"].find_one({"email": identifier})
            if not instructor:
                # Try finding corresponding instructor user in users collection
                user = db["users"].find_one({
                    "$or": [
                        {"email": identifier},
                        {"username": identifier}
                    ],
                    "role": "instructor"
                })
                if user and user.get("email"):
                    instructor = db["instructors"].find_one({"email": user["email"]})

            if not instructor:
                return jsonify({"error": "Invalid credentials"}), 401

            # Check password
            stored_password = instructor.get("password", os.getenv("INSTRUCTOR_DEFAULT_PASSWORD", instructor.get("email", "")))
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
@auth_bp.route("/api/admin-login", methods=["POST"])
def admin_login():
    req_data = request.json or {}
    identifier = req_data.get("email") or req_data.get("username") or req_data.get("identifier")
    password = req_data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Email/username and password required"}), 400

    if db_connected and db is not None:
        try:
            # Find admin user by email or username
            admin = db["users"].find_one({
                "$or": [
                    {"email": identifier},
                    {"username": identifier}
                ],
                "role": "admin"
            })
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
@auth_bp.route("/api/student-login", methods=["POST"])
def student_login():
    req_data = request.json or {}
    identifier = req_data.get("email") or req_data.get("username") or req_data.get("identifier")
    password = req_data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Email/username and password required"}), 400

    if db_connected and db is not None:
        try:
            # Find student directly by email
            student = db["students"].find_one({"email": identifier})
            if not student:
                # Try finding corresponding student user in users collection
                user = db["users"].find_one({
                    "$or": [
                        {"email": identifier},
                        {"username": identifier}
                    ],
                    "role": "student"
                })
                if user and user.get("email"):
                    student = db["students"].find_one({"email": user["email"]})
                else:
                    # Fallback to username matching the prefix of email
                    student = db["students"].find_one({"email": {"$regex": f"^{identifier}@", "$options": "i"}})

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
@auth_bp.route("/api/instructor-login", methods=["POST"])
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
@auth_bp.route("/api/instructor-change-password", methods=["POST"])
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
@auth_bp.route("/api/users", methods=["GET"])
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

@auth_bp.route("/api/users", methods=["POST"])
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
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
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

@auth_bp.route("/api/verify-token", methods=["POST"])
def verify_token():
    """Verify a JWT token and return the decoded user payload."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    token = auth_header.split(" ", 1)[1]
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
        role = payload.get("role")

        if db_connected and db is not None and user_id:
            try:
                if role == "student":
                    user_exists = db["students"].find_one({"_id": ObjectId(user_id)})
                elif role == "instructor":
                    user_exists = db["instructors"].find_one({"_id": ObjectId(user_id)})
                else:
                    user_exists = db["users"].find_one({"_id": ObjectId(user_id), "role": "admin"})

                if not user_exists:
                    return jsonify({"valid": False, "error": "User does not exist or has been deleted"}), 401
            except Exception:
                return jsonify({"valid": False, "error": "User verification failed"}), 401

        # Remove JWT metadata fields
        payload.pop("exp", None)
        payload.pop("iat", None)
        return jsonify({"valid": True, "user": payload}), 200
    except pyjwt.ExpiredSignatureError:
        return jsonify({"valid": False, "error": "Token has expired"}), 401
    except pyjwt.InvalidTokenError as e:
        return jsonify({"valid": False, "error": str(e)}), 401

@auth_bp.route("/api/change-password", methods=["POST"])
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
    user_id = payload.get("id") or payload.get("user_id")
    
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

@auth_bp.route("/api/update-account", methods=["POST"])
@token_required
def update_account():
    if not db_connected:
        return jsonify({"error": "Database not connected"}), 500

    auth_header = request.headers.get("Authorization", "")
    token = auth_header.split(" ", 1)[1]
    payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    user_id = payload.get("id") or payload.get("user_id")
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
        updates["photo_image_url"] = profile_photo

    if not updates:
        return jsonify({"error": "No changes provided"}), 400

    try:
        query_id = user_id
        try:
            query_id = ObjectId(user_id)
        except Exception:
            pass
        db["users"].update_one({"_id": query_id}, {"$set": updates})
        user = db["users"].find_one({"_id": query_id}, {"password_hashed": 0})
        user["_id"] = str(user["_id"])
        return jsonify({"message": "Account updated", "user": user}), 200
    except Exception as e:
        logger.error(f"Error updating account: {e}")
        return jsonify({"error": "Failed to update account"}), 500
