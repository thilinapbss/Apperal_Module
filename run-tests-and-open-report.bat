@echo off
echo Running tests...
call npm test

echo.
echo Generating Allure report...
call npx allure generate allure-results --clean -o allure-report

echo.
echo Starting HTTP server and opening report...
start http://localhost:8000
call npx http-server allure-report -p 8000

pause
