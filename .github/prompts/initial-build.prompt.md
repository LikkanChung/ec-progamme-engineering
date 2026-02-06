# Project Prompt

## Project Overview
This is a simple link redireciton service built with Node.js and Express. It allows users to create short links that redirect to longer URLs. The service includes features for creating, managing, and using link redirects.


## Requirements

### Functional Requirements
1. When a fully qualified URL is provided, a redirection URL is created and stored in the database
2. When a shortened URL is accessed, the user is redirected to the destination fully qualified URL.
3. Users can list existing URL redirections. 
4. Users can delete existing URL redirections.
5. Short URLs are auto-generated (5 alphanumeric characters)
6. Web UI for managing links (create, list, delete)

### Technical Requirements
* The service uses Node.js with TypeScript as the backend
* Express.js backend API
* React frontend with TypeScript
* PostgreSQL database using raw SQL queries
* Maximum URL length: 256 characters for long URLs
* Short URL ID length: 5 alphanumeric characters
* Docker Compose setup for easy local development (PostgreSQL + app)
* Standard HTTP ports (3000 for backend, 5173 for frontend)
* No authentication/authorization required
* No analytics or expiry features
* No URL validation or duplicate checking

### User Stories
- As a user, I want to enter a long URL and receive a shortened URL
- As a user, I want to view a list of all my shortened URLs with their destinations
- As a user, I want to delete a shortened URL I no longer need
- As a user, I want to click on a shortened URL and be redirected to the original destination
- As a developer, I want to run the entire application locally with a single command


## Architecture

### Tech Stack
- **Language**: TypeScript
- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite
- **Database**: PostgreSQL (raw SQL queries, no ORM)
- **Development**: Docker Compose
- **Testing**: Jest for unit tests
- **Package Manager**: npm

### Project Structure
```
/
├── backend/
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic
│   │   ├── db/             # Database connection and queries
│   │   ├── utils/          # Utility functions (short code generator)
│   │   └── index.ts        # Entry point
│   ├── tests/              # Unit tests
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tsconfig.json
├── docs/                   # Documentation
├── docker-compose.yml      # Docker services (PostgreSQL + app)
├── .env.example
└── README.md
```

### Key Components

**Backend:**
- API Routes: POST /api/urls (create), GET /api/urls (list), DELETE /api/urls/:id (delete)
- Redirect Route: GET /:shortCode (redirect to long URL)
- Database module: Connection pool, SQL queries for CRUD operations
- Short code generator: Creates random 5-character alphanumeric codes
- Database schema: `urls` table with id, short_code, long_url, created_at

**Frontend:**
- URL creation form component
- URL list display component with delete functionality
- API service for backend communication
- Simple, clean UI layout


## Implementation Steps
1. Set up project structure with backend and frontend directories
2. Configure Docker Compose with PostgreSQL
3. Create database schema and connection module
4. Implement backend API endpoints (create, list, delete)
5. Implement redirect endpoint
6. Write unit tests for backend services
7. Set up React frontend with Vite
8. Create UI components for URL management
9. Connect frontend to backend API
10. Write documentation in docs/ directory
11. Create README with setup and run instructions
12. Test full workflow locally


## Success Criteria
- Application runs locally with `docker-compose up` or `npm run dev`
- Users can create shortened URLs through the web UI
- Users can view all shortened URLs in a list
- Users can delete shortened URLs
- Shortened URLs redirect to the correct destination
- Unit tests pass for core backend functionality
- Documentation exists in docs/ directory covering:
  - Setup instructions
  - API documentation
  - Architecture overview
- README.md contains clear instructions for running the project


## Additional Notes
- Keep the implementation simple and straightforward
- Focus on core functionality without over-engineering
- Use standard HTTP error codes and responses
- CORS should be configured to allow frontend-backend communication during development
- Short codes should be checked for uniqueness before insertion
- Database should use a unique constraint on short_code column
- Consider adding a health check endpoint for monitoring
