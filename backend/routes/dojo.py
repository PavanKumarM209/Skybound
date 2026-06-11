from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash
from datetime import datetime, timezone

from config import DEFAULT_DB, logger
from database import db, db_connected

dojo_bp = Blueprint('dojo', __name__)

# ----------------- DOJO INFO ENDPOINTS -----------------
@dojo_bp.route("/api/dojo-info", methods=["GET"])
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

@dojo_bp.route("/api/dojo-info", methods=["POST"])
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

# ----------------- TRUSTEES ENDPOINTS -----------------
@dojo_bp.route("/api/trustees", methods=["GET"])
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

# ----------------- INSTRUCTORS ENDPOINTS -----------------
@dojo_bp.route("/api/instructors", methods=["GET"])
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

@dojo_bp.route("/api/instructors", methods=["POST"])
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

@dojo_bp.route("/api/instructors/<id>", methods=["GET"])
def get_instructor(id):
    if db_connected and db is not None:
        try:
            query_id = id
            try:
                query_id = ObjectId(id)
            except Exception:
                pass
            instructor = db["instructors"].find_one({"_id": query_id})
            if instructor:
                instructor["_id"] = str(instructor["_id"])
                return jsonify(instructor), 200
            else:
                return jsonify({"error": "Instructor not found"}), 404
        except Exception as e:
            logger.error(f"Mongo fetch instructor error: {e}")
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database error or disconnected"}), 500

@dojo_bp.route("/api/instructors/<id>", methods=["PUT"])
def update_instructor(id):
    req_data = request.json or {}
    if db_connected and db is not None:
        try:
            update_data = {
                "name": req_data.get("name"),
                "rank": req_data.get("rank"),
                "role": req_data.get("role"),
                "location": req_data.get("location"),
                "phone": req_data.get("phone"),
                "email": req_data.get("email"),
                "image_url": req_data.get("image_url"),
                "payment_qr": req_data.get("payment_qr")
            }
            update_data = {k: v for k, v in update_data.items() if v is not None}

            query_id = id
            try:
                query_id = ObjectId(id)
            except Exception:
                pass

            result = db["instructors"].update_one(
                {"_id": query_id},
                {"$set": update_data}
            )

            if result.matched_count > 0:
                updated = db["instructors"].find_one({"_id": query_id})
                updated["_id"] = str(updated["_id"])
                return jsonify(updated), 200
            else:
                return jsonify({"error": "Instructor not found"}), 404
        except Exception as e:
            logger.error(f"Mongo update instructor error: {e}")

    return jsonify({"error": "Database error or disconnected"}), 500

@dojo_bp.route("/api/instructors/<id>", methods=["DELETE"])
def delete_instructor(id):
    if db_connected and db is not None:
        try:
            query_id = id
            try:
                query_id = ObjectId(id)
            except Exception:
                pass
            result = db["instructors"].delete_one({"_id": query_id})
            if result.deleted_count > 0:
                return jsonify({"success": True}), 200
        except Exception as e:
            logger.error(f"Mongo delete instructor error: {e}")

    return jsonify({"error": "Instructor not found or database disconnected"}), 404

# ----------------- SUPPORTING INSTRUCTORS ENDPOINTS -----------------
@dojo_bp.route("/api/supporting-instructors", methods=["GET"])
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

@dojo_bp.route("/api/supporting-instructors", methods=["POST"])
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

@dojo_bp.route("/api/supporting-instructors/<id>", methods=["DELETE"])
def delete_supporting_instructor(id):
    if db_connected and db is not None:
        try:
            query_id = id
            try:
                query_id = ObjectId(id)
            except Exception:
                pass
            result = db["supporting_instructors"].delete_one({"_id": query_id})
            if result.deleted_count > 0:
                return jsonify({"success": True}), 200
        except Exception as e:
            logger.error(f"Mongo delete supporting instructor error: {e}")

    return jsonify({"error": "Supporting instructor not found or database disconnected"}), 404

# ----------------- RECOGNIZATION IMAGES DYNAMIC LOOKUP -----------------
@dojo_bp.route("/api/recognization-images", methods=["GET"])
def get_recognization_images():
    try:
        import os
        recognization_dir = "/home/infaira/Desktop/skybound/frontend/public/recognization"
        if os.path.exists(recognization_dir):
            files = os.listdir(recognization_dir)
            image_extensions = ('.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG', '.WEBP')
            # Exclude hidden files or directories
            images = [f"/recognization/{f}" for f in files if f.endswith(image_extensions) and not f.startswith('.')]
            images.sort()
            return jsonify(images), 200
        else:
            return jsonify([]), 200
    except Exception as e:
        logger.error(f"Error reading recognization directory: {e}")
        return jsonify([]), 500

