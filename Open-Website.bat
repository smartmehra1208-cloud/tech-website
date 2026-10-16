@echo off
title KioraTech Web Platform Launcher
echo ========================================================
echo         KIORATECH - WE BUILD, YOU RULE
echo ========================================================
echo.
echo Checking server status...

netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo [OK] Server is already running on port 5000!
) else (
    echo [STARTING] Starting Node.js backend server...
    start /min "KioraTech Server" node server.js
    timeout /t 2 /nobreak >nul
)

echo Opening KioraTech website in your browser...
start http://localhost:5000
echo.
echo Website opened at http://localhost:5000
echo Admin Panel: http://localhost:5000/admin (Password: admin123)
echo.
timeout /t 3 >nul
exit
