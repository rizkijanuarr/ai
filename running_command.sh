#!/bin/bash

# Stop script on first error
set -e

echo "=== STARTING AI SERVICE SETUP (React + Vite) ==="

# Check for --force flag
FORCE_CLEAN=0
if [ "$1" = "--force" ] || [ "$1" = "-f" ]; then
    FORCE_CLEAN=1
fi

# Kill processes on ports 5002 and 3000
echo "[INFO] Killing processes on port 5002..."
lsof -t -i :5002 | xargs kill -9 2>/dev/null || echo "[INFO] No process on port 5002"

echo "[INFO] Killing processes on port 3000..."
lsof -t -i :3000 | xargs kill -9 2>/dev/null || echo "[INFO] No process on port 3000"

# 1. Create Virtual Environment if not exists
if [ ! -d "venv" ]; then
    echo "[INFO] Creating virtual environment (venv)..."
    python3 -m venv venv
else
    echo "[INFO] Virtual environment found."
fi

# 2. Activate Virtual Environment
source venv/bin/activate

# 3. Upgrade pip (Best Practice)
echo "[INFO] Checking pip version..."
python -m pip install --upgrade pip

# 4. Install Backend Dependencies
if [ -f "requirements.txt" ]; then
    echo "[INFO] Installing backend dependencies..."
    python -m pip install -r requirements.txt
else
    echo "[ERROR] requirements.txt not found!"
    exit 1
fi

# 5. Install Frontend Dependencies (React + Vite)
cd frontend

if [ $FORCE_CLEAN -eq 1 ]; then
    echo "[INFO] FORCE CLEAN MODE - Removing all caches..."
    rm -rf node_modules
    rm -rf dist
    rm -f package-lock.json

    echo "[INFO] Installing frontend dependencies (React + Vite)..."
    npm install
else
    if [ -d "node_modules" ]; then
        echo "[INFO] Frontend dependencies already installed, skipping..."
        echo "[INFO] Use --force or -f flag to force reinstall"
    else
        echo "[INFO] Cleaning frontend cache..."
        rm -rf dist
        rm -f package-lock.json

        echo "[INFO] Installing frontend dependencies (React + Vite)..."
        npm install
    fi
fi

cd ..

# 6. Start Backend (Port 5002)
echo "[INFO] Starting Backend on port 5002..."
echo "--------------------------------"
python3 app.py &
BACKEND_PID=$!
echo "[INFO] Backend started with PID: $BACKEND_PID"

# 7. Start Frontend (Port 3000) - React + Vite
echo "[INFO] Starting Frontend (React + Vite) on port 3000..."
echo "--------------------------------"
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "[INFO] Frontend started with PID: $FRONTEND_PID"
cd ..

echo ""
echo "=== SERVICES STARTED ==="
echo "Backend:  http://localhost:5002"
echo "Frontend: http://localhost:3000 (React + Vite)"
echo "API Docs: http://localhost:5002/apidocs/#/"
echo ""
echo "Tech Stack:"
echo "  - Backend:  Python + Flask"
echo "  - Frontend: React 19 + Vite + TypeScript"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait
