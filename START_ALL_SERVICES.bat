@echo off
echo ========================================
echo   PROGREE - Starting All Services
echo ========================================
echo.

echo Starting Backend Services...
echo.

REM Task 2: REST API Server
echo [1/4] Starting REST API Server (Port 3000)...
start "REST API Server" cmd /k "cd task-2-rest-api-crud && npm start"
timeout /t 3 /nobreak >nul

REM Task 3: WebSocket Chat Server
echo [2/4] Starting WebSocket Chat Server (Port 4000)...
start "WebSocket Chat" cmd /k "cd task-3-websocket-chat && npm start"
timeout /t 3 /nobreak >nul

REM Task 4: Auth Service
echo [3/4] Starting Auth Service (Port 5001)...
start "Auth Service" cmd /k "cd task-4-microservice-rbac && npm run auth"
timeout /t 2 /nobreak >nul

REM Task 4: API Service
echo [4/4] Starting API Service (Port 5002)...
start "API Service" cmd /k "cd task-4-microservice-rbac && npm run api"
timeout /t 2 /nobreak >nul

REM Task 4: Worker Service
echo [5/5] Starting Worker Service (Port 5003)...
start "Worker Service" cmd /k "cd task-4-microservice-rbac && npm run worker"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   All Backend Services Started!
echo ========================================
echo.
echo REST API:     http://localhost:3000
echo WebSocket:    http://localhost:4000
echo Auth Service: http://localhost:5001
echo API Service:  http://localhost:5002
echo Worker:       http://localhost:5003
echo.
echo Starting Frontend in 5 seconds...
timeout /t 5 /nobreak >nul

REM Frontend
echo Starting React Frontend (Port 3001)...
start "React Frontend" cmd /k "cd frontend && set PORT=3001 && npm start"

echo.
echo ========================================
echo   PROGREE Platform Ready!
echo ========================================
echo.
echo Frontend: http://localhost:3001
echo.
echo Press any key to exit this window...
pause >nul
