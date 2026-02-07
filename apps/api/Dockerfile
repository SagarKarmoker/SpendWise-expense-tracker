# API Dockerfile - Production
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

# Build packages and API
RUN npm run build --workspace=@spend-tracker/types && \
    npm run build --workspace=@spend-tracker/api

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package*.json ./packages/types/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["node", "dist/main"]
