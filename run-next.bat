@echo off
cd /d "%~dp0"
set npm_config_cache=%CD%\.npm-cache
title StudyCycle Demo Server

echo Starting StudyCycle demo...
echo.
echo Keep this window open while using the demo site.
echo Open this URL in your browser:
echo http://localhost:3000
echo.
echo Press Ctrl + C to stop the server.
echo.

"C:\Program Files\nodejs\npm.cmd" run dev:3000
pause
