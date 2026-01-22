#!/bin/bash

# Stop script on first error
set -e

echo "=== STARTING BACKEND SERVER ==="

# Check if backend is already running
if lsof -Pi :5002 -sTCP:LISTEN -t >/dev/null ; then
    echo "[WARNING] Backend already running on port 5002!"
    echo "Backend:  http://localhost:5002"
    echo "API Docs: http://localhost:5002/apidocs/#/"
    echo ""
    echo "Backend is already active. Exiting..."
    exit 0
fi

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

# 5. Start Backend (Port 5002)
echo "[INFO] Starting Backend on port 5002..."
echo "--------------------------------"
python3 app.py &
BACKEND_PID=$!
echo "[INFO] Backend started with PID: $BACKEND_PID"

echo ""
echo "=== BACKEND SERVER STARTED ==="
echo "Backend:  http://localhost:5002"
echo "API Docs: http://localhost:5002/apidocs/#/"
echo ""
echo "Press Ctrl+C to stop backend server"

# Wait for backend process
wait $BACKEND_PID
