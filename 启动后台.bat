@echo off
chcp 65001 > nul
title TRAN Trading Lab - 启动服务

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           🚀 TRAN Trading Lab 全服务启动                     ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  前端地址: http://localhost:5173                             ║
echo ║  后台API:  http://localhost:3001                             ║
echo ║  FinBERT:  http://localhost:5000                             ║
echo ║  管理后台: http://localhost:5173/admin                       ║
echo ║  密钥: 147258369.q                                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: 启动 FinBERT Python API（新窗口）
echo 🧠 启动 FinBERT 情绪分析服务...
start "TRAN-FinBERT" cmd /k "cd /d %~dp0server && python sentiment_api.py"

:: 启动后台服务（新窗口）
echo 📦 启动后台代理服务...
start "TRAN-Backend" cmd /k "cd /d %~dp0server && node proxy.js"

:: 启动前端开发服务器（新窗口）
echo 🌐 启动前端服务...
start "TRAN-Frontend" cmd /k "cd /d %~dp0 && npm run dev"

:: 等待8秒让服务启动（FinBERT首次需要更长时间）
echo ⏳ 等待服务启动（首次运行FinBERT约需1-2分钟下载模型）...
timeout /t 8 /nobreak > nul

:: 打开浏览器
echo 🌍 打开浏览器...
start "" "http://localhost:5173/admin"

echo.
echo ✅ 所有服务已启动！
echo.
echo 提示：首次运行FinBERT需要下载模型，请稍等片刻。
echo 可以关闭此窗口，服务会继续在后台运行。
echo.
pause
