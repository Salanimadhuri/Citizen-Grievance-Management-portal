@echo off
echo Starting Grievance Management Portal...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /d \"Grievance Management Portal\backend\" && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend" cmd /k "cd /d \"Grievance Management Portal\frontend\" && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause