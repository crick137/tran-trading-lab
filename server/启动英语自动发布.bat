@echo off
chcp 65001 > nul
echo ============================================
echo   English Auto News Publisher
echo   Channel: @TranTradingLabEN
echo ============================================
echo.

cd /d "%~dp0"

:: Load environment variables from .env
if exist ".env" (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        set "%%a=%%b"
    )
    echo [✓] Loaded .env
) else (
    echo [!] Warning: .env file not found
)

echo.
echo [*] Starting auto publisher...
echo [*] Publishing 5 news every hour at :30
echo [*] Press Ctrl+C to stop
echo.

node telegram-publisher-en.js
