@echo off
title Pulse Social Media Platform
echo ========================================================
echo   Starting Pulse Social Media Platform (Task 2)
echo   Full-Stack: HTML/CSS/JS + Express.js + SQLite DB
echo ========================================================
echo.
echo Launching browser at http://localhost:3000 ...
timeout /t 1 >nul
start http://localhost:3000
echo.
echo Backend server is running. Press Ctrl+C to stop.
node server.js
pause
