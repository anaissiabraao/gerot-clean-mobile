#!/usr/bin/env python3
"""
Reseta a senha do usuário anaissiabraao em users_new.
Uso: railway run python scripts/reset_password_anaissiabraao.py
Ou: RESET_PASSWORD=NovaSenha123 railway run python scripts/reset_password_anaissiabraao.py
"""
import os
import sys

# Garante que o projeto está no path para carregar .env
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv

load_dotenv()

import bcrypt
import psycopg2
import psycopg2.extras

USERNAME = "anaissiabraao"
EMAIL = "anaissiabraao@portoex.com.br"
NOME_USUARIO = "anaissiabraao"
NOME_COMPLETO = "Anaissi Abraao"

# Senha: env RESET_PASSWORD ou padrão
SENHA = os.getenv("RESET_PASSWORD", "Teste@123")


def main():
    # DATABASE_PUBLIC_URL existe quando linkado ao Postgres no Railway (conexão externa)
    db = (
        os.getenv("DATABASE_PUBLIC_URL")
        or os.getenv("DIRECT_URL")
        or os.getenv("DATABASE_URL")
        or os.getenv("SUPABASE_DB_URL")
    )
    if not db:
        print("ERRO: DATABASE_URL ou DIRECT_URL não configurada.", file=sys.stderr)
        sys.exit(1)

    conn = psycopg2.connect(db, cursor_factory=psycopg2.extras.RealDictCursor)
    cur = conn.cursor()

    hash_pw = bcrypt.hashpw(SENHA.encode("utf-8"), bcrypt.gensalt())

    cur.execute(
        """
        UPDATE users_new
        SET password = %s,
            is_active = TRUE,
            first_login = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE LOWER(username) = LOWER(%s)
           OR LOWER(COALESCE(email, '')) = LOWER(%s)
           OR LOWER(COALESCE(nome_usuario, '')) = LOWER(%s)
        RETURNING id, username, email, nome_usuario
        """,
        (psycopg2.Binary(hash_pw), USERNAME, EMAIL, NOME_USUARIO),
    )
    row = cur.fetchone()

    if not row:
        print("ERRO: Usuário anaissiabraao não encontrado em users_new.", file=sys.stderr)
        conn.close()
        sys.exit(1)

    conn.commit()
    print("Senha resetada com sucesso:", dict(row))
    conn.close()


if __name__ == "__main__":
    main()