# Florida First Roofing - Multi-stage Docker Build
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

# Build the frontend
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS production

# Install sqlite3 for database operations
RUN apk add --no-cache sqlite

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy backend code
COPY backend/ ./backend/
COPY database/ ./database/

# Copy built frontend from previous stage
COPY --from=frontend-build /app/build ./build

# Copy environment files
COPY .env.production ./.env

# Create necessary directories
RUN mkdir -p logs uploads
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Initialize database
RUN npm run setup-db
RUN npm run seed-data

# Expose ports
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD npm run health-check

# Start the application
CMD ["npm", "run", "full-stack"]