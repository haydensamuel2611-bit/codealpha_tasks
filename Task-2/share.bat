@echo off
title Pulse Social Media - Public Share Link
echo ========================================================
echo   Pulse Social Media Platform - Public Online Tunnel
echo ========================================================
echo.
echo Starting backend server...
start /b node server.js
timeout /t 2 >nul
echo.
echo Creating public link with Cloudflare Tunnel...
echo Anyone in the world can open the link shown below:
echo.
cmd /c "npx cloudflared tunnel --url http://localhost:3000"
pause
