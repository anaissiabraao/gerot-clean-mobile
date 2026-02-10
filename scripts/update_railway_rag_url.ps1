param(
  [Parameter(Mandatory = $true)]
  [string]$Url,
  # Opcional: permite rodar sem depender de env vars
  [string]$ProjectId,
  [string]$ServiceName,
  [string]$EnvironmentName
)

$ErrorActionPreference = "Stop"

# Evitar caracteres quebrados quando chamado por .bat (cmd + chcp 65001)
$utf8 = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = $utf8
$OutputEncoding = $utf8

function Load-DotEnvIfPresent([string]$envPath) {
  if (-not (Test-Path $envPath)) { return }
  try {
    $lines = Get-Content -Path $envPath -ErrorAction Stop
  } catch {
    return
  }
  foreach ($line in $lines) {
    # Compatível com Windows PowerShell 5.1 (sem ??)
    $l = ""
    if ($null -ne $line) { $l = [string]$line }
    $l = $l.Trim()
    if ([string]::IsNullOrWhiteSpace($l)) { continue }
    if ($l.StartsWith("#")) { continue }
    $idx = $l.IndexOf("=")
    if ($idx -lt 1) { continue }
    $k = $l.Substring(0, $idx).Trim()
    $v = $l.Substring($idx + 1).Trim()
    if (-not $k) { continue }
    # não sobrescrever se já existir no ambiente
    $existing = [Environment]::GetEnvironmentVariable($k)
    if ($existing) { continue }
    # remover aspas externas
    if ($v.Length -ge 2) {
      $first = $v.Substring(0, 1)
      $last = $v.Substring($v.Length - 1, 1)
      if (($first -eq '"' -and $last -eq '"') -or ($first -eq "'" -and $last -eq "'")) {
        $v = $v.Substring(1, $v.Length - 2)
      }
    }
    # set env var dinamicamente (PS 5.1 friendly)
    Set-Item -Path ("Env:" + $k) -Value $v
  }
}

function Fail($msg) {
  Write-Host "[auto] Railway: $msg" -ForegroundColor Red
  exit 1
}

function Info($msg) {
  Write-Host "[auto] Railway: $msg" -ForegroundColor Cyan
}

$urlTrim = $Url.Trim().TrimEnd("/")
if (-not $urlTrim.StartsWith("http")) {
  Fail "URL inválida: $Url"
}

# Se o usuário rodar este script direto no PowerShell, o .env não é carregado automaticamente.
# Então tentamos carregar ".env" da raiz do projeto (best-effort).
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Load-DotEnvIfPresent (Join-Path $projectRoot ".env")

# IMPORTANTE:
# O Railway CLI pode interpretar `RAILWAY_TOKEN` como "project token" e isso pode
# SOBRESCREVER a sessão de login, causando "Unauthorized / Project Token not found".
# Como nosso fluxo usa login persistido do CLI, removemos tokens do ambiente antes
# de chamar o Railway CLI.
$env:RAILWAY_TOKEN = $null
$env:RAILWAY_API_TOKEN = $null

$projectId = if ($ProjectId) { $ProjectId } else { $env:RAILWAY_DASHBOARD_PROJECT_ID }
$serviceName = if ($ServiceName) { $ServiceName } else { $env:RAILWAY_DASHBOARD_SERVICE_NAME }
$envName = if ($EnvironmentName) { $EnvironmentName } else { $env:RAILWAY_DASHBOARD_ENVIRONMENT_NAME }
$autoUpdate = $env:RAILWAY_AUTO_UPDATE

if ($autoUpdate -and $autoUpdate.Trim().ToLower() -eq "false") {
  Info "auto-update desativado (RAILWAY_AUTO_UPDATE=false)."
  exit 0
}

if (-not $projectId) {
  Fail "RAILWAY_DASHBOARD_PROJECT_ID não definido (ou passe -ProjectId). Ex.: -ProjectId 7120...."
}
if (-not $serviceName) { $serviceName = "gerot-dashboard" }
if (-not $envName) { $envName = "production" }

#
# IMPORTANTE:
# No Windows, `Get-Command npx` pode resolver para `npx.ps1` (shim) e isso às vezes dá problema
# de execução/credenciais em shells diferentes. Preferimos `npx.cmd` diretamente quando existir.
#
$preferred = Join-Path $env:ProgramFiles "nodejs\\npx.cmd"
if (Test-Path $preferred) {
  $npxCmd = $preferred
} else {
  try {
    $npxCmd = (Get-Command npx -ErrorAction Stop).Source
  } catch {
    Fail "npx não encontrado. Instale Node.js LTS para habilitar auto-update."
  }
}
Info "usando npx: $npxCmd"

# Em algumas instalações, `node` não está no PATH (mas npx.cmd existe).
# O npx, ao executar pacotes, pode precisar chamar `node` por nome.
# Garantimos que a pasta do Node esteja no PATH deste processo.
try {
  $nodeDir = Split-Path $npxCmd -Parent
  if ($nodeDir -and ($env:Path -notlike "*$nodeDir*")) {
    $env:Path = "$nodeDir;$env:Path"
  }
} catch {
  # best-effort (não é fatal)
}

Info "checando autenticação do Railway CLI..."
& $npxCmd -y @railway/cli whoami --json | Out-Null
if ($LASTEXITCODE -ne 0) {
  Fail "não autenticado. Rode uma vez: `"$npxCmd`" -y @railway/cli login (vai abrir o navegador)"
}

Info "vinculando projeto (project=$projectId env=$envName service=$serviceName)..."
& $npxCmd -y @railway/cli link --project $projectId --environment $envName --service $serviceName | Out-Null
if ($LASTEXITCODE -ne 0) {
  Fail "falha ao vincular projeto/serviço. Confirme PROJECT_ID/SERVICE_NAME/ENVIRONMENT_NAME e tente novamente."
}

Info "setando RAG_API_URL=$urlTrim"
& $npxCmd -y @railway/cli variables --service $serviceName --environment $envName --set ("RAG_API_URL=$urlTrim") --skip-deploys
if ($LASTEXITCODE -ne 0) {
  Fail "falha ao setar variável RAG_API_URL. Verifique permissões/ids e tente novamente."
}

Info "disparando redeploy do $serviceName..."
& $npxCmd -y @railway/cli redeploy --service $serviceName --yes
if ($LASTEXITCODE -ne 0) {
  Fail "falha ao redeployar. Você pode redeployar manualmente no painel."
}

Info "OK! RAG_API_URL atualizado e redeploy disparado."
exit 0