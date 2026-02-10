#!/usr/bin/env python3
"""
Valida se os clientes da lista estão disponíveis no banco para os gráficos.
Os gráficos usam dados do relatório (minuta + fornecedores.fantasia, truncado em 30 chars).
Execute: python scripts/validar_clientes_graficos.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "agent_local", ".env")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

# Lista fornecida: Posição, Cliente, Atendente
CLIENTES_ALVO = [
    "SAMSONITE BRASIL LTDA",
    "ITAPOA TERMINAIS PORTUARI",
    "FORTE TRANSPORTES DO BRAS",
    "ANSELL BRAZIL LTDA.",
    "COMEXPORT COMPANHIA DE CO",
    "MATTEL DO BRASIL LTDA",
    "VENTUNO PRODUTOS TEXTEIS",
    "HERCULES EQUIPAMENTOS DE",
    "LOJAS AVENIDA S.A",
    "BATIKI COM IMPORT EXPORT",
    "SEGER COMERCIAL IMPORTADO",
    "AC COMERCIAL IMPORTADORA",
    "BERTOLUCCI & CIA LTDA",
    "STRATUS COMERCIAL TEXTIL",
    "ITACORDA INDUSTRIA E COME",
    "SKO COMERCIO, IMPORTACAO",
    "BRAFT DO BRASIL IMPORTACA",
    "TECADI ARMAZENS GERAIS LT",
    "CLIF",
    "CKS INTERNATIONAL COMERCI",
    "BSG BIJOU BRASIL COMERCIO",
    "COMEXPORT COMPANHIA DE CO",  # duplicado
    "HGS GAS E AGUA DO BRASIL",
    "WINWIN TEXTILCOMERCIO E I",
    "TIMBRO TRADING S.A",
    "GEO AGRI TECNOLOGIA AGRIC",
    "FOTON MOTOR DO BRASIL VEN",
    "FITA UP LTDA",
    "TOTALITY COMERCIO TECNICO",
    "MRCEGLIA IMPORTACAO E SER",
]


def get_brudam_db(database_name=None):
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
    from datetime import date
    data_inicio = "2026-01-01"
    data_fim = "2026-01-27"
    di = data_inicio.replace("-", "")
    df = data_fim.replace("-", "")

    # Query: clientes distintos no período (mesmo critério do Script 376 e relatório)
    # minuta.id_cliente -> fornecedores.id_local, fantasia truncada em 30
    query = """
        SELECT DISTINCT SUBSTR(c.fantasia, 1, 30) AS cliente
        FROM minuta m
        INNER JOIN fornecedores c ON c.id_local = m.id_cliente
        WHERE m.data >= %s AND m.data <= %s
        ORDER BY cliente
    """

    print("=" * 70)
    print("Validação: Clientes disponíveis nos gráficos")
    print("=" * 70)
    print(f"Período: {data_inicio} a {data_fim}")
    print(f"Critério: SUBSTR(fornecedores.fantasia, 1, 30) como no Script 376")
    print()

    try:
        conn = get_brudam_db()
        cursor = conn.cursor()
        cursor.execute(query, (di, df))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        # No relatório/gráficos os nomes aparecem truncados em 30 chars (Script 376)
        # DB retorna SUBSTR(fantasia,1,30) - pode ser menor se fantasia < 30 chars
        clientes_db = list({(r.get("cliente") or r.get("CLIENTE") or "").strip() for r in rows if (r.get("cliente") or r.get("CLIENTE") or "").strip()})

        # Remover duplicatas da lista alvo
        clientes_alvo_unicos = list(dict.fromkeys(CLIENTES_ALVO))

        encontrados = []
        nao_encontrados = []
        possiveis = []

        for cliente in clientes_alvo_unicos:
            c_upper = cliente.upper().strip()
            c_30 = c_upper[:30]
            # Match: exato OU DB começa com o nome do usuário (lista pode estar truncada)
            matches = [
                db for db in clientes_db
                if db.upper() == c_upper
                or db.upper()[:30] == c_30
                or (len(c_upper) <= 30 and db.upper().startswith(c_upper))
                or (len(db) >= len(c_upper) and db.upper()[:len(c_upper)] == c_upper)
            ]
            if matches:
                encontrados.append((cliente, matches[0]))
            else:
                # Buscar por prefixo (ex: "ITAPOA TERMINAIS PORTUARI" vs "ITAPOA TERMINAIS PORTUARIOS S")
                parciais = [db for db in clientes_db if db.upper().startswith(c_upper[:20]) or c_upper.startswith(db.upper()[:20])]
                if parciais:
                    possiveis.append((cliente, parciais[:3]))
                else:
                    nao_encontrados.append(cliente)

        print("RESULTADO DA VALIDAÇÃO")
        print("-" * 70)
        print(f"Total de clientes distintos no banco (período): {len(clientes_db)}")
        print(f"Total na sua lista (únicos): {len(clientes_alvo_unicos)}")
        print()

        print("ENCONTRADOS (disponíveis nos gráficos):")
        print("-" * 70)
        for i, (alvo, orig) in enumerate(encontrados, 1):
            status = "OK" if alvo == orig else f"OK (como '{orig}')"
            print(f"  {i:2}. {alvo[:45]:<45} {status}")
        print(f"  Total: {len(encontrados)} clientes")
        print()

        if possiveis:
            print("POSSÍVEIS MATCHES (verificar manualmente):")
            print("-" * 70)
            for alvo, candidatos in possiveis:
                print(f"  - {alvo}")
                for c in candidatos:
                    print(f"      -> {c}")
            print()

        if nao_encontrados:
            print("NÃO ENCONTRADOS no período:")
            print("-" * 70)
            for c in nao_encontrados:
                print(f"  - {c}")
            print(f"  Total: {len(nao_encontrados)} clientes")
            print()
            print("Possíveis causas: nome diferente no cadastro, sem operações no período,")
            print("ou grafia distinta (ex: LTDA vs LTD).")
        else:
            print("Todos os clientes da lista foram encontrados.")

        print()
        print("=" * 70)
        print("Conclusão:")
        pct = (len(encontrados) / len(clientes_alvo_unicos) * 100) if clientes_alvo_unicos else 0
        print(f"  {len(encontrados)}/{len(clientes_alvo_unicos)} clientes validados ({pct:.0f}%)")
        if nao_encontrados:
            print(f"  {len(nao_encontrados)} precisam de verificação no cadastro.")
        print("=" * 70)

    except Exception as e:
        print(f"ERRO: {e}")
        if "minuta" in str(e).lower() or "table" in str(e).lower():
            print("Dica: O banco pode usar a tabela 'minutas' (plural).")
        sys.exit(1)


if __name__ == "__main__":
    main()
