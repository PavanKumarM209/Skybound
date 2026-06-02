# Skybound Aero Adventures Portal

Welcome to **Skybound**, a complete, ready-to-run modern stack showcasing a decoupled frontend and backend connected via Nginx.

## Tech Stack
*   **Frontend:** Next.js (App Router, Tailwind CSS, TypeScript)
*   **Backend:** Flask (Python, Gunicorn)
*   **Database:** MongoDB 6.0
*   **Proxy/Gateway:** Nginx (Acts as reverse proxy for routing)
*   **Containerization:** Docker & Docker Compose

---

## Directory Structure
```
skybound/
├── docker-compose.yml       # Orchestrates all containers (Frontend, Backend, DB, Nginx)
├── README.md                # Project documentation
├── backend/
│   ├── app.py               # Flask application with endpoints & MongoDB seeding
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container instructions
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx     # Premium UI featuring glassmorphism and state management
│   │       ├── layout.tsx   # Base HTML shell and global font loading
│   │       └── globals.css  # Tailwind CSS base file
│   ├── package.json         # Node.js dependencies & scripts
│   └── Dockerfile           # Frontend development container instructions
└── nginx/
    ├── nginx.conf           # Reverse proxy configuration for routing traffic
    └── Dockerfile           # Nginx container instructions
```

---

## Routing & Connection Flow
*   **Web Access:** All external users connect through Nginx on port `80` (`http://localhost`).
*   **Frontend Routing:** Requests to `/` or other assets are forwarded to the Next.js frontend container (`frontend:3000`).
*   **Backend Routing:** Requests to `/api/*` are reverse-proxied to the Flask backend container (`backend:5000`).
*   **Database:** The Flask app communicates with the MongoDB container (`mongodb:27017`) using the docker-internal hostname `mongodb`.

---

## How to Run

To build and start all services in Docker containers, run:

```bash
docker compose up --build
```

Once running:
*   Open **`http://localhost`** in your browser to view the Next.js app.
*   The system will automatically seed the MongoDB database with a few default travel destinations on startup.
*   You can monitor connection status to the backend via the "API Status" badge in the header.
*   You can dynamically add new travel destinations using the **Add Destination** form, which will save directly to MongoDB.

### Local Development (without Docker)
If you prefer to run services manually:
1.  **MongoDB:** Ensure you have MongoDB running locally on port `27017`.
2.  **Backend:**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python app.py
    ```
3.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
