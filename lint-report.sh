#!/bin/bash

# Run ESLint reports for backend and frontend, then open in browser

echo "Running ESLint for backend..."
cd backend && npm run lint:report
cd ..

echo "Running ESLint for frontend..."
cd frontend && npm run lint:report
cd ..

echo "Opening reports in browser..."
open backend/eslint-report.html
open frontend/eslint-report.html

echo "Done!"
