param(
  [string]$BaseUrl = "http://127.0.0.1:8000",
  [string]$ApiKey = "gerot123",
  [string]$Question = "qual a capital da alemanha?"
)

$ErrorActionPreference = "Stop"

Write-Host "BaseUrl: $BaseUrl"

Write-Host "`n== /health =="
try {
  Invoke-RestMethod -Method Get -Uri ($BaseUrl.TrimEnd("/") + "/health") -TimeoutSec 5 | ConvertTo-Json -Depth 6
} catch {
  Write-Host ("ERR health: " + $_.Exception.Message)
}

Write-Host "`n== /v1/qa =="
try {
  $body = @{ question = $Question; top_k = 2 } | ConvertTo-Json -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
  Invoke-RestMethod -Method Post -Uri ($BaseUrl.TrimEnd("/") + "/v1/qa") -Headers @{ "x-api-key" = $ApiKey } -ContentType "application/json" -Body $bytes -TimeoutSec 120 | ConvertTo-Json -Depth 10
} catch {
  Write-Host ("ERR qa: " + $_.Exception.Message)
}

Write-Host "`n== /debug/ollama/last?limit=5 =="
try {
  Invoke-RestMethod -Method Get -Uri ($BaseUrl.TrimEnd("/") + "/debug/ollama/last?limit=5") -TimeoutSec 10 | ConvertTo-Json -Depth 10
} catch {
  Write-Host ("ERR debug: " + $_.Exception.Message)
}


