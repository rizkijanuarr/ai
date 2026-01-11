@echo off
REM Stop script on first error
setlocal enabledelayedexpansion

echo === STARTING AI SERVICE SETUP ===
echo.

REM Kill processes on port 5002
echo [INFO] Killing processes on port 5002...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5002') do (
    taskkill /F /PID %%a 2>nul
)

REM Kill processes on port 3000
echo [INFO] Killing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /F /PID %%a 2>nul
)

REM 1. Create Virtual Environment if not exists
if not exist "venv" (
    echo [INFO] Creating virtual environment (venv)...
    python -m venv venv
) else (
    echo [INFO] Virtual environment found.
)

REM 2. Activate Virtual Environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM 3. Upgrade pip (Best Practice)
echo [INFO] Checking pip version...
python -m pip install --upgrade pip

REM 4. Install Backend Dependencies
if exist "requirements.txt" (
    echo [INFO] Installing backend dependencies...
    python -m pip install -r requirements.txt
) else (
    echo [ERROR] requirements.txt not found!
    exit /b 1
)

REM 5. Install Frontend Dependencies
echo [INFO] Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM 6. Start Backend (Port 5002)
echo [INFO] Starting Backend on port 5002...
echo --------------------------------
start "Backend Server" python app.py

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM 7. Start Frontend (Port 3000)
echo [INFO] Starting Frontend on port 3000...
echo --------------------------------
cd frontend
start "Frontend Server" npm run dev
cd ..

echo.
echo === SERVICES STARTED ===
echo Backend:  http://localhost:5002
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:5002/apidocs/#/
echo.
echo Press any key to stop all services...
pause >nul

REM Kill both servers when user presses a key
echo [INFO] Stopping services...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5002') do (
    taskkill /F /PID %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /F /PID %%a 2>nul
)

echo [INFO] All services stopped.
pause
