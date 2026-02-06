# Architecture Overview

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Express API    │────▶│  PostgreSQL     │
│  (Port 5173)    │     │  (Port 3000)    │     │  (Port 5432)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Components

### Frontend (React + TypeScript)

The frontend is a single-page application built with:
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety

**Key files:**
- `frontend/src/App.tsx` - Main application component
- `frontend/src/components/` - Reusable UI components
- `frontend/src/services/api.ts` - Backend API client

### Backend (Express + TypeScript)

The backend is a REST API built with:
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **pg** - PostgreSQL client

**Architecture pattern:** Service-Repository pattern
- **Routes** handle HTTP requests/responses
- **Services** contain business logic
- **DB module** handles database operations

**Key files:**
- `backend/src/index.ts` - Application entry point
- `backend/src/routes/` - API route definitions
- `backend/src/services/urlService.ts` - URL management logic
- `backend/src/db/` - Database connection and queries
- `backend/src/utils/shortCode.ts` - Short code generation

### Database (PostgreSQL)

Single table schema:

```sql
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(5) NOT NULL UNIQUE,
    long_url VARCHAR(256) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary key on `id`
- Unique constraint on `short_code`
- Index on `short_code` for fast lookups

## Data Flow

### Creating a Short URL

1. User enters long URL in frontend
2. Frontend sends POST to `/api/urls`
3. Backend validates URL length (max 256 chars)
4. Backend generates unique 5-char short code
5. Backend inserts into database
6. Backend returns created URL object
7. Frontend displays new short URL

### Redirecting

1. User visits short URL (e.g., `/abc12`)
2. Backend looks up short code in database
3. If found, returns 301 redirect to long URL
4. Browser follows redirect

## Design Decisions

### Why raw SQL instead of ORM?

- Simpler for this small application
- Direct control over queries
- No additional abstraction layer
- Easy to understand and maintain

### Why 5-character short codes?

- 62^5 = 916,132,832 possible combinations
- Short enough to be memorable
- Long enough to avoid collisions

### Why no URL validation?

- Kept simple per requirements
- Users responsible for valid URLs
- Reduces complexity

### CORS Configuration

CORS is enabled to allow the frontend (port 5173) to communicate with the backend (port 3000) during development.

## Testing Strategy

- **Unit tests** for services and utilities
- **Mocking** database calls in tests
- **Jest** as the test runner
