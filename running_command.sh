#!/bin/bash

# Stop script on first error
set -e

echo "=== STARTING AI SERVICE SETUP ==="

# 1. Create Virtual Environment if not exists
if [ ! -d "venv" ]; then
    echo "[INFO] Creating virtual environment (venv)..."
    python3 -m venv venv
else
    echo "[INFO] Virtual environment found."
fi

# 2. Activate Virtual Environment
# Activation only applies to this script session
source venv/bin/activate

# 3. Upgrade pip (Best Practice)
echo "[INFO] Checking pip version..."
pip install --upgrade pip

# 4. Install Dependencies
if [ -f "requirements.txt" ]; then
    echo "[INFO] Installing dependencies..."
    pip install -r requirements.txt
else
    echo "[ERROR] requirements.txt not found!"
    exit 1
fi

# 5. Run the Application
echo "[INFO] Cleaning up port 5002..."
lsof -t -i :5002 | xargs kill -9 || true

echo "[INFO] Starting App..."
echo "--------------------------------"
python3 app.py