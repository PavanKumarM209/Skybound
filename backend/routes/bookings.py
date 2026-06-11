from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from datetime import datetime, timezone

from config import TWILIO_PHONE_NUMBER, logger
from database import db, db_connected
from utils import token_required, twilio_client

bookings_bp = Blueprint('bookings', __name__)

# ----------------- BOOKINGS ENDPOINTS -----------------
@bookings_bp.route("/api/bookings", methods=["GET"])
def get_bookings():
    if db_connected and db is not None:
        try:
            instructor_id = request.args.get("instructor_id")
            query = {}
            if instructor_id:
                query["instructor_id"] = instructor_id

            bookings = []
            # Fetch existing students to check for prior enrollment
            students_cursor = db["students"].find({}, {"phone": 1, "name": 1})
            student_phones = set()
            student_names = set()
            for s in students_cursor:
                if s.get("phone"):
                    student_phones.add(s["phone"].strip())
                if s.get("name"):
                    student_names.add(s["name"].strip().lower())

            for doc in db["bookings"].find(query):
                doc["_id"] = str(doc["_id"])
                
                # Check for match by phone or name
                phone = doc.get("phone", "").strip()
                name = doc.get("student_name", "").strip().lower()
                
                if (phone and phone in student_phones) or (name and name in student_names):
                    if doc.get("status") == "accepted":
                        doc["status"] = "enrolled"
                
                bookings.append(doc)
            return jsonify(bookings), 200
        except Exception as e:
            logger.error(f"Mongo fetch bookings error: {e}")

    return jsonify({"error": "Database error or disconnected"}), 500

@bookings_bp.route("/api/bookings", methods=["POST"])
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

@bookings_bp.route("/api/bookings/<id>", methods=["PATCH"])
def update_booking_status(id):
    req_data = request.json or {}
    status = req_data.get("status")
    if not status or status not in ["pending", "accepted", "rejected", "enrolled"]:
        return jsonify({"error": "Invalid status value"}), 400

    if db_connected and db is not None:
        try:
            query_id = id
            try:
                query_id = ObjectId(id)
            except Exception:
                pass
            booking = db["bookings"].find_one({"_id": query_id})
            if not booking:
                return jsonify({"error": "Booking not found"}), 404

            result = db["bookings"].update_one({"_id": query_id}, {"$set": {"status": status}})

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

# ----------------- TRIAL REQUESTS ENDPOINTS -----------------
@bookings_bp.route("/api/trial-requests", methods=["POST"])
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

@bookings_bp.route("/api/trial-requests", methods=["GET"])
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

@bookings_bp.route("/api/trial-requests/<id>", methods=["PATCH"])
@token_required
def update_trial_request(id):
    req_data = request.json or {}
    status = req_data.get("status")
    admin_notes = req_data.get("admin_notes", "")

    if status not in ["pending", "approved", "rejected"]:
        return jsonify({"error": "Invalid status"}), 400

    if db_connected and db is not None:
        try:
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
