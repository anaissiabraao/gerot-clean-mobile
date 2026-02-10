# Sistema TMS VCI TRANSPORTES

Sistema completo de Transport Management System (TMS) para a VCI TRANSPORTES, com integração SEFAZ para emissão de CT-e e MDF-e.

## 🚀 Stack Tecnológica

- **Backend**: Node.js + Express
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT + Bcrypt
- **Integração Fiscal**: SEFAZ (CT-e / MDF-e)
- **Deploy**: Railway

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- Certificado Digital A1 (PFX) para SEFAZ

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <repo-url>
cd GeRot
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
- `DATABASE_URL`: URL de conexão do PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT (mínimo 32 caracteres)
- `SEFAZ_CERT_PATH`: Caminho para o certificado digital (.pfx)
- `SEFAZ_CERT_PASSWORD`: Senha do certificado digital
- Outras configurações conforme necessário

4. **Configure o banco de dados**
```bash
# Gerar cliente Prisma
npm run build

# Executar migrations
npm run migrate

# Popular banco com dados iniciais
npm run seed
```

5. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
src/
├── controllers/      # Controllers das rotas
├── services/        # Lógica de negócio
│   ├── sefaz/      # Integração SEFAZ (CT-e/MDF-e)
│   └── boleto.service.js
├── routes/         # Definição das rotas
├── middlewares/    # Middlewares (auth, validation)
├── utils/          # Utilitários (JWT, bcrypt)
├── prisma/         # Seed e migrations
└── server.js       # Arquivo principal do servidor
```

## 🔐 Autenticação

O sistema utiliza JWT para autenticação. Todas as rotas (exceto `/api/auth`) requerem autenticação.

### Endpoints de Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/refresh` - Renovar token de acesso
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/profile` - Obter perfil do usuário autenticado

### Uso do Token

Inclua o token no header das requisições:
```
Authorization: Bearer <seu-token>
```

## 📊 Endpoints da API

### Clientes
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Obter cliente por ID
- `POST /api/clients` - Criar cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente

### Cotações
- `GET /api/quotes` - Listar cotações
- `GET /api/quotes/:id` - Obter cotação por ID
- `POST /api/quotes` - Criar cotação
- `PUT /api/quotes/:id` - Atualizar cotação
- `DELETE /api/quotes/:id` - Deletar cotação

### Notas Fiscais
- `GET /api/invoices` - Listar notas fiscais
- `GET /api/invoices/:id` - Obter nota fiscal por ID
- `POST /api/invoices` - Criar nota fiscal
- `PUT /api/invoices/:id` - Atualizar nota fiscal
- `DELETE /api/invoices/:id` - Deletar nota fiscal

### CT-e (Conhecimento de Transporte Eletrônico)
- `POST /api/cte/emitir` - Emitir CT-e
- `GET /api/cte/status/:chave` - Consultar status do CT-e
- `GET /api/cte` - Listar CT-es
- `GET /api/cte/:id` - Obter CT-e por ID

### MDF-e (Manifesto de Documentos Fiscais Eletrônicos)
- `POST /api/mdfe/emitir` - Emitir MDF-e
- `POST /api/mdfe/encerrar/:id` - Encerrar MDF-e
- `GET /api/mdfe/status/:chave` - Consultar status do MDF-e
- `GET /api/mdfe` - Listar MDF-es
- `GET /api/mdfe/:id` - Obter MDF-e por ID

### Boletos
- `GET /api/boletos` - Listar boletos
- `GET /api/boletos/:id` - Obter boleto por ID
- `POST /api/boletos` - Gerar boleto manualmente
- `PUT /api/boletos/:id/status` - Atualizar status do boleto

## 🔒 Integração SEFAZ

### Configuração

1. **Certificado Digital A1 (PFX)**
   - Coloque o arquivo `.pfx` na pasta `certs/`
   - Configure `SEFAZ_CERT_PATH` e `SEFAZ_CERT_PASSWORD` no `.env`

2. **Ambiente**
   - Homologação: `SEFAZ_AMBIENTE=homologacao` (padrão)
   - Produção: `SEFAZ_AMBIENTE=producao`

3. **Dados da Empresa**
   - Configure `SEFAZ_CNPJ`, `SEFAZ_RAZAO_SOCIAL`, `SEFAZ_IE`, `SEFAZ_UF`

### Fluxo de Emissão CT-e

1. Criar cotação ou nota fiscal
2. Emitir CT-e via `POST /api/cte/emitir`
3. Sistema gera XML, assina e envia para SEFAZ
4. Após autorização, boleto é gerado automaticamente
5. Consultar status via `GET /api/cte/status/:chave`

### Fluxo de Emissão MDF-e

1. Ter CT-es autorizados
2. Emitir MDF-e via `POST /api/mdfe/emitir` informando os IDs dos CT-es
3. Sistema gera XML, assina e envia para SEFAZ
4. Encerrar MDF-e via `POST /api/mdfe/encerrar/:id`

## 📧 Envio de Boletos por Email

Configure as variáveis SMTP no `.env`:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_NAME`
- `SMTP_FROM_EMAIL`

