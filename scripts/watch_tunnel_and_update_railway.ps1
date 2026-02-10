param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [int]$IntervalSec = 15,
  [string]$LogPath,
  [string]$PidFile
)

$ErrorActionPreference = "Stop"

function _ts { (Get-Date).ToString("s") }
function Info($msg) {
  $line = ("[{0}] [watch] {1}" -f (_ts), $msg)
  Write-Host $line
  try { Add-Content -Path $script:Log -Value $line } catch {}
}
function Warn($msg) {
  $line = ("[{0}] [watch][WARN] {1}" -f (_ts), $msg)
  Write-Host $line
  try { Add-Content -Path $script:Log -Value $line } catch {}
}
function Err($msg) {
  $line = ("[{0}] [watch][ERR] {1}" -f (_ts), $msg)
  Write-Host $line
  try { Add-Content -Path $script:Log -Value $line } catch {}
}

$IntervalSec = [Math]::Max(5, $IntervalSec)

$syncScript = Join-Path $ProjectRoot "scripts\\sync_rag_tunnel_url_from_log.ps1"
$updateScript = Join-Path $ProjectRoot "scripts\\update_railway_rag_url.ps1"
$urlFile = Join-Path $ProjectRoot "rag_tunnel_url.txt"
$script:Log = if ($LogPath) { $LogPath } else { (Join-Path $ProjectRoot "tunnel_watch.log") }
if ($PidFile) {
  try {
    $pid | Set-Content -Path $PidFile -Encoding ASCII -NoNewline
  } catch {}
}

Info ("ProjectRoot=" + $ProjectRoot)
Info ("IntervalSec=" + $IntervalSec)
Info ("Log=" + $script:Log)

$lastUrl = ""
if (Test-Path $urlFile) {
  try { $lastUrl = (Get-Content $urlFile -Raw).Trim().TrimEnd("/") } catch {}
}
Info ("InitialUrl=" + $lastUrl)

while ($true) {
  try {
    # Atualiza rag_tunnel_url.txt (lê stdout+stderr do cloudflared)
    $newUrl = & powershell -NoProfile -ExecutionPolicy Bypass -File $syncScript 2>$null
    if ($newUrl) { $newUrl = ($newUrl | Select-Object -Last 1).Trim().TrimEnd("/") }

    if ($newUrl -and ($newUrl -ne $lastUrl)) {
      Info ("URL mudou: " + $lastUrl + " -> " + $newUrl)

      # Valida /health antes de atualizar Railway
      $ok = $false
      try {
        $r = Invoke-RestMethod -Method Get -Uri ($newUrl + "/health") -TimeoutSec 15
        if ($r -and $r.status -eq "ok") { $ok = $true }
      } catch {}

      if ($ok) {
        Info ("/health OK. Atualizando Railway RAG_API_URL=" + $newUrl)
        & powershell -NoProfile -ExecutionPolicy Bypass -File $updateScript -Url $newUrl | Out-Null
        $exit = $LASTEXITCODE
        if ($exit -eq 0) {
          Info ("Railway update OK.")
          $lastUrl = $newUrl
        } else {
          Err ("Railway update falhou (exit=$exit). Vou tentar novamente no próximo ciclo.")
        }
      } else {
        Warn ("/health ainda não respondeu. Não vou atualizar Railway agora: " + $newUrl)
      }
    }
  } catch {
    Err ($_.Exception.Message)
  }

  Start-Sleep -Seconds $IntervalSec
}


