from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from datetime import datetime, timezone

from config import logger
from database import db, db_connected
from email_utils import student_welcome_email

students_bp = Blueprint('students', __name__)

# --------- STUDENTS ENDPOINTS --------

@students_bp.route("/api/students", methods=["POST"])
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

            # Send welcome email with login credentials
            instructor_name = "Your Instructor"
            try:
                inst_id = req_data.get("instructor_id", "")
                instructor = db["instructors"].find_one({"_id": inst_id})
                if not instructor:
                    instructor = db["instructors"].find_one({"_id": ObjectId(inst_id)})
                if instructor:
                    instructor_name = instructor.get("name", "Your Instructor")
            except Exception:
                pass

            student_email = req_data.get("email", "")
            if student_email:
                student_welcome_email(
                    student_name=req_data.get("name", "Student"),
                    to_email=student_email,
                    password=req_data.get("password", ""),
                    instructor_name=instructor_name,
                    login_url="https://skyboundmartialarts.online/login"
                )

            return jsonify({
                "success": True,
                "student_id": student_id,
                "message": "Student added successfully"
            }), 201
        except Exception as e:
            logger.error(f"Error creating student: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Database error"}), 500

@students_bp.route("/api/students", methods=["GET"])
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

@students_bp.route("/api/students/<student_id>", methods=["GET"])
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

@students_bp.route("/api/attendance", methods=["POST"])
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

@students_bp.route("/api/attendance", methods=["GET"])
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

@students_bp.route("/api/students/<student_id>", methods=["PUT"])
def update_student(student_id):
    req_data = request.json or {}
    if db_connected and db is not None:
        try:
            update_fields = {}
            for field in ["name", "email", "father_name", "age", "gender", "class", "phone", "password", "monthly_due", "payment_status"]:
                if field in req_data:
                    val = req_data[field]
                    if field == "age" and val is not None:
                        try:
                            val = int(val)
                        except ValueError:
                            pass
                    if field == "monthly_due" and val is not None:
                        try:
                            val = float(val)
                        except ValueError:
                            pass
                    update_fields[field] = val
            
            if not update_fields:
                return jsonify({"error": "No fields to update"}), 400
                
            result = db["students"].update_one(
                {"_id": ObjectId(student_id)},
                {"$set": update_fields}
            )
            if result.matched_count == 0:
                return jsonify({"error": "Student not found"}), 404
                
            return jsonify({"success": True, "message": "Student updated successfully"}), 200
        except Exception as e:
            logger.error(f"Error updating student: {e}")
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database error"}), 500

@students_bp.route("/api/students/<student_id>", methods=["DELETE"])
def delete_student(student_id):
    if db_connected and db is not None:
        try:
            result = db["students"].delete_one({"_id": ObjectId(student_id)})
            if result.deleted_count == 0:
                return jsonify({"error": "Student not found"}), 404
            return jsonify({"success": True, "message": "Student deleted successfully"}), 200
        except Exception as e:
            logger.error(f"Error deleting student: {e}")
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database error"}), 500

# --------- PAYMENTS ENDPOINTS --------

@students_bp.route("/api/payments", methods=["POST"])
def submit_payment():
    req_data = request.json or {}
    student_id = req_data.get("student_id")
    amount = req_data.get("amount")
    transaction_id = req_data.get("transaction_id")
    screenshot_url = req_data.get("screenshot_url")

    if not student_id or not amount or not transaction_id:
        return jsonify({"error": "Missing student_id, amount, or transaction_id"}), 400

    if db_connected and db is not None:
        try:
            student = db["students"].find_one({"_id": ObjectId(student_id)})
            if not student:
                return jsonify({"error": "Student not found"}), 404

            current_month = datetime.now().strftime("%Y-%m")

            payment_record = {
                "student_id": student_id,
                "student_name": student.get("name"),
                "student_email": student.get("email"),
                "instructor_id": student.get("instructor_id"),
                "amount": float(amount),
                "month": current_month,
                "status": "pending",
                "transaction_id": transaction_id,
                "screenshot_url": screenshot_url or "",
                "submitted_at": datetime.now(timezone.utc).isoformat()
            }

            result = db["payments"].insert_one(payment_record)
            payment_id = str(result.inserted_id)

            # Update student's temporary payment status to pending
            db["students"].update_one(
                {"_id": ObjectId(student_id)},
                {"$set": {"payment_status": "pending"}}
            )

            return jsonify({
                "success": True,
                "payment_id": payment_id,
                "message": "Payment proof submitted successfully"
            }), 201
        except Exception as e:
            logger.error(f"Error submitting payment: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Database error"}), 500


