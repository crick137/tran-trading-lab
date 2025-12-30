$port = 3001
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Killing process $process on port $port..."
    Stop-Process -Id $process -Force
} else {
    Write-Host "No process found on port $port."
}

Write-Host "Starting server..."
Start-Process -FilePath "node" -ArgumentList "server/proxy.js" -NoNewWindow
Write-Host "Server started."
