@echo off
REM Start the local mirror server for the Arc CRM clone
REM Open http://127.0.0.1:11746/templates/arc-crm/live in your browser
node "%~dp0server.js"
