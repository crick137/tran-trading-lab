@echo off
chcp 65001 > nul
echo ==========================================
echo  TRAN Trading Lab - Auto News Publisher
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/2] 检查 Telegram Bot Token...
echo Bot Token: 7850025643:AAG...

echo.
echo [2/2] 启动自动新闻发布器...
echo        - 每小时自动发布 3 条新闻
echo        - 支持 10+ 新闻源
echo.

node telegram-publisher.js

pause
