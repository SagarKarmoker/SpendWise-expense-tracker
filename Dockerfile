# Spend Tracker - Production Dockerfile
# This Dockerfile builds and runs both the API and Web applications
# in a single container for simple deployment

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY packages/types/package*.json ./packages/types/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build all packages and applications
RUN npm run build --workspace=@spend-tracker/types && \
    npm run build --workspace=@spend-tracker/api && \
    npm run build --workspace=@spend-tracker/web

# Production stage
FROM node:20-alpine AS production

# Install supervisord and wget for healthcheck
RUN apk add --no-cache supervisor wget

# Install serve globally for the web app
RUN npm install -g serve

WORKDIR /app

# Copy package files for API
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package*.json ./packages/types/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist

# Copy web app dist for serving
COPY --from=builder /app/apps/web/dist ./apps/web/dist

# Create supervisor configuration
RUN mkdir -p /etc/supervisor.d
RUN echo '[supervisord]' > /etc/supervisor.d/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisor.d/supervisord.conf && \
    echo 'user=root' >> /etc/supervisor.d/supervisord.conf && \
    echo '' >> /etc/supervisor.d/supervisord.conf && \
    echo '[program:api]' >> /etc/supervisor.d/supervisord.conf && \
    echo 'command=node /app/apps/api/dist/main' >> /etc/supervisor.d/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor.d/supervisord.conf && \
    echo 'stderr_logfile=/var/log/api.err.log' >> /etc/supervisor.d/supervisord.conf && \
    echo 'stdout_logfile=/var/log/api.out.log' >> /etc/supervisor.d/supervisord.conf && \
    echo 'environment=NODE_ENV=production,PORT=3000' >> /etc/supervisor.d/supervisord.conf && \
    echo '' >> /etc/supervisor.d/supervisord.conf && \
    echo '[program:web]' >> /etc/supervisor.d/supervisord.conf && \
    echo 'command=serve /app/apps/web/dist -l 80' >> /etc/supervisor.d/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor.d/supervisord.conf && \
    echo 'stderr_logfile=/var/log/web.err.log' >> /etc/supervisor.d/supervisord.conf && \
    echo 'stdout_logfile=/var/log/web.out.log' >> /etc/supervisor.d/supervisord.conf

# Expose ports
EXPOSE 80 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start supervisord
CMD ["supervisord", "-c", "/etc/supervisor.d/supervisord.conf"]
