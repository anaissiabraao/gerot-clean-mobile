-- Reseta a senha do usuário anaissiabraao para: Teste@123
-- Execute este SQL no Railway: Postgres → aba "Query" ou "Data" → New Query

UPDATE users_new
SET
  password = decode('24326224313224793469462e2e686854717141756658396a647168514f4b59433358346a414151332e7635512e6a674c63596a594570655a6e4a446d', 'hex'),
  updated_at = NOW(),
  first_login = FALSE,
  is_active = TRUE
WHERE LOWER(username) = 'anaissiabraao'
   OR LOWER(COALESCE(email, '')) = 'anaissiabraao@portoex.com.br'
   OR LOWER(COALESCE(nome_usuario, '')) = 'anaissiabraao';

-- Confira se atualizou (deve retornar 1 linha):
-- SELECT id, username, email, is_active, first_login FROM users_new WHERE LOWER(username) = 'anaissiabraao';
