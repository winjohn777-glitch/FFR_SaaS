# 🚀 Florida First Roofing - Production Deployment Guide

## Overview
This is the complete production deployment guide for the Florida First Roofing Accounting System. The platform has been successfully migrated from localStorage to PostgreSQL database storage and is ready for production deployment.

## ✅ System Requirements

### Minimum Server Specifications
- **CPU**: 2+ cores
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 50GB SSD minimum
- **OS**: Ubuntu 20.04 LTS or higher / CentOS 8+ / Debian 11+

### Software Dependencies
- **Node.js**: v18.x or higher
- **PostgreSQL**: v13+ (recommended v15+)
- **Docker**: v20.x+ (optional but recommended)
- **Nginx**: v1.18+ (for reverse proxy)
- **SSL Certificate**: Let's Encrypt or commercial

## 🗄️ Database Setup

### 1. PostgreSQL Installation & Configuration
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo dnf install postgresql postgresql-server postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Database User & Schema Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE florida_first_roofing_prod;
CREATE USER florida_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE florida_first_roofing_prod TO florida_user;
\q
```

## 🐳 Docker Deployment (Recommended)

### 1. Quick Start with Docker Compose
```bash
# Clone and navigate to project directory
cd florida-first-roofing/accounting

# Create environment file
cp .env.production.example .env.production
# Edit .env.production with your values

# Start all services
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f app
```

### 2. Environment Variables (.env.production)
```bash
# Database
DATABASE_PASSWORD=your_secure_database_password
DATABASE_URL=postgresql://florida_user:your_secure_database_password@postgres:5432/florida_first_roofing_prod

# Security
JWT_SECRET=your_super_secure_jwt_secret_at_least_64_characters_long

# Domain Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Data Storage Path
DATA_PATH=/opt/florida-first-roofing/data
```

## 🔧 Manual Deployment (Alternative)

### 1. Backend Setup
```bash
# Install dependencies
cd backend
npm ci --only=production

# Set environment variables
cp .env.production.example .env.production
# Edit .env.production

# Run database migrations
npx prisma migrate deploy

# Start backend
npm start
```

### 2. Frontend Build & Deploy
```bash
# Build production frontend
npm run build:production

# Serve static files with nginx or serve
npx serve -s build -l 80
```

### 3. Production Deployment Script
```bash
# Make deployment script executable
chmod +x deploy-production.sh

# Run deployment
sudo ./deploy-production.sh
```

## 🔒 Security Configuration

### 1. SSL Certificate Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Firewall Configuration
```bash
# Enable UFW
sudo ufw enable

# Allow necessary ports
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw allow 5432    # PostgreSQL (if external access needed)
```

### 3. Security Headers (Nginx)
```nginx
# Add to nginx config
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

## 📊 Monitoring & Maintenance

### 1. Health Checks
```bash
# API health check
curl -f https://yourdomain.com/api/health

# Frontend accessibility
curl -f https://yourdomain.com

# Database connection test
docker exec florida-first-roofing-db pg_isready -U florida_user
```

### 2. Backup Configuration
```bash
# Manual backup
docker-compose -f docker-compose.production.yml --profile backup run backup

# Automated daily backup (crontab)
0 2 * * * cd /path/to/project && docker-compose -f docker-compose.production.yml --profile backup run backup
```

### 3. Log Management
```bash
# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres

# Log rotation setup (logrotate)
sudo nano /etc/logrotate.d/florida-first-roofing
```

## 🎯 Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_customers_organization_id ON customers(organization_id);
CREATE INDEX CONCURRENTLY idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX CONCURRENTLY idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX CONCURRENTLY idx_transactions_date ON transactions(date DESC);
```

### 2. Nginx Caching
```nginx
# Add to nginx config
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Connection Pooling
```javascript
// In production Prisma configuration
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // Connection pooling
  connection_limit = 20
  pool_timeout = 20000
}
```

## 🚨 Troubleshooting

### Common Issues & Solutions

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql

   # Check connection
   pg_isready -h localhost -p 5432 -U florida_user

   # Review logs
   sudo tail -f /var/log/postgresql/postgresql-13-main.log
   ```

2. **Frontend Build Errors**
   ```bash
   # Clear cache and rebuild
   npm cache clean --force
   rm -rf node_modules
   npm install
   npm run build:production
   ```

3. **API Server Issues**
   ```bash
   # Check process status
   pm2 status

   # Restart API server
   pm2 restart florida-first-roofing-api

   # View logs
   pm2 logs florida-first-roofing-api
   ```

## 📈 Production Checklist

- [ ] **Environment Variables**: All production values configured
- [ ] **Database**: PostgreSQL installed and configured
- [ ] **SSL Certificate**: HTTPS enabled with valid certificate
- [ ] **Firewall**: Only necessary ports exposed
- [ ] **Backup Strategy**: Automated database backups configured
- [ ] **Monitoring**: Health checks and log monitoring set up
- [ ] **Performance**: Database indexes and caching configured
- [ ] **Security**: Security headers and rate limiting enabled
- [ ] **Documentation**: Team trained on production procedures

## 🔄 Deployment Commands

### Quick Deployment
```bash
# Full production deployment
npm run deploy:production

# Database migration only
npm run db:migrate:production

# Frontend build only
npm run build:production

# Backend production start
npm run backend:production
```

### Docker Commands
```bash
# Start production environment
docker-compose -f docker-compose.production.yml up -d

# Scale application
docker-compose -f docker-compose.production.yml up --scale app=2 -d

# Update deployment
docker-compose -f docker-compose.production.yml pull && docker-compose -f docker-compose.production.yml up -d

# Stop all services
docker-compose -f docker-compose.production.yml down
```

## 📞 Support

For production deployment support or issues:

1. **Documentation**: Review this guide and API documentation
2. **Logs**: Check application and database logs first
3. **Health Checks**: Verify all services are responding
4. **Monitoring**: Use provided monitoring tools and health endpoints

## 🎉 Success!

Your Florida First Roofing Accounting System is now production-ready with:

- ✅ **PostgreSQL Database**: Full ACID compliance with audit logging
- ✅ **RESTful API**: Comprehensive backend with rate limiting
- ✅ **React Frontend**: Optimized production build
- ✅ **Security**: SSL, security headers, and proper authentication
- ✅ **Scalability**: Docker containers with load balancing support
- ✅ **Monitoring**: Health checks and comprehensive logging
- ✅ **Backup**: Automated database backup system

**Live URLs:**
- 🌐 **Frontend**: https://yourdomain.com
- 🔧 **API**: https://yourdomain.com/api
- 📊 **Health Check**: https://yourdomain.com/api/health

---

*Generated for Florida First Roofing Accounting System v1.0.0*