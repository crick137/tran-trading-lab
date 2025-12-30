@echo off
chcp 65001 > nul
title TRAN Trading Lab - 后台服务

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           🚀 TRAN Trading Lab 后台服务启动                   ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  服务地址: http://localhost:3001                             ║
echo ║  管理后台: http://localhost:5173/admin                       ║
echo ║  密钥: 147258369.q                                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0server"

echo 📦 正在启动 Node.js Proxy 服务...
echo.

node proxy.js

pause
