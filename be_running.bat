@echo off
setlocal enabledelayedexpansion

echo === STARTING BACKEND SERVER ===
echo.

REM Check if backend is already running
powershell -Command "Get-NetTCPConnection -LocalPort 5002 -ErrorAction SilentlyContinue" >nul 2>&1
if %errorlevel%==0 (
    echo [WARNING] Backend already running on port 5002!
    echo Backend:  http://localhost:5002
    echo API Docs: http://localhost:5002/apidocs/#/
    echo.
    echo Backend is already active. Exiting...
    pause
    exit /b 0
)

REM 1. Create Virtual Environment if not exists
if not exist venv (
    echo [INFO] Creating virtual environment venv...
    python -m venv venv
) else (
    echo [INFO] Virtual environment found.
)

REM 2. Activate Virtual Environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM 3. Upgrade pip
echo [INFO] Checking pip version...
python -m pip install --upgrade pip

REM 4. Install Backend Dependencies
if exist requirements.txt (
    echo [INFO] Installing backend dependencies...
    python -m pip install -r requirements.txt
) else (
    echo [ERROR] requirements.txt not found!
    exit /b 1
)

REM 5. Start Backend (Port 5002)
echo [INFO] Starting Backend on port 5002...
echo --------------------------------
start "Backend Server" python app.py

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

echo.
echo === BACKEND SERVER STARTED ===
echo Backend:  http://localhost:5002
echo API Docs: http://localhost:5002/apidocs/#/
echo.
echo Press any key to stop backend server...
pause >nul

REM Kill backend server when user presses a key
echo [INFO] Stopping backend server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5002') do taskkill /F /PID %%a 2>nul

echo [INFO] Backend server stopped.
pause
