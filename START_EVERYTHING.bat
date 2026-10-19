@echo off
echo ========================================
echo   Starting All Progree Services
echo ========================================
echo.

echo Starting Task 2: REST API (Port 3000)...
start "Task-2-REST-API" cmd /k "cd task-2-rest-api-crud && npm start"
timeout /t 2 /nobreak >nul

echo Starting Task 3: WebSocket Chat (Port 4000)...
start "Task-3-WebSocket-Chat" cmd /k "cd task-3-websocket-chat && npm start"
timeout /t 2 /nobreak >nul

echo Starting Task 4: Auth Service (Port 5001)...
start "Task-4-Auth-Service" cmd /k "cd task-4-microservice-rbac && node services/auth-service.js"
timeout /t 2 /nobreak >nul

echo Starting Task 4: API Service (Port 5002)...
start "Task-4-API-Service" cmd /k "cd task-4-microservice-rbac && node services/api-service.js"
timeout /t 2 /nobreak >nul

echo Starting Frontend React App (Port 3001)...
start "Frontend-React" cmd /k "cd frontend && set PORT=3001 && npm start"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Frontend:        http://localhost:3001
echo Task 2 API:      http://localhost:3000/api
echo Task 3 Chat:     http://localhost:4000
echo Task 4 Auth:     http://localhost:5001
echo Task 4 API:      http://localhost:5002
echo.
echo Press any key to stop all services...
pause >nul

taskkill /FI "WindowTitle eq Task-2-REST-API*" /T /F
taskkill /FI "WindowTitle eq Task-3-WebSocket-Chat*" /T /F
taskkill /FI "WindowTitle eq Task-4-Auth-Service*" /T /F
taskkill /FI "WindowTitle eq Task-4-API-Service*" /T /F
taskkill /FI "WindowTitle eq Frontend-React*" /T /F

echo All services stopped.
