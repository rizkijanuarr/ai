@echo off
setlocal enabledelayedexpansion

echo === STARTING FRONTEND SERVER ===
echo.

REM Check if frontend is already running
powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue" >nul 2>&1
if %errorlevel%==0 (
    echo [WARNING] Frontend already running on port 3000!
    echo Frontend: http://localhost:3000
    echo.
    echo Frontend is already active. Exiting...
    pause
    exit /b 0
)

REM Check for --force flag
set FORCE_CLEAN=0
if "%1"=="--force" set FORCE_CLEAN=1
if "%1"=="-f" set FORCE_CLEAN=1

REM Navigate to frontend directory
if not exist frontend (
    echo [ERROR] Frontend directory not found!
    exit /b 1
)

cd frontend

REM Install Frontend Dependencies
if %FORCE_CLEAN%==1 (
    echo [INFO] FORCE CLEAN MODE - Removing all caches...
    if exist node_modules rd /s /q node_modules
    if exist dist rd /s /q dist
    if exist package-lock.json del /f package-lock.json

    echo [INFO] Installing frontend dependencies...
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

REM Start Frontend (Port 3000)
echo [INFO] Starting Frontend on port 3000...
echo --------------------------------
start "Frontend Server" npm run dev

cd ..

REM Wait a bit for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo === FRONTEND SERVER STARTED ===
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop frontend server...
pause >nul

REM Kill frontend server when user presses a key
echo [INFO] Stopping frontend server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /F /PID %%a 2>nul

echo [INFO] Frontend server stopped.
pause
