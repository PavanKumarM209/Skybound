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

## How to Run

### Option 1: Local Development (without Docker)
1.  **Start MongoDB:** Ensure you have MongoDB running on port `27017` (e.g. using the Docker database container: `docker run -d --name skybound_mongodb -p 27017:27017 mongo:6.0`).
2.  **Start Backend:**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python app.py
    ```
    *(Runs on http://localhost:5000)*
3.  **Start Frontend:**
    ```bash
    cd frontend
    npm install
    PORT=3001 npm run dev
    ```
    *(Runs on http://localhost:3001)*
4.  **Start Ngrok:**
    ```bash
    ngrok http 3001
    ```

---

### Option 2: Docker Compose (Entire Stack Containerized)
Ensure you set your `NGROK_AUTHTOKEN` in your environment or a `.env` file at the root, then run:
```bash
docker compose up --build
```
This automatically spins up:
*   MongoDB (`mongodb:27017`)
*   Flask Backend (`backend:5000`)
*   Next.js Frontend (`frontend:3000`)
*   Ngrok Tunnel exposing the frontend container (inspectable at `http://localhost:4041`)
