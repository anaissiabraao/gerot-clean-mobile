# Railway — PostgreSQL "Connection refused"

Quando o backend sobe no Railway e os logs mostram:

```text
❌ Erro fatal ao criar pool de conexões: connection to server at "postgres.railway.internal" (...), port 5432 failed: Connection refused
Is the server running on that host and accepting TCP/IP connections?
```

significa que o **PostgreSQL não está acessível** pelo backend (host/porta corretos, mas conexão recusada).

---

## 1. Conferir no Railway

1. **PostgreSQL no mesmo projeto**
   - O backend usa o host **`postgres.railway.internal`** quando o PostgreSQL é um serviço do **mesmo projeto** no Railway.
   - No dashboard do projeto, verifique se existe um **serviço PostgreSQL** (plugin ou serviço) e se está **Running** (verde).
   - Se não houver PostgreSQL no projeto, adicione: **New** → **Database** → **PostgreSQL** (ou **Add PostgreSQL** no mesmo projeto do backend).

2. **Variável `DATABASE_URL`**
   - No serviço do **backend**, em **Variables**, deve existir **`DATABASE_URL`**.
   - Se o PostgreSQL foi adicionado pelo Railway no mesmo projeto, essa variável costuma ser criada/atualizada automaticamente (ex.: `postgresql://user:pass@postgres.railway.internal:5432/railway`).
   - Se você estiver usando um banco **fora** desse projeto (outro projeto Railway ou externo), use a URL **pública** desse banco em `DATABASE_URL` (não use `postgres.railway.internal`).

3. **Ordem de deploy**
   - Se o backend e o PostgreSQL sobem juntos, o banco pode levar alguns segundos para aceitar conexões.
   - O app foi ajustado para:
     - **Várias tentativas** ao criar o pool (variável `DB_POOL_INIT_RETRIES`, padrão 5).
     - **Espera** entre tentativas (`DB_POOL_INIT_DELAY_SECONDS`, padrão 2).
     - **Retry** na inicialização do schema (ensure_schema, etc.).
   - Se mesmo assim der "Connection refused", o mais provável é que o PostgreSQL **não esteja rodando** ou **não esteja no mesmo projeto** (ou a URL esteja errada).

4. **Rede privada**
   - `postgres.railway.internal` só funciona entre serviços do **mesmo projeto** na rede privada do Railway.
   - Se o PostgreSQL estiver em **outro projeto**, use a URL pública do banco (em **Connect** no serviço do banco) e defina essa URL em `DATABASE_URL` no backend.

---

## 2. Variáveis opcionais (retry na subida)

No serviço **backend** do Railway, você pode definir (opcional):

| Variável | Valor padrão | Descrição |
|----------|----------------|-----------|
| `DB_POOL_INIT_RETRIES` | `5` | Número de tentativas ao criar o pool ao iniciar o app. |
| `DB_POOL_INIT_DELAY_SECONDS` | `2.0` | Segundos de espera entre cada tentativa. |

Útil quando o PostgreSQL e o backend são deployados juntos e o banco demora um pouco para aceitar conexões.

---

## 3. Resumo

- **Connection refused** = backend não consegue conectar ao host/porta do `DATABASE_URL`.
- Garanta: **PostgreSQL no mesmo projeto e Running** e **`DATABASE_URL`** correta no backend (ou URL pública se o banco for em outro lugar).
- O app tenta várias vezes na subida; se o banco estiver realmente disponível, a tendência é passar. Se continuar falhando, corrigir infra (serviço do banco e URL) no Railway.
