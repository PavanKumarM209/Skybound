# Skybound Aero Adventures Portal

Welcome to **Skybound**, a complete, ready-to-run modern stack showcasing a decoupled frontend and backend connected via Next.js internal rewrite proxying and Ngrok.

## Tech Stack
*   **Frontend:** Next.js (App Router, Tailwind CSS, TypeScript)
*   **Backend:** Flask (Python, Gunicorn)
*   **Database:** MongoDB 6.0
*   **Proxy/Gateway:** Next.js built-in rewrite proxy (prevents CORS, handles API routing)
*   **Tunneling:** Ngrok (Exposes the application to the internet)
*   **Containerization:** Docker & Docker Compose

---

## Directory Structure
```
skybound/
├── docker-compose.yml       # Orchestrates all containers (Frontend, Backend, DB, Ngrok)
├── README.md                # Project documentation
├── .gitignore               # Root gitignore rules
├── backend/
│   ├── app.py               # Flask application with endpoints & MongoDB seeding
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container instructions
└── frontend/
    ├── src/
    │   └── app/
    │       ├── page.tsx     # Premium UI featuring glassmorphism and state management
    │       ├── layout.tsx   # Base HTML shell and global font loading
    │       └── globals.css  # Tailwind CSS base file
    ├── package.json         # Node.js dependencies & scripts
    ├── next.config.ts       # Next.js configurations & API proxy rules
    └── Dockerfile           # Frontend development container instructions
```

---

## Routing & Connection Flow
*   **Proxy Routing:** All client requests to `/api/*` are captured by Next.js's native rewrite rules (`next.config.ts`) and proxied server-side to the Flask backend (on port `5000` locally, or `backend:5000` in Docker). This eliminates CORS challenges without needing Nginx.
*   **Database:** The Flask app communicates with the MongoDB instance (locally on `localhost:27017` or in Docker using host `mongodb`).
*   **Ngrok Exposure:** Starting an ngrok tunnel on the Next.js port (`3001` locally or `3000` in Docker) exposes the entire site under a single secure HTTPS URL.

---

## How to Run Locally (Without Docker)

Follow these steps to run the complete stack locally on your host machine. Since each service runs interactively, you should run them in separate terminal tabs or windows.

### Step 1: Start MongoDB
You need a running MongoDB instance on port `27017`. If you don't have it installed natively, spin up a lightweight Docker container for it:
```bash
# Start a MongoDB container mapping to port 27017 on the host
docker run -d --name skybound_mongodb -p 27017:27017 mongo:6.0
```

### Step 2: Set up & Run Flask Backend (Terminal 1)
Open a new terminal window, navigate to the `backend/` directory, set up your Python virtual environment, and start the Flask server:
```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install the Python dependencies (Flask, PyMongo, CORS, Gunicorn)
pip install -r requirements.txt

# Run the Flask app
python app.py
```
*The Flask backend will start on **`http://127.0.0.1:5000`** and print a message confirming connection to the MongoDB database.*

### Step 3: Set up & Run Next.js Frontend (Terminal 2)
Open a new terminal window, navigate to the `frontend/` directory, install Node packages, and run the Next.js development server:
```bash
# Navigate to the frontend directory
cd frontend

# Install the npm packages
npm install

# Run the Next.js development server on port 3001
# Note: Next.js dev server will automatically proxy /api/* requests to Flask (port 5000)
PORT=3001 npm run dev
```
*The frontend will compile and start on **`http://localhost:3001`**.*

### Step 4: Expose the App via Ngrok (Terminal 3)
Open a third terminal window and run Ngrok to tunnel your Next.js frontend to the public internet:
```bash
# Expose the local Next.js frontend port
ngrok http 3001
```
*Copy the generated `https://xxxx.ngrok-free.app` URL. Opening this link in any browser will grant full access to both the frontend UI and the proxied API backend over a secure connection.*

---

## Alternative: Docker Compose (Entire Stack Containerized)
If you prefer running everything in containerized mode with Ngrok configured automatically:
1. Ensure you have your `NGROK_AUTHTOKEN` ready.
2. Run:
```bash
docker compose up --build
```
This automatically spins up:
*   MongoDB (`mongodb:27017`)
*   Flask Backend (`backend:5000`)
*   Next.js Frontend (`frontend:3000`)
*   Ngrok Tunnel exposing the frontend container (inspectable at `http://localhost:4041`)
