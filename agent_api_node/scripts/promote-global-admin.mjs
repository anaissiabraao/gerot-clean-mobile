import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

const email = (process.argv[2] || '').trim().toLowerCase()
if (!email) {
  console.error('Uso: node scripts/promote-global-admin.mjs <email>')
  process.exit(1)
}

const connectionString = (process.env.DIRECT_URL || process.env.DATABASE_URL || '').trim()
if (!connectionString) {
  console.error('DATABASE_URL/DIRECT_URL não configurada')
  process.exit(1)
}

const pool = new Pool({ connectionString })
const permissions = {
  dashboards: true,
  all_dashboards: true,
  manage_permissions: true,
  view_financial: true,
  view_operational: true,
  view_agents: true,
}

try {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const tableRes = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('users_new', 'users')
      ORDER BY CASE WHEN table_name = 'users_new' THEN 0 ELSE 1 END
      LIMIT 1
    `)
    if (!tableRes.rows.length) throw new Error('Nenhuma tabela users/users_new encontrada')
    const tableName = tableRes.rows[0].table_name

    const colRes = await client.query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      `,
      [tableName],
    )
    const cols = new Set(colRes.rows.map((r) => r.column_name))

    if (!cols.has('email') && !cols.has('username')) {
      throw new Error(`Tabela ${tableName} não possui coluna email/username para localizar usuário`)
    }

    if (!cols.has('role')) await client.query(`ALTER TABLE ${tableName} ADD COLUMN role VARCHAR(20) DEFAULT 'user'`)
    if (!cols.has('is_admin')) await client.query(`ALTER TABLE ${tableName} ADD COLUMN is_admin BOOLEAN DEFAULT FALSE`)
    if (!cols.has('permissions')) await client.query(`ALTER TABLE ${tableName} ADD COLUMN permissions JSONB DEFAULT '{}'::jsonb`)

    const updatedColRes = await client.query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      `,
      [tableName],
    )
    const updatedCols = new Set(updatedColRes.rows.map((r) => r.column_name))
    const whereSql = updatedCols.has('email')
      ? `LOWER(COALESCE(email, '')) = LOWER($1)`
      : `LOWER(COALESCE(username, '')) = LOWER($1)`

    const setParts = [
      `role = 'admin'`,
      `is_admin = TRUE`,
      `permissions = $2::jsonb`,
    ]
    if (updatedCols.has('updated_at')) setParts.push('updated_at = NOW()')
    if (updatedCols.has('is_active')) setParts.push('is_active = TRUE')

    const updateSql = `
      UPDATE ${tableName}
      SET ${setParts.join(', ')}
      WHERE ${whereSql}
      RETURNING id, username${updatedCols.has('email') ? ', email' : ''}, role, is_admin, permissions
    `
    const result = await client.query(updateSql, [email, JSON.stringify(permissions)])
    await client.query('COMMIT')
    console.log(JSON.stringify({ success: true, table: tableName, updated: result.rowCount, user: result.rows[0] || null }, null, 2))
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
} catch (err) {
  console.error(err?.message || String(err))
  process.exit(1)
} finally {
  await pool.end()
}
