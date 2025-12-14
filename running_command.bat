@echo off
REM Stop script on first error
setlocal enabledelayedexpansion

echo === STARTING AI SERVICE SETUP ===
echo.

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

REM 4. Install Dependencies
if exist "requirements.txt" (
    echo [INFO] Installing dependencies...
    pip install -r requirements.txt
) else (
    echo [ERROR] requirements.txt not found!
    exit /b 1
)

REM 5. Kill existing process on port 5002 (if any)
echo [INFO] Cleaning up port 5002...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5002') do (
    taskkill /F /PID %%a 2>nul
)

REM 6. Run the Application
echo [INFO] Starting App...
echo --------------------------------
python app.py

pause
