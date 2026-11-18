"""Tes koneksi Supabase khusus ASCA tanpa mengubah DATABASE_URL aktif.

Pemakaian:
  1. Letakkan file ini dalam asca/backend-monitoring/.
  2. Tambahkan SUPABASE_DATABASE_URL=... di .env backend (JANGAN kirim .env).
  3. Jalankan: python test_supabase_monitoring.py

Hanya melakukan SELECT, tidak mengubah data.
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url


load_dotenv(Path(__file__).resolve().parent / ".env")
connection_string = os.getenv("SUPABASE_DATABASE_URL", "").strip()

if not connection_string:
    print("GAGAL: SUPABASE_DATABASE_URL belum diisi di .env backend-monitoring.")
    sys.exit(1)

try:
    url = make_url(connection_string)
except Exception:
    print("GAGAL: format SUPABASE_DATABASE_URL tidak valid. Periksa URL-encoding password.")
    sys.exit(1)

if not url.drivername.startswith("postgresql"):
    print("GAGAL: gunakan URL PostgreSQL, misalnya postgresql+psycopg://...")
    sys.exit(1)

print("Menghubungkan ke Supabase dengan akun monitoring read-only...")
engine = create_engine(url, pool_pre_ping=True, connect_args={"connect_timeout": 12})

try:
    with engine.connect() as conn:
        identity = conn.execute(
            text("SELECT current_user AS db_user, current_database() AS db_name")
        ).mappings().one()
        permissions = conn.execute(
            text(
                "SELECT "
                "has_schema_privilege(current_user, 'public', 'USAGE') AS can_use_schema, "
                "has_table_privilege(current_user, 'public.telegram_chat_logs', 'SELECT') AS can_read, "
                "has_table_privilege(current_user, 'public.telegram_chat_logs', 'INSERT') AS can_insert, "
                "has_table_privilege(current_user, 'public.telegram_chat_logs', 'UPDATE') AS can_update, "
                "has_table_privilege(current_user, 'public.telegram_chat_logs', 'DELETE') AS can_delete"
            )
        ).mappings().one()
        count = conn.execute(
            text("SELECT COUNT(*) FROM public.telegram_chat_logs")
        ).scalar_one()
        latest = conn.execute(
            text(
                "SELECT id, created_at FROM public.telegram_chat_logs "
                "ORDER BY created_at DESC LIMIT 1"
            )
        ).mappings().first()

    print("\nBERHASIL: koneksi Supabase dan pembacaan tabel berjalan.")
    print("Database        :", identity["db_name"])
    print("Role aktif      :", identity["db_user"])
    print("Akses schema    :", "YA" if permissions["can_use_schema"] else "TIDAK")
    print("SELECT log      :", "YA" if permissions["can_read"] else "TIDAK")
    print("Jumlah seluruh log:", count)
    print("Log terbaru     :", f"id={latest['id']}; waktu={latest['created_at']}" if latest else "Belum ada log")
    write_perms = [p for p in ("can_insert", "can_update", "can_delete") if permissions[p]]
    if write_perms:
        print("\nPERINGATAN: role ini masih memiliki izin tulis:", ", ".join(write_perms))
        print("Minta pemilik Supabase membatasi role menjadi read-only.")
    else:
        print("Izin tulis      : tidak terdeteksi (INSERT/UPDATE/DELETE)")
    print("\nLangkah berikutnya: alihkan DATABASE_URL setelah hasil ini benar.")
except Exception as exc:
    original = getattr(exc, "orig", exc)
    code = getattr(original, "sqlstate", None) or getattr(original, "pgcode", None)
    print("\nGAGAL: belum dapat membaca tabel Supabase.")
    print("Jenis error     :", type(original).__name__)
    if code:
        print("Kode PostgreSQL :", code)
    print("Penyebab umum: host/port, username pooler, password, TLS, jaringan, atau izin SELECT.")
    print("Jangan kirim password, .env, maupun connection string ke chat.")
    sys.exit(1)
finally:
    engine.dispose()
