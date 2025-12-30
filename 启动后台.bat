@echo off
chcp 65001 > nul
title TRAN Trading Lab - 启动服务

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           🚀 TRAN Trading Lab 服务启动中...                  ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  前端地址: http://localhost:5173                             ║
echo ║  后台API:  http://localhost:3001                             ║
echo ║  管理后台: http://localhost:5173/admin                       ║
echo ║  密钥: 147258369.q                                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: 启动后台服务（新窗口）
echo 📦 启动后台服务...
start "TRAN-Backend" cmd /k "cd /d %~dp0server && node proxy.js"

:: 启动前端开发服务器（新窗口）
echo 🌐 启动前端服务...
start "TRAN-Frontend" cmd /k "cd /d %~dp0 && npm run dev"

:: 等待5秒让服务启动
echo ⏳ 等待服务启动...
timeout /t 5 /nobreak > nul

:: 打开浏览器
echo 🌍 打开浏览器...
start "" "http://localhost:5173/admin"

echo.
echo ✅ 所有服务已启动！可以关闭此窗口。
echo.
pause
