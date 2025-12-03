# Florida First Roofing - Multi-stage Docker Build for PostgreSQL
# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY tsconfig.json ./
COPY .env.production ./

# Build the frontend for production
RUN npm run build:production

# Stage 2: Setup Backend
FROM node:18-alpine AS backend-setup

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source and configuration
COPY backend/src/ ./src/
COPY backend/prisma/ ./prisma/
COPY backend/.env.production ./.env

# Generate Prisma client
RUN npx prisma generate

# Stage 3: Production image
FROM node:18-alpine AS production

# Install PostgreSQL client and other necessities
RUN apk add --no-cache \
    postgresql-client \
    curl \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Copy built frontend from stage 1
COPY --from=frontend-build --chown=appuser:nodejs /app/build ./public

# Copy backend from stage 2
COPY --from=backend-setup --chown=appuser:nodejs /app/backend ./api

# Copy additional files
COPY --chown=appuser:nodejs deploy-production.sh ./
RUN chmod +x deploy-production.sh

# Create necessary directories
RUN mkdir -p /app/logs /app/uploads
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose ports
EXPOSE 80 5002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5002/health || exit 1

# Create startup script
COPY --chown=appuser:nodejs <<'EOF' /app/start.sh
#!/bin/sh
set -e

echo "🚀 Starting Florida First Roofing Accounting System..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until pg_isready -h ${DB_HOST:-postgres} -p ${DB_PORT:-5432} -U ${DB_USER:-postgres}; do
    echo "Database is unavailable - sleeping"
    sleep 2
done

echo "✅ Database is ready!"

# Run database migrations
echo "🔄 Running database migrations..."
cd /app/api && npx prisma migrate deploy

# Start the API server in background
echo "🔧 Starting API server..."
cd /app/api && node src/index.js &

# Start static file server for frontend
echo "🌐 Starting frontend server..."
npx serve -s /app/public -l 80 &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
EOF

RUN chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]