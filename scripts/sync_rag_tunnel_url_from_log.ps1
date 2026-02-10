param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$logPath = Join-Path $ProjectRoot "cloudflared_tunnel.log"
$errLogPath = Join-Path $ProjectRoot "cloudflared_tunnel.err.log"
$outPath = Join-Path $ProjectRoot "rag_tunnel_url.txt"
$seenPath = Join-Path $ProjectRoot "rag_tunnel_url_last_seen.txt"

$contentParts = @()
if (Test-Path $logPath) { $contentParts += (Get-Content $logPath -Raw) }
if (Test-Path $errLogPath) { $contentParts += (Get-Content $errLogPath -Raw) }
if ($contentParts.Count -lt 1) {
  throw "Arquivos nao encontrados: $logPath / $errLogPath"
}
$content = ($contentParts -join "`n")
$matches = [regex]::Matches($content, 'https://[a-z0-9-]+\.trycloudflare\.com')
if ($matches.Count -lt 1) {
  throw "Nenhuma URL trycloudflare encontrada em $logPath / $errLogPath"
}

$url = $matches[$matches.Count - 1].Value.Trim().TrimEnd('/')

# Sempre registra a ultima URL vista (debug)
$url | Set-Content -Path $seenPath -Encoding ASCII -NoNewline

# Atualiza o arquivo principal usado pelos testes e pelo auto-update
$url | Set-Content -Path $outPath -Encoding ASCII -NoNewline

Write-Host $url


