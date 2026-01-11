#!/bin/bash

# Stop script on first error
set -e

echo "=== STARTING AI SERVICE SETUP ==="

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

# 5. Install Frontend Dependencies
echo "[INFO] Installing frontend dependencies..."
cd frontend
npm install
cd ..

# 6. Start Backend (Port 5002)
echo "[INFO] Starting Backend on port 5002..."
echo "--------------------------------"
python3 app.py &
BACKEND_PID=$!
echo "[INFO] Backend started with PID: $BACKEND_PID"

# 7. Start Frontend (Port 3000)
echo "[INFO] Starting Frontend on port 3000..."
echo "--------------------------------"
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "[INFO] Frontend started with PID: $FRONTEND_PID"
cd ..

echo ""
echo "=== SERVICES STARTED ==="
echo "Backend:  http://localhost:5002"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:5002/apidocs/#/"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait
