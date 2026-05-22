#!/bin/bash

set -e

# Install dependencies for backend and frontend only.

echo "Checking prerequisites..."
if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed. Please install Node.js 20+ first."
  exit 1
fi

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "Setup complete."
echo "Next steps:"
echo "1) Start database: docker-compose up postgres"
echo "2) Start backend: cd backend && npm run dev"
echo "3) Start frontend: cd frontend && npm run dev"
echo ""
echo "Testing:"
echo "- Backend tests: cd backend && npm test"
echo "- Frontend tests: cd frontend && npm test"
echo ""
echo "Coverage:"
echo "- Backend coverage: cd backend && npm run test:coverage"
echo "- Frontend coverage: cd frontend && npm run test:coverage"
