# Docker Setup Instructions

## Prerequisites
- Docker
- Docker Compose

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Build and run both frontend and backend:**
   ```bash
   docker-compose up --build
   ```

3. **Access the applications:**
   - frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Commands

### Start services
```bash
docker-compose up
```

### Start services in background
```bash
docker-compose up -d
```

### Rebuild and start
```bash
docker-compose up --build
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### View logs for specific service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Development

The setup includes volume mounts for hot reloading:
- frontend: Changes to `frontend/src` will auto-reload
- Backend: Changes to `backend/` will auto-reload

## Troubleshooting

1. **Port conflicts**: Make sure ports 5173 and 8000 are not being used by other applications
2. **Permission issues**: Try running with `sudo` if needed
3. **Build issues**: Clear Docker cache with `docker system prune -a`

## Services Overview

- **Backend**: FastAPI application running on port 8000
- **frontend**: React + Vite application running on port 5173
