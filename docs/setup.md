# Setup Instructions

## Prerequisites

- Node.js 20 or higher
- Docker and Docker Compose
- npm

## Quick Start

### Option 1: Docker Compose (Recommended)

This option runs everything in containers including the database.

```bash
# From the project root
docker-compose up
```

This will:
- Start PostgreSQL on port 5432
- Start the backend on port 3000
- Start the frontend on port 5173

### Option 2: Local Development

If you want to run services locally with npm:

1. **Start PostgreSQL with Docker:**
   ```bash
   docker-compose up postgres
   ```

2. **Install backend dependencies and run:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Install frontend dependencies and run (in another terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Variables

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

### Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | postgresql://postgres:postgres@localhost:5432/urlshortener | PostgreSQL connection string |
| PORT | 3000 | Backend server port |
| VITE_API_URL | http://localhost:3000 | Backend API URL for frontend |

## Running Tests

```bash
cd backend
npm test
```

## Accessing the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## Stopping Services

```bash
# If using Docker Compose
docker-compose down

# To also remove the database volume
docker-compose down -v
```
