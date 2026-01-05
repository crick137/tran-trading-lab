# PowerShell 快速测试脚本
# 使用方法: .\快速测试.ps1 your-project.vercel.app

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$CronSecret = "gwreeeee98234r7guvh23nori88v43999999tnio3o5iii9v"
)

Write-Host "开始测试 Telegram 自动发布功能" -ForegroundColor Green
Write-Host "项目地址: https://$ProjectUrl" -ForegroundColor Cyan
Write-Host ("-" * 60)

# 测试交易小贴士
Write-Host ""
Write-Host "测试: 每日交易小贴士" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://$ProjectUrl/api/cron/daily-trading-tip" `
        -Method Get `
        -Headers @{
            "Authorization" = "Bearer $CronSecret"
            "Content-Type" = "application/json"
        }
    
    Write-Host "   成功!" -ForegroundColor Green
    Write-Host "   消息ID: $($response.messageId)" -ForegroundColor Cyan
    Write-Host "   时间戳: $($response.timestamp)" -ForegroundColor Cyan
    
    if ($response.success) {
        Write-Host ""
        Write-Host "Telegram发送: 成功" -ForegroundColor Green
        Write-Host "请检查 @http4477 频道查看消息内容" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   失败: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   状态码: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Start-Sleep -Seconds 2

# 测试新闻解读
Write-Host ""
Write-Host "测试: 新闻深度解读" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://$ProjectUrl/api/cron/news-analysis" `
        -Method Get `
        -Headers @{
            "Authorization" = "Bearer $CronSecret"
            "Content-Type" = "application/json"
        }
    
    Write-Host "   成功!" -ForegroundColor Green
    Write-Host "   消息ID: $($response.messageId)" -ForegroundColor Cyan
    
    if ($response.success) {
        Write-Host ""
        Write-Host "Telegram发送: 成功" -ForegroundColor Green
    }
} catch {
    Write-Host "   失败: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# 测试市场情绪卡片
Write-Host ""
Write-Host "测试: 市场情绪卡片" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://$ProjectUrl/api/cron/market-sentiment-card" `
        -Method Get `
        -Headers @{
            "Authorization" = "Bearer $CronSecret"
            "Content-Type" = "application/json"
        }
    
    Write-Host "   成功!" -ForegroundColor Green
    Write-Host "   消息ID: $($response.messageId)" -ForegroundColor Cyan
    Write-Host "   图片生成: $($response.imageGenerated)" -ForegroundColor Cyan
    
    if ($response.success) {
        Write-Host ""
        Write-Host "Telegram发送: 成功" -ForegroundColor Green
        Write-Host "请检查 @http4477 频道查看消息和图片" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host ("-" * 60)
Write-Host "测试完成!" -ForegroundColor Green
Write-Host "请打开 Telegram，查看 @http4477 频道确认内容质量" -ForegroundColor Yellow
