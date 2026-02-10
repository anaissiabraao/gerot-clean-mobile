#!/usr/bin/env python3
"""
Teste da query minutas_por_agente para validar se os dados estão disponíveis.
Verifica: chaves de agentes, match por_agente vs minutas_por_agente, schema da tabela minuta.
Execute: python scripts/test_minutas_por_agente.py [--database azportoex|portoexsp] [--inicio YYYY-MM-DD] [--fim YYYY-MM-DD]
"""
import os
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Carregar .env
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "agent_local", ".env")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def get_mysql_connection(database_name=None):
    import pymysql
    if database_name == "portoexsp":
        config = {
            "host": os.getenv("MYSQL_SP_HOST", os.getenv("MYSQL_AZ_HOST", "portoex.db.brudam.com.br")),
            "port": int(os.getenv("MYSQL_SP_PORT", os.getenv("MYSQL_AZ_PORT", "3306"))),
            "user": os.getenv("MYSQL_SP_USER", os.getenv("MYSQL_AZ_USER", "consulta_portoex")),
            "password": os.getenv("MYSQL_SP_PASSWORD", os.getenv("MYSQL_AZ_PASSWORD", "")),
            "database": os.getenv("MYSQL_SP_DB", "portoexsp"),
            "charset": "utf8mb4",
        }
    else:
        config = {
            "host": os.getenv("MYSQL_AZ_HOST", "portoex.db.brudam.com.br"),
            "port": int(os.getenv("MYSQL_AZ_PORT", "3306")),
            "user": os.getenv("MYSQL_AZ_USER", "consulta_portoex"),
            "password": os.getenv("MYSQL_AZ_PASSWORD", ""),
            "database": os.getenv("MYSQL_AZ_DB", "azportoex"),
            "charset": "utf8mb4",
        }
    return pymysql.connect(**config, cursorclass=pymysql.cursors.DictCursor)


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--database", default="portoexsp", help="azportoex ou portoexsp")
    parser.add_argument("--inicio", default="", help="Data início YYYY-MM-DD")
    parser.add_argument("--fim", default="", help="Data fim YYYY-MM-DD")
    args = parser.parse_args()

    hoje = date.today()
    data_inicio = args.inicio or f"{hoje.year}-{hoje.month:02d}-01"
    data_fim = args.fim or hoje.strftime("%Y-%m-%d")
    di = data_inicio.replace("-", "")
    df = data_fim.replace("-", "")

    print("=" * 70)
    print("Teste: Minutas por Agente (Relatório Entregas)")
    print("=" * 70)
    print(f"Database: {args.database}")
    print(f"Período: {data_inicio} a {data_fim}")
    print()

    try:
        conn = get_mysql_connection(args.database)
        cur = conn.cursor()

        # 1. Verificar colunas da tabela minuta
        print("[1] Colunas da tabela minuta:")
        cur.execute("SHOW COLUMNS FROM minuta")
        cols = [r["Field"] for r in cur.fetchall()]
        has_id = "id" in cols
        has_id_minuta = "id_minuta" in cols
        has_numero = "numero" in cols
        has_cte_numero = "cte_numero" in cols
        has_coleta_numero = "coleta_numero" in cols
        print(f"    id: {has_id}, id_minuta: {has_id_minuta}, numero: {has_numero}")
        print(f"    cte_numero: {has_cte_numero}, coleta_numero: {has_coleta_numero}")
        print()

        # 2. Query por_agente (agentes que aparecem na tabela)
        q_agente = """
            SELECT agente, COUNT(*) AS qtd
            FROM (
                SELECT SUBSTR(CASE WHEN m.entrega_resp = 1 THEN UPPER(fu.nome) WHEN m.entrega_resp = 2 THEN fe.fantasia WHEN m.entrega_resp = 3 THEN UPPER(te.nome) ELSE '' END, 1, 40) AS agente
                FROM minuta m
                LEFT JOIN funcionario fu ON fu.id_funcionario = m.entrega_resp_id AND m.entrega_resp = 1
                LEFT JOIN fornecedores fe ON fe.id_local = m.entrega_resp_id AND m.entrega_resp = 2
                LEFT JOIN terceiros te ON te.id_terceiro = m.entrega_resp_id AND m.entrega_resp = 3
                WHERE m.data >= %s AND m.data <= %s
            ) sub
            WHERE sub.agente IS NOT NULL AND sub.agente <> ''
            GROUP BY agente
            ORDER BY qtd DESC
        """
        cur.execute(q_agente, (di, df))
        por_agente_rows = cur.fetchall()
        agentes_na_tabela = [r["agente"] for r in por_agente_rows]
        print("[2] Agentes em por_agente (top 15):")
        for r in por_agente_rows[:15]:
            print(f"    '{r['agente']}' -> {r['qtd']} entregas")
        print()

        # 3. Query minutas (usar id_minuta - ambos os bancos têm, não usam numero)
        q_minutas = """
            SELECT
                SUBSTR(CASE WHEN m.entrega_resp = 1 THEN UPPER(fu.nome) WHEN m.entrega_resp = 2 THEN fe.fantasia WHEN m.entrega_resp = 3 THEN UPPER(te.nome) ELSE '' END, 1, 40) AS agente,
                m.id_minuta AS id_minuta,
                m.id_minuta AS numero_minuta,
                SUBSTR(c.fantasia, 1, 40) AS cliente,
                CASE WHEN m.cte_numero > 0 THEN CONCAT(m.cte_numero, '-', COALESCE(m.cte_serie, '')) ELSE '' END AS cte,
                CASE WHEN m.coleta_numero > 0 THEN CAST(m.coleta_numero AS CHAR) ELSE '' END AS ordem_coleta
            FROM minuta m
            LEFT JOIN funcionario fu ON fu.id_funcionario = m.entrega_resp_id AND m.entrega_resp = 1
            LEFT JOIN fornecedores fe ON fe.id_local = m.entrega_resp_id AND m.entrega_resp = 2
            LEFT JOIN terceiros te ON te.id_terceiro = m.entrega_resp_id AND m.entrega_resp = 3
            LEFT JOIN fornecedores c ON c.id_local = m.id_cliente
            WHERE m.data >= %s AND m.data <= %s
              AND (CASE WHEN m.entrega_resp = 1 THEN UPPER(fu.nome) WHEN m.entrega_resp = 2 THEN fe.fantasia WHEN m.entrega_resp = 3 THEN UPPER(te.nome) ELSE '' END) IS NOT NULL
              AND (CASE WHEN m.entrega_resp = 1 THEN UPPER(fu.nome) WHEN m.entrega_resp = 2 THEN fe.fantasia WHEN m.entrega_resp = 3 THEN UPPER(te.nome) ELSE '' END) <> ''
        """
        cur.execute(q_minutas, (di, df))
        rows_min = cur.fetchall()

        minutas_por_agente = {}
        for r in rows_min:
            ag = str(r.get("agente") or "").strip() or "N/D"
            if ag not in minutas_por_agente:
                minutas_por_agente[ag] = []
            minutas_por_agente[ag].append(r)

        print("[3] Chaves em minutas_por_agente:")
        for k in sorted(minutas_por_agente.keys())[:20]:
            print(f"    '{k}' -> {len(minutas_por_agente[k])} minutas")
        print(f"    ... total {len(minutas_por_agente)} agentes, {sum(len(v) for v in minutas_por_agente.values())} minutas")
        print()

        # 4. Match: agentes em por_agente que NÃO estão em minutas_por_agente
        print("[4] Match agente -> minutas:")
        for ag in agentes_na_tabela[:10]:
            exact = minutas_por_agente.get(ag, [])
            # Busca case-insensitive
            found_ci = None
            for k, v in minutas_por_agente.items():
                if k.strip().upper() == ag.strip().upper():
                    found_ci = v
                    break
            status = f"OK ({len(exact)} minutas)" if exact else (f"OK via CI ({len(found_ci)} minutas)" if found_ci else "FALTA!")
            print(f"    '{ag}' -> {status}")
        print()

        # 5. Amostra de minuta para PORTOEX SP
        portoex_key = None
        for k in minutas_por_agente:
            if "PORTOEX" in k.upper() and "SP" in k.upper():
                portoex_key = k
                break
        if portoex_key:
            sample = minutas_por_agente[portoex_key][:3]
            print(f"[5] Amostra minutas para '{portoex_key}':")
            for m in sample:
                print(f"    id={m.get('id_minuta')} numero={m.get('numero_minuta')} cliente={m.get('cliente')} cte={m.get('cte')} ordem_coleta={m.get('ordem_coleta')}")
        else:
            print("[5] Nenhum agente com 'PORTOEX' e 'SP' em minutas_por_agente")

        cur.close()
        conn.close()
        print()
        print("OK - Teste concluído.")

    except Exception as e:
        print(f"ERRO: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
