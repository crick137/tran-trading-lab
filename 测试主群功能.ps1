# 测试主群功能
$baseUrl = "https://tran-trading-ep4c7daw5-crick137s-projects.vercel.app"
$secret = "gwreeeee98234r7guvh23nori88v43999999tnio3o5iii9v"
$headers = @{
    "Authorization" = "Bearer $secret"
    "Content-Type" = "application/json"
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试主群 (@http4477) 功能" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 测试功能列表
$features = @(
    @{ name = "晚间总结"; path = "/api/cron/evening-summary" },
    @{ name = "技术分析"; path = "/api/cron/technical-analysis" },
    @{ name = "经济日历"; path = "/api/cron/economic-calendar" }
)

foreach ($feature in $features) {
    Write-Host "测试: $($feature.name)" -ForegroundColor Yellow
    Write-Host "  URL: $baseUrl$($feature.path)" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$($feature.path)" -Method Get -Headers $headers
        
        if ($response.success) {
            Write-Host "  ✅ 成功!" -ForegroundColor Green
            Write-Host "  消息ID: $($response.messageId)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ 部分成功" -ForegroundColor Yellow
            Write-Host "  响应: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ 失败!" -ForegroundColor Red
        Write-Host "  错误: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "  状态码: $statusCode" -ForegroundColor Red
            
            # 尝试读取错误响应
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $errorBody = $reader.ReadToEnd()
                $errorJson = $errorBody | ConvertFrom-Json
                
                Write-Host "  错误详情:" -ForegroundColor Red
                Write-Host "    - 错误: $($errorJson.error)" -ForegroundColor Red
                if ($errorJson.telegram_error) {
                    Write-Host "    - Telegram错误: $($errorJson.telegram_error)" -ForegroundColor Red
                }
                if ($errorJson.error_code) {
                    Write-Host "    - 错误代码: $($errorJson.error_code)" -ForegroundColor Red
                }
                if ($errorJson.channel) {
                    Write-Host "    - 频道: $($errorJson.channel)" -ForegroundColor Red
                }
                
                # 常见错误提示
                if ($errorJson.error_code -eq 403) {
                    Write-Host ""
                    Write-Host "  💡 解决方案:" -ForegroundColor Cyan
                    Write-Host "    Bot没有权限发送消息到频道" -ForegroundColor White
                    Write-Host "    1. 打开 @http4477 频道" -ForegroundColor White
                    Write-Host "    2. 添加Bot为管理员" -ForegroundColor White
                    Write-Host "    3. 给予'发送消息'权限" -ForegroundColor White
                } elseif ($errorJson.error_code -eq 400) {
                    Write-Host ""
                    Write-Host "  💡 解决方案:" -ForegroundColor Cyan
                    Write-Host "    频道ID可能不正确" -ForegroundColor White
                    Write-Host "    检查 Vercel 环境变量: TELEGRAM_MAIN_CHANNEL_ID" -ForegroundColor White
                }
            } catch {
                Write-Host "  无法解析错误响应" -ForegroundColor Red
            }
        }
    }
    
    Write-Host ""
    Start-Sleep -Seconds 2
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
