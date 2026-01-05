$PROJECT_URL = "tran-trading-ep4c7daw5-crick137s-projects.vercel.app"
$CRON_SECRET = "gwreeeee98234r7guvh23nori88v43999999tnio3o5iii9v"

Write-Host "测试 Telegram 自动发布功能" -ForegroundColor Cyan
Write-Host ""

# 测试1: 新闻发布
Write-Host "测试1: 新闻发布" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://$PROJECT_URL/api/cron/publish-news" -Method Get -Headers @{"Authorization" = "Bearer $CRON_SECRET"; "Content-Type" = "application/json"}
    Write-Host "成功! 已发布 $($response.published) 条新闻" -ForegroundColor Green
    Write-Host "请检查 @TranTradingLabNews 频道" -ForegroundColor Cyan
} catch {
    Write-Host "失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Start-Sleep -Seconds 2

# 测试2: 交易小贴士
Write-Host "测试2: 交易小贴士" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://$PROJECT_URL/api/cron/daily-trading-tip" -Method Get -Headers @{"Authorization" = "Bearer $CRON_SECRET"; "Content-Type" = "application/json"}
    Write-Host "成功! 消息ID: $($response.messageId)" -ForegroundColor Green
    Write-Host "请检查 @http4477 频道" -ForegroundColor Cyan
} catch {
    Write-Host "失败: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "提示: 新功能需要重新部署" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "测试完成" -ForegroundColor Cyan
