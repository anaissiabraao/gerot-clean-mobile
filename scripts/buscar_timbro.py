#!/usr/bin/env python3
"""Busca TIMBRO no banco - verifica se tem minutas no período."""
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

import pymysql
host = os.getenv("MYSQL_AZ_HOST", "portoex.db.brudam.com.br")
port = int(os.getenv("MYSQL_AZ_PORT", "3306"))
user = os.getenv("MYSQL_AZ_USER", "consulta_portoex")
password = os.getenv("MYSQL_AZ_PASSWORD", "")
database = os.getenv("MYSQL_AZ_DB", "azportoex")

conn = pymysql.connect(host=host, port=port, user=user, password=password, database=database,
    charset="utf8mb4", cursorclass=pymysql.cursors.DictCursor)
cur = conn.cursor()

# Minutas de TIMBRO em jan/2026
cur.execute("""
    SELECT COUNT(*) as qtd, SUBSTR(c.fantasia, 1, 30) as cliente
    FROM minuta m
    INNER JOIN fornecedores c ON c.id_local = m.id_cliente
    WHERE c.fantasia LIKE %s AND m.data >= '20260101' AND m.data <= '20260127'
    GROUP BY SUBSTR(c.fantasia, 1, 30)
""", ("%TIMBRO TRADING%",))
rows = cur.fetchall()
print("Minutas TIMBRO TRADING em jan/2026:")
for r in rows:
    print(f"  '{r['cliente']}': {r['qtd']} minutas")

cur.close()
conn.close()
