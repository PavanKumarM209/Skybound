#!/bin/bash
set -e

DOMAIN="skyboundmartialarts.online"
EMAIL="a.shaikfawaz@gmail.com"

echo "======================================"
echo " Skybound EC2 Setup Script"
echo " Domain: $DOMAIN"
echo "======================================"

# Update system
echo "[1/7] Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install prerequisites
echo "[2/7] Installing prerequisites..."
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    ufw

# Install Docker
echo "[3/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
        https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
    echo "Docker installed."
else
    echo "Docker already installed, skipping."
fi

# Install Docker Compose v2
echo "[4/7] Installing Docker Compose..."
if ! docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name"' | cut -d'"' -f4)
    sudo curl -SL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-x86_64" \
        -o /usr/local/lib/docker/cli-plugins/docker-compose
    sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    echo "Docker Compose installed: $(docker compose version)"
else
    echo "Docker Compose already installed, skipping."
fi

# Install Certbot (standalone, for Let's Encrypt SSL)
echo "[5/7] Installing Certbot..."
if ! command -v certbot &> /dev/null; then
    sudo apt-get install -y certbot
    echo "Certbot installed."
else
    echo "Certbot already installed, skipping."
fi

# Configure UFW firewall
echo "[6/7] Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
echo "Firewall configured."

# Obtain SSL certificate
echo "[7/7] Obtaining SSL certificate for $DOMAIN..."
sudo mkdir -p /var/www/certbot

if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    sudo certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"
    echo "SSL certificate obtained."
else
    echo "SSL certificate already exists, skipping."
fi

# Auto-renew SSL via cron
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && docker compose -f /home/ubuntu/skybound/docker-compose.yml restart nginx") | crontab -
    echo "SSL auto-renewal cron job added."
fi

echo ""
echo "======================================"
echo " Setup complete!"
echo " Next step: run ./deploy.sh"
echo "======================================"
echo ""
echo "NOTE: If this is your first Docker install, log out and back in"
echo "      (or run: newgrp docker) before running deploy.sh"
