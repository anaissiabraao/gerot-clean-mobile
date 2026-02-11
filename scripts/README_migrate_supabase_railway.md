# Migração Supabase → Railway (PostgreSQL)

Transfere **schema e dados** do banco no **Supabase** para o **PostgreSQL do Railway**.

## Variáveis no `.env`

- **Origem (Supabase):** `SUPABASE_DATABASE_URL`  
  Ex.: `postgresql://postgres.[ref]:[senha]@aws-0-[região].pooler.supabase.com:5432/postgres`  
  Use a connection string do projeto Supabase (Settings → Database → Connection string, “URI”).

- **Destino (Railway):** `DATABASE_URL` (ou `DIRECT_URL` / `DATABASE_PUBLIC_URL`)  
  No Railway, use a URL do serviço Postgres (Variables → `DATABASE_PUBLIC_URL` para rodar no seu PC).

## Passo a passo

### 1. Schema no Railway

O schema (tabelas) no Railway é criado quando o **backend sobe** (Flask chama `ensure_schema()`).  
Ou use `pg_dump`/`pg_restore` (veja abaixo).

- Garanta que o app já rodou pelo menos uma vez no Railway (deploy) **ou**
- Rode localmente apontando para o Railway: no `.env` deixe só `DATABASE_URL` = URL pública do Railway e inicie o app uma vez para criar as tabelas.

### 2. Rodar a migração de dados

Com as duas URLs no `.env`:

```bash
# Migração limpa: trunca o Railway e copia tudo do Supabase (recomendado)
python scripts/migrate_supabase_to_railway.py --truncate-destination --no-pg-dump

# Só copiar dados (trunca e recopia; schema já existe no Railway)
python scripts/migrate_supabase_to_railway.py --data-only

# Sem truncar (pode dar duplicata; linhas já existentes são ignoradas)
python scripts/migrate_supabase_to_railway.py --no-pg-dump

# Aumentar timeout para tabelas grandes (ex.: 600 segundos)
python scripts/migrate_supabase_to_railway.py --truncate-destination --no-pg-dump --timeout 600
```

**Importante:** Use `--truncate-destination` quando quiser que o Railway fique **igual** ao Supabase (apaga dados atuais no Railway e recopia). Tabelas que não existirem no Railway (ex.: algumas `agent_*`) são puladas.

### 3. Usando pg_dump (recomendado se tiver instalado)

Com **PostgreSQL client** instalado (`pg_dump` e `pg_restore` no PATH):

1. O script tenta primeiro `pg_dump` (origem) + `pg_restore` (destino).
2. Se der certo, schema + dados são migrados de uma vez.
3. Se não tiver `pg_dump` ou der erro, ele usa a cópia em Python (tabela a tabela).

No Windows, instale o [PostgreSQL](https://www.postgresql.org/download/windows/) (inclui `pg_dump`/`pg_restore`).

### 4. Após a migração

- No Railway, use **só** `DATABASE_URL` (a interna ou a pública, conforme o que o serviço back usar).
- Pode remover ou comentar `SUPABASE_DATABASE_URL` do `.env` quando não for mais usar o Supabase.

## Ordem das tabelas

O script copia na ordem de dependência (ex.: `users_new` antes de `user_dashboards`). Tabelas que não existirem no destino são ignoradas.
