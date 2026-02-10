-- Checklist de validação (READ-ONLY) — Cadastro (azportoex)
-- Objetivo: validar (com evidência) a modelagem "cliente" vs "fornecedores" e principais vínculos.
-- Observação: ajuste LIMITs conforme necessidade. Evite SELECT * sem limite em tabelas grandes.

-- 0) Confirmar existência de objetos relevantes
SHOW FULL TABLES LIKE 'fornecedores';
SHOW FULL TABLES LIKE 'cliente_usuario';
SHOW FULL TABLES LIKE 'cliente_trecho';
SHOW FULL TABLES LIKE 'cotacao';
SHOW FULL TABLES LIKE 'clientes';

-- 1) Fornecedores: volume e datas (sanidade)
SELECT COUNT(*) AS fornecedores_count FROM azportoex.fornecedores;
SELECT MIN(data_incluido) AS min_data_incluido, MAX(data_incluido) AS max_data_incluido FROM azportoex.fornecedores;

-- 2) Cliente_usuario: integridade referencial (deve ser 0 se FK estiver ativa)
SELECT COUNT(*) AS orfaos_cliente_usuario
FROM azportoex.cliente_usuario cu
LEFT JOIN azportoex.fornecedores f ON f.id_local = cu.id_cliente
WHERE f.id_local IS NULL;

-- 3) Cotacao.id_cliente: integridade referencial (deve ser 0 se FK estiver ativa)
SELECT COUNT(*) AS orfaos_cotacao
FROM azportoex.cotacao c
LEFT JOIN azportoex.fornecedores f ON f.id_local = c.id_cliente
WHERE f.id_local IS NULL;

-- 4) Amostra: "cliente" na prática (id_local + razao/fantasia)
SELECT
  f.id_local,
  f.razao,
  f.fantasia,
  f.cnpj,
  f.status,
  f.data_incluido
FROM azportoex.fornecedores f
ORDER BY f.id_local DESC
LIMIT 20;

-- 5) Distribuições de campos que sugerem tipo de cadastro (INFERÊNCIA A VALIDAR)
SELECT f.cliente_tipo, COUNT(*) AS qtd
FROM azportoex.fornecedores f
GROUP BY f.cliente_tipo
ORDER BY qtd DESC;

SELECT f.tipo_cliente, COUNT(*) AS qtd
FROM azportoex.fornecedores f
GROUP BY f.tipo_cliente
ORDER BY qtd DESC;

-- 6) Amostra de relacionamento: cliente_usuario -> fornecedores
SELECT
  cu.id_usuario,
  cu.id_cliente,
  f.razao,
  f.fantasia,
  cu.data,
  cu.validade
FROM azportoex.cliente_usuario cu
JOIN azportoex.fornecedores f ON f.id_local = cu.id_cliente
ORDER BY cu.id_usuario DESC
LIMIT 50;


