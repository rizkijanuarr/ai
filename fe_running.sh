#!/bin/bash

# Stop script on first error
set -e

echo "=== STARTING FRONTEND SERVER ==="

# Check if frontend is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "[WARNING] Frontend already running on port 3000!"
    echo "Frontend: http://localhost:3000"
    echo ""
    echo "Frontend is already active. Exiting..."
    exit 0
fi

# Check for --force flag
FORCE_CLEAN=0
if [ "$1" = "--force" ] || [ "$1" = "-f" ]; then
    FORCE_CLEAN=1
fi

# Navigate to frontend directory
if [ ! -d "frontend" ]; then
    echo "[ERROR] Frontend directory not found!"
    exit 1
fi

cd frontend

# Install Frontend Dependencies
if [ $FORCE_CLEAN -eq 1 ]; then
    echo "[INFO] FORCE CLEAN MODE - Removing all caches..."
    rm -rf node_modules
    rm -rf dist
    rm -f package-lock.json

    echo "[INFO] Installing frontend dependencies..."
    npm install
else
    if [ -d "node_modules" ]; then
        echo "[INFO] Frontend dependencies already installed, skipping..."
        echo "[INFO] Use --force or -f flag to force reinstall"
    else
        echo "[INFO] Cleaning frontend cache..."
        rm -rf dist
        rm -f package-lock.json

        echo "[INFO] Installing frontend dependencies..."
        npm install
    fi
fi

# Start Frontend (Port 3000)
echo "[INFO] Starting Frontend on port 3000..."
echo "--------------------------------"
npm run dev &
FRONTEND_PID=$!
echo "[INFO] Frontend started with PID: $FRONTEND_PID"

cd ..

echo ""
echo "=== FRONTEND SERVER STARTED ==="
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop frontend server"

# Wait for frontend process
wait $FRONTEND_PID
