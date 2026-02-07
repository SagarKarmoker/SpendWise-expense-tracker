# Spend Tracker - Docker Setup

This application is fully containerized with Docker.

## Quick Start

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Web App: http://localhost
   - API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

## Services

- **PostgreSQL** (port 5432) - Database
- **Redis** (port 6379) - Cache
- **API** (port 3000) - NestJS backend
- **Web** (port 80) - React frontend

## Useful Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose up --build api

# Execute commands in containers
docker-compose exec api sh
docker-compose exec postgres psql -U spendtracker -d spendtracker
```

## Environment Variables

Create a `.env` file from `.env.example` and customize:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USER` | PostgreSQL username | spendtracker |
| `DB_PASSWORD` | PostgreSQL password | spendtracker |
| `DB_NAME` | PostgreSQL database name | spendtracker |
| `JWT_SECRET` | Secret key for JWT tokens | Change this! |
| `API_PORT` | API server port | 3000 |
| `WEB_PORT` | Web server port | 80 |

## Production Deployment

1. Update `.env` with production values
2. Change `JWT_SECRET` to a secure random string
3. Use strong database passwords
4. Consider using Docker Swarm or Kubernetes for orchestration
5. Set up SSL/TLS certificates
6. Configure proper backup strategies for PostgreSQL data