@students_bp.route("/api/payments/student/<student_id>", methods=["GET"])
def get_student_payments(student_id):
    if db_connected and db is not None:
        try:
            payments = list(db["payments"].find({"student_id": student_id}).sort("submitted_at", -1))
            for p in payments:
                p["_id"] = str(p["_id"])
            return jsonify(payments), 200
        except Exception as e:
            logger.error(f"Error fetching student payments: {e}")
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database error"}), 500


@students_bp.route("/api/payments/instructor/<instructor_id>", methods=["GET"])
def get_instructor_payments(instructor_id):
    if db_connected and db is not None:
        try:
            payments = list(db["payments"].find({"instructor_id": instructor_id}).sort("submitted_at", -1))
            for p in payments:
                p["_id"] = str(p["_id"])
            return jsonify(payments), 200
        except Exception as e:
            logger.error(f"Error fetching instructor payments: {e}")
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database error"}), 500


@students_bp.route("/api/payments/<payment_id>/approve", methods=["POST"])
def approve_payment(payment_id):
    if db_connected and db is not None:
        try:
            payment = db["payments"].find_one({"_id": ObjectId(payment_id)})
            if not payment:
                return jsonify({"error": "Payment record not found"}), 404

            current_month = datetime.now().strftime("%Y-%m")

            # Update payment record status
            db["payments"].update_one(
                {"_id": ObjectId(payment_id)},
                {"$set": {
                    "status": "paid",
                    "paid_at": datetime.now(timezone.utc).isoformat()
                }}
            )

            # Update student record
            db["students"].update_one(
                {"_id": ObjectId(payment["student_id"])},
                {"$set": {
                    "payment_status": "paid",
                    "last_paid_month": current_month,
                    "fees_paid": 1
                }}
            )

            return jsonify({
                "success": True,
                "message": "Payment marked as paid successfully"
            }), 200
        except Exception as e:
            logger.error(f"Error approving payment: {e}")
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database error"}), 500


@students_bp.route("/api/students/<student_id>/mark-paid-manual", methods=["POST"])
def mark_student_paid_manual(student_id):
    if db_connected and db is not None:
        try:
            student = db["students"].find_one({"_id": ObjectId(student_id)})
            if not student:
                return jsonify({"error": "Student not found"}), 404

            current_month = datetime.now().strftime("%Y-%m")

            # Check if there is an existing pending payment for this student in the current month
            pending_payment = db["payments"].find_one({
                "student_id": student_id,
                "month": current_month,
                "status": "pending"
            })

            if pending_payment:
                # Update the existing pending log to paid!
                db["payments"].update_one(
                    {"_id": pending_payment["_id"]},
                    {"$set": {
                        "status": "paid",
                        "paid_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
            else:
                # Create a paid log entry directly
                payment_record = {
                    "student_id": student_id,
                    "student_name": student.get("name"),
                    "student_email": student.get("email"),
                    "instructor_id": student.get("instructor_id"),
                    "amount": float(student.get("monthly_due", 0)),
                    "month": current_month,
                    "status": "paid",
                    "transaction_id": "MANUAL_BY_INSTRUCTOR",
                    "screenshot_url": "",
                    "submitted_at": datetime.now(timezone.utc).isoformat(),
                    "paid_at": datetime.now(timezone.utc).isoformat()
                }
                db["payments"].insert_one(payment_record)

            # Update student record
            db["students"].update_one(
                {"_id": ObjectId(student_id)},
                {"$set": {
                    "payment_status": "paid",
                    "last_paid_month": current_month,
                    "fees_paid": 1
                }}
            )

            return jsonify({
                "success": True,
                "message": "Student marked as paid successfully"
            }), 200
        except Exception as e:
            logger.error(f"Error manual paid student: {e}")
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Database error"}), 500
