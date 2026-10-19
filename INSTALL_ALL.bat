@echo off
echo ========================================
echo   PROGREE - Installing Dependencies
echo ========================================
echo.

echo [1/5] Installing Task 2 - REST API dependencies...
cd task-2-rest-api-crud
call npm install
cd ..
echo.

echo [2/5] Installing Task 3 - WebSocket Chat dependencies...
cd task-3-websocket-chat
call npm install
cd ..
echo.

echo [3/5] Installing Task 4 - Microservice RBAC dependencies...
cd task-4-microservice-rbac
call npm install
cd ..
echo.

echo [4/5] Installing Frontend dependencies...
cd frontend
call npm install --legacy-peer-deps
cd ..
echo.

echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo To start all services, run: START_ALL_SERVICES.bat
echo.
pause
