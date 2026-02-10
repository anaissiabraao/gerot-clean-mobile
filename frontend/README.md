# Frontend estático (Railway)

Este diretório contém o frontend separado do backend.  
Ele pode ser publicado como serviço independente no Railway usando o `Root Directory = frontend`.

## Variáveis importantes

- `PORT` (fornecida pelo Railway automaticamente)
- URL da API é configurada na própria UI e salva no `localStorage`

## Deploy no Railway

1. Crie um novo serviço no mesmo projeto Railway.
2. Aponte para o mesmo repositório e defina:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Após deploy, abra o frontend e informe a URL da API backend (`https://<backend>.up.railway.app/api`).
