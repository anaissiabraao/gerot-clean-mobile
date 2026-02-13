require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const { Pool } = require('pg')

async function main() {
  const url = ((process.env.DIRECT_URL || process.env.DATABASE_URL) || '').trim()
  if (!url) {
    console.error('Faltando DIRECT_URL/DATABASE_URL em agent_api_node/.env')
    process.exit(2)
  }

  const pool = new Pool({ connectionString: url })

  try {
    const now = await pool.query('select now() as now')
    console.log('DB OK:', now.rows[0])

    const cols = await pool.query(
      "select column_name, data_type from information_schema.columns where table_schema='public' and table_name='users_new' order by ordinal_position",
    )
    console.table(cols.rows)
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error('ERRO:', e)
  process.exit(1)
})
