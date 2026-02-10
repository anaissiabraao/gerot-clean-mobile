#só copiar essas infos e colar no powershell (cuidado pra n rodar enquanto o executável one_click estiver rodando)

powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync_rag_tunnel_url_from_log.ps1 (copie)
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\update_railway_rag_url.ps1 -Url (Get-Content .\rag_tunnel_url.txt -Raw).Trim() (copie)