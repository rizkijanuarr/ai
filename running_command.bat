@echo off
setlocal enabledelayedexpansion

echo === STARTING AI SERVICE SETUP (React + Vite) ===
echo.

REM Check for --force flag
set FORCE_CLEAN=0
if "%1"=="--force" set FORCE_CLEAN=1
if "%1"=="-f" set FORCE_CLEAN=1

REM Check if services are already running
set SERVICE_RUNNING=0
powershell -Command "Get-NetTCPConnection -LocalPort 5002 -ErrorAction SilentlyContinue" >nul 2>&1
if %errorlevel%==0 set SERVICE_RUNNING=1
powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue" >nul 2>&1
if %errorlevel%==0 set SERVICE_RUNNING=1

if %SERVICE_RUNNING%==1 (
    echo [WARNING] Services already running!
    echo Backend:  http://localhost:5002
    echo Frontend: http://localhost:3000 (React + Vite)
    echo.
    echo Services are already active. Exiting...
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

REM 5. Install Frontend Dependencies (React + Vite)
cd frontend

if %FORCE_CLEAN%==1 (
    echo [INFO] FORCE CLEAN MODE - Removing all caches...
    if exist node_modules rd /s /q node_modules
    if exist dist rd /s /q dist
    if exist package-lock.json del /f package-lock.json

    echo [INFO] Installing frontend dependencies (React + Vite)...
    npm install
) else (
    if exist node_modules (
        if exist package-lock.json (
            echo [INFO] Dependencies already installed. Cleaning dist cache only...
            if exist dist (
                echo [INFO] Removing dist cache...
                rd /s /q dist
            )
        ) else (
            echo [INFO] package-lock.json missing. Reinstalling dependencies...
            if exist dist rd /s /q dist
            npm install
        )
    ) else (
        echo [INFO] node_modules not found. Installing dependencies...
        if exist dist rd /s /q dist
        if exist package-lock.json del /f package-lock.json
        npm install
    )
)

cd ..

REM 6. Start Backend (Port 5002)
echo [INFO] Starting Backend on port 5002...
echo --------------------------------
start "Backend Server" python app.py

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM 7. Start Frontend (Port 3000) - React + Vite
echo [INFO] Starting Frontend (React + Vite) on port 3000...
echo --------------------------------
cd frontend
start "Frontend Server (React + Vite)" npm run dev
cd ..

echo.
echo === SERVICES STARTED ===
echo Backend:  http://localhost:5002
echo Frontend: http://localhost:3000 (React + Vite)
echo API Docs: http://localhost:5002/apidocs/#/
echo.
echo Tech Stack:
echo   - Backend:  Python + Flask
echo   - Frontend: React 19 + Vite + TypeScript
echo.
echo Press any key to stop all services...
pause >nul

REM Kill both servers when user presses a key
echo [INFO] Stopping services...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5002') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /F /PID %%a 2>nul

echo [INFO] All services stopped.
pause
