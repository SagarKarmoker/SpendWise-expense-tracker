# Web Dockerfile - Production
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

# Build packages and web app
RUN npm run build --workspace=@spend-tracker/types && \
    npm run build --workspace=@spend-tracker/web

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
