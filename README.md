# URL Shortener

A simple URL shortening service built with Node.js, Express, React, and PostgreSQL.

## Features

- ✅ Create shortened URLs (5-character alphanumeric codes)
- ✅ List all shortened URLs
- ✅ Delete shortened URLs
- ✅ Redirect short URLs to their destinations
- ✅ Clean web UI for managing links

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React, Vite, TypeScript
- **Database**: PostgreSQL
- **Testing**: Jest

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)

### Run with Docker (Recommended)

```bash
# Start all services
docker-compose up

# Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

### Run Locally

1. Start the database:
   ```bash
   docker-compose up postgres
   ```

2. Start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Start the frontend (new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/urls` | Create a shortened URL |
| GET | `/api/urls` | List all URLs |
| DELETE | `/api/urls/:id` | Delete a URL |
| GET | `/:shortCode` | Redirect to long URL |
| GET | `/health` | Health check |

## Running Tests

```bash
cd backend
npm test
```

## Documentation

- [Setup Instructions](docs/setup.md)
- [API Documentation](docs/api.md)
- [Architecture Overview](docs/architecture.md)

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── db/           # Database connection and queries
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── tests/            # Unit tests
├── frontend/
│   └── src/
│       ├── components/   # React components
│       └── services/     # API client
├── docs/                 # Documentation
└── docker-compose.yml    # Docker services
```

## License

ISC