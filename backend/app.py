import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import logger
from database import db_connected
from routes import auth_bp, dojo_bp, bookings_bp, news_bp, students_bp

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes (important for local development & staging)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(dojo_bp)
app.register_blueprint(bookings_bp)
app.register_blueprint(news_bp)
app.register_blueprint(students_bp)

import uuid
from flask import request
from werkzeug.utils import secure_filename

# Cache static-ish GET endpoints for 5 minutes in the browser
CACHEABLE_ROUTES = {"/api/dojo-info", "/api/instructors", "/api/trustees", "/api/supporting-instructors", "/api/news"}

@app.after_request
def set_cache_headers(response):
    if request.method == "GET" and request.path in CACHEABLE_ROUTES:
        response.headers["Cache-Control"] = "public, max-age=300, stale-while-revalidate=60"
    return response

@app.route("/api/health", methods=["GET"])
def health_check():
    status = "healthy"
    db_status = "connected" if db_connected else "disconnected"
    return jsonify({
        "status": status,
        "database": db_status,
        "service": "Flask API (Local Fallback Mode)" if not db_connected else "Flask API"
    }), 200

@app.route("/api/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        unique_id = str(uuid.uuid4())[:8]
        filename = f"{unique_id}_{filename}"
        upload_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, filename)
        file.save(filepath)
        return jsonify({"url": f"/uploads/{filename}"}), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Starting Flask server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
