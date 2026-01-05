@echo off
REM Windows 快速测试脚本
REM 使用方法: 快速测试.bat your-project.vercel.app your_cron_secret

set PROJECT_URL=%1
set CRON_SECRET=%2

if "%PROJECT_URL%"=="" set PROJECT_URL=your-project.vercel.app
if "%CRON_SECRET%"=="" set CRON_SECRET=your_cron_secret_here

echo 🚀 开始测试 Telegram 功能
echo 📍 项目地址: https://%PROJECT_URL%
echo.

echo 🧪 测试: 每日交易小贴士
curl -X GET "https://%PROJECT_URL%/api/cron/daily-trading-tip" ^
  -H "Authorization: Bearer %CRON_SECRET%" ^
  -H "Content-Type: application/json"
echo.
echo.

timeout /t 2 /nobreak >nul

echo 🧪 测试: 新闻深度解读
curl -X GET "https://%PROJECT_URL%/api/cron/news-analysis" ^
  -H "Authorization: Bearer %CRON_SECRET%" ^
  -H "Content-Type: application/json"
echo.
echo.

timeout /t 2 /nobreak >nul

echo 🧪 测试: 市场情绪卡片
curl -X GET "https://%PROJECT_URL%/api/cron/market-sentiment-card" ^
  -H "Authorization: Bearer %CRON_SECRET%" ^
  -H "Content-Type: application/json"
echo.
echo.

echo ✅ 测试完成！请检查 Telegram 频道 @http4477
pause
