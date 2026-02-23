-- Governança BI corporativa: admin global + permissões de gráficos.
-- Compatível com schema que usa users_new (padrão deste projeto).

BEGIN;

ALTER TABLE users_new
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

ALTER TABLE users_new
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

ALTER TABLE users_new
  ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS dashboard_permissions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users_new(id) ON DELETE CASCADE,
  chart_key VARCHAR(100) NOT NULL,
  allowed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, chart_key)
);

CREATE INDEX IF NOT EXISTS idx_dashboard_permissions_user ON dashboard_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_permissions_chart ON dashboard_permissions(chart_key);

UPDATE users_new
SET
  role = 'admin',
  is_admin = TRUE,
  permissions = '{
    "dashboards": true,
    "all_dashboards": true,
    "manage_permissions": true,
    "view_financial": true,
    "view_operational": true,
    "view_agents": true
  }'::jsonb,
  updated_at = NOW()
WHERE LOWER(COALESCE(email, '')) = LOWER('abraao.anaissi@portoex.com.br');

COMMIT;
