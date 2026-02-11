import pg from 'pg'

const { Pool } = pg

export function createPool() {
  const databaseUrl = (process.env.DIRECT_URL || process.env.DATABASE_URL || '').trim()
  if (!databaseUrl) {
    throw new Error('DATABASE_URL não configurada')
  }

  return new Pool({
    connectionString: databaseUrl,
    max: Number.parseInt(process.env.PG_POOL_MAX || '20', 10),
    idleTimeoutMillis: Number.parseInt(process.env.PG_POOL_IDLE_MS || '30000', 10),
    connectionTimeoutMillis: Number.parseInt(process.env.PG_POOL_CONN_TIMEOUT_MS || '10000', 10),
  })
}

export async function withTx(pool, fn) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const out = await fn(client)
    await client.query('COMMIT')
    return out
  } catch (err) {
    try {
      await client.query('ROLLBACK')
    } catch {
    }
    throw err
  } finally {
    client.release()
  }
}
