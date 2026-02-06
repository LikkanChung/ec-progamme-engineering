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

## Linting

Both the backend and frontend use ESLint for code quality.

### Run Linting

```bash
# Backend
cd backend
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues

# Frontend
cd frontend
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Generate Lint Reports

To generate HTML lint reports and open them in your browser:

```bash
./lint-report.sh
```

This script runs ESLint on both projects and opens the generated reports (`backend/eslint-report.html` and `frontend/eslint-report.html`) in your default browser.

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