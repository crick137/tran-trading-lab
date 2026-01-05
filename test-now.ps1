$url = "https://tran-trading-ep4c7daw5-crick137s-projects.vercel.app/api/cron/daily-trading-tip"
$secret = "gwreeeee98234r7guvh23nori88v43999999tnio3o5iii9v"
$headers = @{
    "Authorization" = "Bearer $secret"
    "Content-Type" = "application/json"
}

Write-Host "Testing daily-trading-tip..." -ForegroundColor Yellow

try {
    $startTime = Get-Date
    $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    $duration = ((Get-Date) - $startTime).TotalSeconds
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Duration: $([math]::Round($duration, 2)) seconds"
    Write-Host "Message ID: $($response.messageId)"
    Write-Host "Timestamp: $($response.timestamp)"
    
    if ($response.success) {
        Write-Host ""
        Write-Host "API Call: SUCCESS" -ForegroundColor Green
        Write-Host "Telegram Send: SUCCESS" -ForegroundColor Green
        if ($duration -gt 3) {
            Write-Host "AI Call: NORMAL (response time indicates AI processing)" -ForegroundColor Green
        }
        Write-Host ""
        Write-Host "Please check Telegram channel @http4477 for content quality" -ForegroundColor Cyan
    }
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "1. Deployment still in progress (wait 2-3 minutes)" -ForegroundColor White
    Write-Host "2. Check Vercel Dashboard for deployment status" -ForegroundColor White
    Write-Host "3. Check deployment logs for errors" -ForegroundColor White
}
