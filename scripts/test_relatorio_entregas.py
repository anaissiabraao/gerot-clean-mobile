#!/usr/bin/env python3
"""
Teste do endpoint /api/relatorio-entregas
Executa a query diretamente no banco Brudam para verificar o retorno.
Execute a partir da raiz do projeto GeRot: python scripts/test_relatorio_entregas.py
"""
import os
import sys
from datetime import datetime, date

# Adicionar o diretório pai ao path para importar o app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Carregar .env se existir
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "agent_local", ".env")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def get_brudam_db(database_name=None):
    """Cópia simplificada da conexão Brudam."""
    import pymysql
    host = os.getenv("MYSQL_AZ_HOST", "portoex.db.brudam.com.br")
    port = int(os.getenv("MYSQL_AZ_PORT", "3306"))
    user = os.getenv("MYSQL_AZ_USER", "consulta_portoex")
    password = os.getenv("MYSQL_AZ_PASSWORD", "")
    database = database_name or os.getenv("MYSQL_AZ_DB", "azportoex")
    if not all([host, user, password, database]):
        raise ValueError("Credenciais MySQL não configuradas. Configure MYSQL_AZ_* no .env")
    return pymysql.connect(
        host=host, port=port, user=user, password=password, database=database,
        charset="utf8mb4", cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=10, read_timeout=60,
    )


def main():
    database = "azportoex"
    # Testar com período do Script 376 (jan/2026) e também mês atual
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--inicio", default="", help="Data início YYYY-MM-DD")
    parser.add_argument("--fim", default="", help="Data fim YYYY-MM-DD")
    args = parser.parse_args()

    hoje = date.today()
    if args.inicio and args.fim:
        data_inicio, data_fim = args.inicio, args.fim
    else:
        # Padrão: jan/2026 (como no Script 376) para ter dados
        data_inicio = "2026-01-01"
        data_fim = "2026-01-27"
    di = data_inicio.replace("-", "")
    df = data_fim.replace("-", "")

    query = """
        SELECT STATUS, COUNT(*) as qtd
        FROM (
            SELECT
                CASE
                    WHEN m.prazo_congelado = 1 THEN 'PRAZO CONGELADO'
                    WHEN (m.prev_entrega IS NULL OR m.prev_entrega = '0000-00-00')
                         AND (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00')
                      THEN 'SEM PREVISAO'
                    WHEN (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00') THEN
                        CASE
                            WHEN (
                                (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) IS NOT NULL
                                AND LOWER(CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> 'false'
                                AND (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> ''
                            ) THEN
                                CASE
                                    WHEN NOW() > STR_TO_DATE(
                                        CONCAT(
                                            (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END),
                                            ' ', (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END)
                                        ), '%%Y-%%m-%%d %%H:%%i:%%s'
                                    )
                                    THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END
                                END
                            ELSE
                                CASE
                                    WHEN (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END) < CURDATE()
                                      THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END
                                END
                        END
                    ELSE
                        CASE
                            WHEN (
                                COALESCE(NULLIF(LEFT(m.prev_entrega_hora,5),''),'') <> ''
                                AND COALESCE(NULLIF(LEFT(m.hora_entrega,5),''),'') <> ''
                            ) THEN
                                CASE
                                    WHEN STR_TO_DATE(CONCAT(m.data_entrega,' ',LEFT(m.hora_entrega,5)), '%%Y-%%m-%%d %%H:%%i')
                                       > STR_TO_DATE(
                                            CONCAT(
                                                (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END),
                                                ' ', LEFT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END),5)
                                            ), '%%Y-%%m-%%d %%H:%%i'
                                        )
                                      THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END
                                END
                            ELSE
                                CASE
                                    WHEN m.data_entrega > (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END)
                                      THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
                                    ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END
                                END
                        END
                END AS STATUS
            FROM minuta m
            WHERE m.data >= %s AND m.data <= %s
        ) sub
        GROUP BY STATUS
        ORDER BY qtd DESC
    """

    print("=" * 60)
    print("Teste: Relatório de Entregas (Script 376)")
    print("=" * 60)
    print(f"Database: {database}")
    print(f"Período: {data_inicio} a {data_fim} (YYYYMMDD: {di} - {df})")
    print()

    try:
        conn = get_brudam_db(database)
        cursor = conn.cursor()
        cursor.execute(query, (di, df))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        status_counts = {
            str(row.get("STATUS") or row.get("status", "N/D")): int(row.get("qtd", 0) or 0)
            for row in rows
        }
        total = sum(status_counts.values())

        print("RESULTADO (formato da API):")
        print("-" * 40)
        print(f"total: {total}")
        print("status_counts:")
        for status, qtd in status_counts.items():
            pct = (qtd / total * 100) if total else 0
            print(f"  - {status}: {qtd} ({pct:.1f}%)")
        print("-" * 40)
        print("JSON que a API retornaria:")
        import json
        payload = {
            "success": True,
            "status_counts": status_counts,
            "total": total,
            "data_inicio": data_inicio,
            "data_fim": data_fim,
            "database": database,
        }
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        print()
        print("OK - Teste concluído com sucesso.")

    except Exception as e:
        print(f"ERRO: {e}")
        print()
        if "minuta" in str(e).lower() or "table" in str(e).lower():
            print("Dica: O banco pode usar a tabela 'minutas' (plural).")
            print("      Verifique o nome correto da tabela no schema.")
        sys.exit(1)


if __name__ == "__main__":
    main()
