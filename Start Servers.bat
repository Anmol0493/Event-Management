@echo off

rem Run frontend server
start cmd /k "cd /d D:\Anmol\Event Management\client-side && npm run dev"

rem Run backend server
start cmd /k "cd /d D:\Anmol\Event Management\server-side && npm run dev"
