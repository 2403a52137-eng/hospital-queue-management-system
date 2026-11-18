@echo off
title LifeCare Hospital Queue System
cd /d "%~dp0"
echo =======================================================
echo   Starting Hospital Queue & Appointment System...
echo =======================================================
start http://localhost:3000
node server.js
pause
