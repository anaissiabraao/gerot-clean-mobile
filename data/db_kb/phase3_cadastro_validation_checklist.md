# Checklist de validação — Cadastro (azportoex)

Objetivo: validar com evidência (queries read-only) como o banco modela “cliente” vs “fornecedores”.

## Achado estrutural confirmado (evidência)
- O objeto `azportoex.clientes` **não existe** no banco (erro 1146 no MySQL).
- Evidência: `data/db_kb/probes/azportoex.clientes.json`

## Próximas validações (executar no MySQL)

O script SQL está em:
- `data/db_kb/phase3_cadastro_validation_checklist.sql`

O que ele valida:
- existência de objetos (`SHOW FULL TABLES`)
- contagens e faixa temporal em `fornecedores`
- integridade referencial (órfãos) de `cliente_usuario` e `cotacao` apontando para `fornecedores.id_local`
- distribuições de campos como `cliente_tipo`/`tipo_cliente` (INFERÊNCIA A VALIDAR)
- amostras de join `cliente_usuario -> fornecedores`


