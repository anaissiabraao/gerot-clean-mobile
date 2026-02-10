# 🚂 Guia de Deploy no Railway

Este guia detalha o processo completo de deploy do sistema TMS VCI TRANSPORTES no Railway.

## 📋 Pré-requisitos

1. Conta no Railway (https://railway.app)
2. Repositório Git (GitHub, GitLab, etc.)
3. Certificado Digital A1 (PFX) para SEFAZ
4. PostgreSQL (pode ser provisionado no Railway)

## 🔧 Passo a Passo

### 1. Preparar Repositório

Certifique-se de que o código está no Git:

```bash
git add .
git commit -m "Sistema TMS completo com integração SEFAZ"
git push origin main
```

### 2. Criar Projeto no Railway

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo" (ou GitLab)
4. Escolha seu repositório
5. Railway detectará automaticamente o projeto Node.js

### 3. Provisionar PostgreSQL

1. No projeto Railway, clique em "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Railway criará automaticamente um banco PostgreSQL
4. Anote a variável `DATABASE_URL` que será criada automaticamente

### 4. Configurar Variáveis de Ambiente

No painel do Railway, vá em "Variables" e adicione todas as variáveis do `.env.example`:

#### Obrigatórias:

```env
DATABASE_URL=<gerado automaticamente pelo Railway>
JWT_SECRET=<gere uma chave aleatória de 32+ caracteres>
JWT_REFRESH_SECRET=<outra chave aleatória de 32+ caracteres>
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

#### SEFAZ (Homologação):

```env
SEFAZ_CERT_PATH=./certs/certificado.pfx
SEFAZ_CERT_PASSWORD=<senha do certificado>
SEFAZ_AMBIENTE=homologacao
SEFAZ_UF=SP
SEFAZ_CNPJ=<CNPJ da empresa>
SEFAZ_RAZAO_SOCIAL=VCI TRANSPORTES LTDA
SEFAZ_IE=<Inscrição Estadual>

# URLs Homologação (SP)
SEFAZ_CTE_URL_HOMOLOGACAO=https://homologacao.nfe.fazenda.sp.gov.br/cteweb/services/CteRecepcao.asmx
SEFAZ_CTE_URL_CONSULTA_HOMOLOGACAO=https://homologacao.nfe.fazenda.sp.gov.br/cteweb/services/CteConsulta.asmx
SEFAZ_MDFE_URL_HOMOLOGACAO=https://homologacao.mdfe.fazenda.sp.gov.br/MDFeWS/services/MDFeRecepcao.asmx
SEFAZ_MDFE_URL_CONSULTA_HOMOLOGACAO=https://homologacao.mdfe.fazenda.sp.gov.br/MDFeWS/services/MDFeConsulta.asmx
```

#### SMTP (Opcional):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<seu-email@gmail.com>
SMTP_PASS=<senha-app>
SMTP_FROM_NAME=VCI TRANSPORTES
SMTP_FROM_EMAIL=noreply@vcitransportes.com.br
```

#### Boletos:

```env
BOLETO_BANCO=001
BOLETO_CEDENTE_CNPJ=<CNPJ>
BOLETO_CEDENTE_NOME=VCI TRANSPORTES LTDA
BOLETO_CEDENTE_AGENCIA=<agência>
BOLETO_CEDENTE_CONTA=<conta>
BOLETO_CEDENTE_DIGITO=<dígito>
```

### 5. Upload do Certificado Digital

Você tem duas opções:

#### Opção A: Via Railway CLI (Recomendado)

1. Instale Railway CLI:
```bash
npm i -g @railway/cli
```

2. Faça login:
```bash
railway login
```

3. Link o projeto:
```bash
railway link
```

4. Faça upload do certificado:
```bash
railway variables set SEFAZ_CERT_BASE64=$(cat certificado.pfx | base64)
```

Depois, modifique o código para decodificar o certificado da variável de ambiente.

#### Opção B: Via Build (Mais Simples)

1. Crie uma pasta `certs/` no projeto
2. Adicione o certificado (não commite no Git!)
3. Configure `SEFAZ_CERT_PATH=./certs/certificado.pfx`
4. Adicione ao `.railwayignore`:
```
certs/*.pfx
```

### 6. Configurar Build e Deploy

O Railway detectará automaticamente o `package.json` e executará:

1. `npm install`
2. `npm run build` (gera Prisma Client)
3. `npm start` (inicia servidor)

### 7. Executar Migrations

Após o primeiro deploy, execute as migrations:

1. No Railway, vá em "Deployments"
2. Clique no deployment mais recente
3. Abra o terminal
4. Execute:

```bash
npm run migrate:deploy
npm run seed
```

Ou configure um script de deploy automático no `railway.json`.

### 8. Verificar Deploy

1. Acesse a URL fornecida pelo Railway
2. Teste o endpoint de health:
```bash
curl https://seu-projeto.railway.app/health
```

3. Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

## 🔍 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

**Solução**: Adicione `prisma generate` no script de build:

```json
{
  "scripts": {
    "build": "prisma generate",
    "postinstall": "prisma generate"
  }
}
```

### Erro: "Database connection failed"

**Solução**: 
- Verifique se `DATABASE_URL` está configurada
- Verifique se o PostgreSQL está rodando
- Teste a conexão manualmente

### Erro: "Certificate not found"

**Solução**:
- Verifique o caminho do certificado
- Certifique-se de que o arquivo foi enviado
- Use variável de ambiente base64 se necessário

### Erro: "JWT_SECRET not set"

**Solução**: Configure todas as variáveis de ambiente obrigatórias

## 📊 Monitoramento

### Logs

Acesse os logs em tempo real no Railway:
- Vá em "Deployments" → Selecione deployment → "View Logs"

### Métricas

O Railway fornece métricas de:
- CPU
- Memória
- Rede
- Requests

## 🔄 Atualizações

Para atualizar o sistema:

1. Faça push das alterações:
```bash
git push origin main
```

2. O Railway detectará automaticamente e fará novo deploy

3. Se houver novas migrations:
```bash
railway run npm run migrate:deploy
```

## 🔐 Segurança

### Checklist de Segurança

- [ ] `JWT_SECRET` com pelo menos 32 caracteres aleatórios
- [ ] `JWT_REFRESH_SECRET` diferente do `JWT_SECRET`
- [ ] Certificado digital protegido (não commitado)
- [ ] Senhas de banco de dados seguras
- [ ] CORS configurado corretamente
- [ ] HTTPS habilitado (Railway fornece automaticamente)

### Variáveis Sensíveis

Nunca commite no Git:
- Certificados (.pfx, .p12)
- Senhas
- Tokens
- Chaves de API

Use sempre variáveis de ambiente no Railway.

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs no Railway
2. Teste localmente com as mesmas variáveis
3. Consulte a documentação do Railway: https://docs.railway.app

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. Configure domínio customizado (opcional)
2. Configure CI/CD para testes automáticos
3. Configure monitoramento e alertas
4. Faça backup regular do banco de dados
5. Configure staging environment para testes
