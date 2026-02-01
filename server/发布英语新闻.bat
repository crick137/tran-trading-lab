@echo off
chcp 65001 > nul
echo ============================================
echo   English News Publisher - TranTradingLab
echo ============================================
echo.

cd /d "%~dp0"

:: Check for .env file
if not exist ".env" (
    echo [!] Warning: .env file not found
    echo [!] Make sure TELEGRAM_BOT_TOKEN is set
)

:: Load environment variables from .env if exists
if exist ".env" (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        set "%%a=%%b"
    )
)

echo [*] Publishing English market news...
echo.

node publish-english-news.js %1

echo.
echo ============================================
echo   Done!
echo ============================================
pause