Os boletos são enviados automaticamente após a autorização do CT-e, se o cliente tiver `emailFaturamento` cadastrado.

## 🚂 Deploy no Railway

### 1. Preparação

O projeto já está configurado para Railway. Certifique-se de:

- Ter todas as variáveis de ambiente configuradas no Railway
- Ter o PostgreSQL provisionado no Railway
- Ter o certificado digital disponível (via variável de ambiente ou upload)

### 2. Deploy

1. Conecte seu repositório ao Railway
2. Configure as variáveis de ambiente no painel do Railway
3. O Railway executará automaticamente:
   - `npm install`
   - `npm run build` (gera Prisma Client)
   - `npm run migrate:deploy` (executa migrations)
   - `npm start` (inicia servidor)

### 3. Variáveis de Ambiente no Railway

Configure todas as variáveis do `.env.example` no painel do Railway.

**Importante**: Para o certificado digital, você pode:
- Fazer upload via Railway CLI
- Usar variável de ambiente base64 (converter o arquivo .pfx para base64)

## 🧪 Testes

### Usuários Padrão (após seed)

- **Admin**: `admin@vcitransportes.com.br` / `admin123`
- **Operacional**: `operacional@vcitransportes.com.br` / `oper123`

### Exemplo de Requisição

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vcitransportes.com.br","password":"admin123"}'

# Criar cliente (usar token do login)
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "cnpj": "98765432000111",
    "razaoSocial": "NOVO CLIENTE LTDA",
    "emailFaturamento": "fatura@novocliente.com.br"
  }'
```

## 📝 Modelo de Dados

### Usuários
- `ADMIN`: Acesso total ao sistema
- `OPERACIONAL`: Acesso operacional (cotações, CT-es, etc.)
- `FINANCEIRO`: Acesso financeiro (boletos, faturas)

### Status CT-e
- `PENDENTE`: Criado mas não enviado
- `PROCESSANDO`: Enviado para SEFAZ, aguardando resposta
- `AUTORIZADO`: Autorizado pela SEFAZ
- `REJEITADO`: Rejeitado pela SEFAZ
- `CANCELADO`: Cancelado
- `DENEGADO`: Denegado pela SEFAZ

### Status MDF-e
- Similar ao CT-e, com adicional:
- `ENCERRADO`: MDF-e encerrado

## 🛠️ Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento (watch)
- `npm start` - Inicia servidor em produção
- `npm run build` - Gera Prisma Client
- `npm run migrate` - Executa migrations (desenvolvimento)
- `npm run migrate:deploy` - Executa migrations (produção)
- `npm run seed` - Popula banco com dados iniciais
- `npm run prisma:studio` - Abre Prisma Studio (interface visual do banco)

### Estrutura de Código

- **Controllers**: Recebem requisições e retornam respostas
- **Services**: Contêm lógica de negócio e integrações externas
- **Routes**: Definem endpoints e middlewares
- **Middlewares**: Autenticação, validação, etc.
- **Utils**: Funções utilitárias reutilizáveis

## ⚠️ Importante

1. **Certificado Digital**: Em produção, use certificado válido e configure corretamente
2. **Ambiente SEFAZ**: Sempre teste em homologação antes de produção
3. **Segurança**: Mantenha `JWT_SECRET` seguro e nunca commite no git
4. **Backup**: Configure backups regulares do PostgreSQL
5. **Logs**: Monitore logs para identificar problemas na integração SEFAZ

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da SEFAZ ou entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto é proprietário da VCI TRANSPORTES.
