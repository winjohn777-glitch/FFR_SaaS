#!/bin/bash

# Production Deployment Script
# Florida First Roofing Accounting System

set -e

echo "🚀 Starting production deployment for Florida First Roofing Accounting..."

# Configuration
FRONTEND_DIR="/Users/winstonjohnson/Claude Code/01-active-projects/florida-first-roofing/accounting"
BACKEND_DIR="/Users/winstonjohnson/Claude Code/01-active-projects/florida-first-roofing/accounting/backend"
BUILD_DIR="$FRONTEND_DIR/build"
PRODUCTION_DIR="/var/www/florida-first-roofing"
BACKUP_DIR="/var/backups/florida-first-roofing"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Pre-deployment checks
log_info "Running pre-deployment checks..."

# Check if directories exist
if [[ ! -d "$FRONTEND_DIR" ]]; then
    log_error "Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

if [[ ! -d "$BACKEND_DIR" ]]; then
    log_error "Backend directory not found: $BACKEND_DIR"
    exit 1
fi

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log_error "npm is not installed"
    exit 1
fi

# Backup existing deployment (if exists)
if [[ -d "$PRODUCTION_DIR" ]]; then
    log_info "Creating backup of existing deployment..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$PRODUCTION_DIR" "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)"
fi

# Install backend dependencies
log_info "Installing backend dependencies..."
cd "$BACKEND_DIR"
npm ci --only=production

# Run database migrations
log_info "Running database migrations..."
npx prisma migrate deploy

# Install frontend dependencies and build
log_info "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm ci

log_info "Building frontend for production..."
npm run build

if [[ ! -d "$BUILD_DIR" ]]; then
    log_error "Frontend build failed - build directory not found"
    exit 1
fi

# Create production directory
log_info "Setting up production directory..."
mkdir -p "$PRODUCTION_DIR"

# Copy backend files
log_info "Deploying backend..."
cp -r "$BACKEND_DIR/dist" "$PRODUCTION_DIR/api" 2>/dev/null || cp -r "$BACKEND_DIR/src" "$PRODUCTION_DIR/api"
cp -r "$BACKEND_DIR/prisma" "$PRODUCTION_DIR/api/"
cp "$BACKEND_DIR/package.json" "$PRODUCTION_DIR/api/"
cp "$BACKEND_DIR/.env.production" "$PRODUCTION_DIR/api/.env"

# Copy frontend build
log_info "Deploying frontend..."
cp -r "$BUILD_DIR"/* "$PRODUCTION_DIR/"

# Install production dependencies in production directory
log_info "Installing production dependencies..."
cd "$PRODUCTION_DIR/api"
npm ci --only=production

# Set proper permissions
log_info "Setting permissions..."
chown -R www-data:www-data "$PRODUCTION_DIR" 2>/dev/null || log_warning "Could not set www-data ownership"
chmod -R 755 "$PRODUCTION_DIR"

# Create systemd service file (optional)
log_info "Creating systemd service..."
cat > /etc/systemd/system/florida-first-roofing-api.service << EOF
[Unit]
Description=Florida First Roofing Accounting API
Documentation=https://github.com/your-repo/florida-first-roofing
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=www-data
WorkingDirectory=$PRODUCTION_DIR/api
ExecStart=/usr/bin/node src/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl daemon-reload
systemctl enable florida-first-roofing-api
systemctl restart florida-first-roofing-api

# Create nginx configuration (optional)
log_info "Creating nginx configuration..."
cat > /etc/nginx/sites-available/florida-first-roofing << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root $PRODUCTION_DIR;
        try_files \$uri \$uri/ /index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API
    location /api/ {
        proxy_pass http://localhost:5002/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # CORS headers (if needed)
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    }
}
EOF

# Enable nginx site
ln -sf /etc/nginx/sites-available/florida-first-roofing /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Setup SSL with Let's Encrypt (optional)
log_info "Setting up SSL certificate..."
if command -v certbot &> /dev/null; then
    certbot --nginx -d yourdomain.com -d www.yourdomain.com --non-interactive --agree-tos --email admin@yourdomain.com
else
    log_warning "Certbot not installed - SSL certificate not configured"
fi

# Final checks
log_info "Running post-deployment checks..."
sleep 5

# Check if API is running
if curl -f http://localhost:5002/health > /dev/null 2>&1; then
    log_info "✅ API health check passed"
else
    log_error "❌ API health check failed"
fi

# Check if frontend is accessible
if curl -f http://localhost > /dev/null 2>&1; then
    log_info "✅ Frontend accessibility check passed"
else
    log_warning "⚠️  Frontend accessibility check failed - check nginx configuration"
fi

log_info "🎉 Production deployment completed successfully!"
log_info "🌐 Frontend: http://yourdomain.com"
log_info "🔧 API: http://yourdomain.com/api"
log_info "📊 API Health: http://yourdomain.com/api/health"

echo ""
log_info "Next steps:"
echo "1. Update DNS records to point to this server"
echo "2. Configure your .env.production files with actual production values"
echo "3. Set up database backups"
echo "4. Configure monitoring and logging"
echo "5. Test all functionality in production environment"