# Copilot Instructions

## Project Overview
URL shortening service with Express.js backend, React frontend, and PostgreSQL database.

## Source of Truth
**Always check [.github/prompts/initial-build.prompt.md](prompts/initial-build.prompt.md) first** - Contains project requirements, architecture, and implementation steps.

## Architecture

### Tech Stack
- **Backend**: Node.js + Express.js + TypeScript (port 3000)
- **Frontend**: React + Vite + TypeScript (port 5173)
- **Database**: PostgreSQL with raw SQL (no ORM)
- **Testing**: Jest
- **Dev Environment**: Docker Compose

### Project Structure
```
backend/src/
  routes/      # Express route handlers
  services/    # Business logic layer
  db/          # Database connection and queries
  utils/       # Short code generator, helpers
frontend/src/
  components/  # React components
  services/    # API client
docs/          # Documentation (setup, API, architecture)
```

### API Endpoints
- `POST /api/urls` - Create shortened URL
- `GET /api/urls` - List all URLs
- `DELETE /api/urls/:id` - Delete URL
- `GET /:shortCode` - Redirect to long URL

## Code Patterns

### Database Queries
Use raw SQL with parameterized queries in `backend/src/db/`:
```typescript
const result = await pool.query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);
```

### Short Code Generation
5-character alphanumeric codes, check uniqueness before insert. Max long URL: 256 chars.

### Error Handling
Use standard HTTP status codes (201 created, 404 not found, 500 server error).

## Development Commands
```bash
docker-compose up        # Start PostgreSQL + app
npm run dev              # Run backend/frontend in dev mode
npm test                 # Run Jest unit tests
```

## Key Constraints
- No authentication required
- No analytics or URL expiry
- No URL validation or duplicate checking
- CORS configured for frontend-backend communication
- Unique constraint on `short_code` column

## When Making Changes
Explain what was changed and why. Describe anti-patterns avoided, design patterns followed, and any trade-offs made. Treat the person reading the code as a junior developer who needs to understand the rationale behind decisions.
