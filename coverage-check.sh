#!/bin/bash

# Run coverage checks for backend and frontend.

backend_status=0
frontend_status=0

echo "Running backend coverage..."
cd backend
npm run test:coverage || backend_status=$?
cd ..

echo "Running frontend coverage..."
cd frontend
npm run test:coverage || frontend_status=$?
cd ..

echo "Coverage checks complete."

if [ "$backend_status" -ne 0 ] || [ "$frontend_status" -ne 0 ]; then
	exit 1
fi

exit 0
