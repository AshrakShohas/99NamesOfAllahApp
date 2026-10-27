@echo off
title 99 Names of Allah - Personal Book & Dhikr App
echo Starting 99 Names of Allah App...
cd /d "%~dp0backend"
start "" http://localhost:5000
node server.js
pause
