#!/bin/bash
set -e

DOMAIN="skyboundmartialarts.online"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "======================================"
echo " Skybound Deploy Script"
echo " Directory: $APP_DIR"
echo "======================================"

# Verify .env exists
if [ ! -f "$APP_DIR/backend/.env" ]; then
    echo "ERROR: backend/.env not found."
    echo "Copy backend/.env.example to backend/.env and fill in your values."
    exit 1
fi

# Verify SSL cert exists
if ! sudo test -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem"; then
    echo "ERROR: SSL certificate not found for $DOMAIN."
    echo "Run ./setup.sh first."
    exit 1
fi

cd "$APP_DIR"

echo "[1/4] Pulling latest code..."
git pull origin test

echo "[2/4] Building Docker images..."
docker compose build --no-cache

echo "[3/4] Starting services..."
docker compose down --remove-orphans
docker compose up -d

echo "[4/4] Waiting for services to be healthy..."
sleep 10

# Quick health check
if docker compose ps | grep -q "Exit"; then
    echo ""
    echo "WARNING: One or more containers exited. Checking logs..."
    docker compose logs --tail=50
    exit 1
fi

echo ""
echo "======================================"
echo " Deployment complete!"
echo " Site: https://$DOMAIN"
echo "======================================"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f          # stream all logs"
echo "  docker compose logs -f backend  # backend logs only"
echo "  docker compose ps               # container status"
echo "  docker compose down             # stop everything"
