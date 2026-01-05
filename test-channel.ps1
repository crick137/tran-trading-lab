# 测试Telegram频道配置
$BOT_TOKEN = $env:TELEGRAM_BOT_TOKEN
$CHANNEL_ID = "@http4477"

if (-not $BOT_TOKEN) {
    Write-Host "错误: 未设置 TELEGRAM_BOT_TOKEN 环境变量" -ForegroundColor Red
    exit 1
}

Write-Host "测试Telegram频道配置..." -ForegroundColor Yellow
Write-Host "频道ID: $CHANNEL_ID" -ForegroundColor Cyan
Write-Host ""

# 1. 测试Bot信息
Write-Host "1. 检查Bot信息..." -ForegroundColor Yellow
try {
    $botInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/getMe"
    Write-Host "   Bot名称: $($botInfo.result.username)" -ForegroundColor Green
    Write-Host "   Bot ID: $($botInfo.result.id)" -ForegroundColor Green
} catch {
    Write-Host "   错误: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. 测试发送消息到频道
Write-Host "2. 测试发送消息到频道..." -ForegroundColor Yellow
try {
    $body = @{
        chat_id = $CHANNEL_ID
        text = "🧪 测试消息 - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body

    if ($response.ok) {
        Write-Host "   ✅ 消息发送成功!" -ForegroundColor Green
        Write-Host "   消息ID: $($response.result.message_id)" -ForegroundColor Green
        Write-Host "   频道: $($response.result.chat.title)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ 发送失败: $($response.description)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ 错误: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   响应: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "测试完成!" -ForegroundColor Cyan
