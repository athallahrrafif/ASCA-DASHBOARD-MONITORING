"""Diagnostik koneksi Supabase khusus ASCA, tanpa mencetak password/connection string.

Baca SUPABASE_DATABASE_URL dari .env pada direktori skrip. Hanya menjalankan
pengecekan jaringan dan query SELECT; tidak mengubah database.
"""
import os
import socket
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url


def stop(message):
    print(message)
    sys.exit(1)


def diagnose(exc):
    original = getattr(exc, "orig", exc)
    code = getattr(original, "sqlstate", None) or getattr(original, "pgcode", None)
    message = str(original).lower()  # Tidak pernah dicetak mentah: bisa berisi info sensitif.

    if code == "28P01" or "password authentication failed" in message:
        return "Autentikasi ditolak (username atau password tidak cocok).", "Periksa username role.PROJECT_REF dan password role read-only. Jika password baru direset, tunggu propagasi pooler."
    if "tenant or user not found" in message or "tenant/user" in message:
        return "Pooler tidak mengenali proyek/username.", "Salin ulang host Session pooler dari Supabase Connect dan gunakan username ROLE.PROJECT_REF."
    if code == "28000" or "role" in message and "does not exist" in message:
        return "Role/login database tidak dikenali.", "Pastikan role read-only punya atribut LOGIN dan username koneksi benar."
    if code == "42501" or "permission denied" in message:
        return "Koneksi berhasil, tapi hak akses tabel/schema ditolak.", "Minta GRANT USAGE ON SCHEMA public dan GRANT SELECT ON public.telegram_chat_logs untuk role read-only."
    if code in ("42P01", "3F000") or "does not exist" in message and "relation" in message:
        return "Tabel/schema tidak ditemukan.", "Pastikan public.telegram_chat_logs berada di proyek Supabase yang benar."
    if code == "3D000":
        return "Nama database tidak ditemukan.", "Periksa nama database dari menu Connect (umumnya postgres)."
    if "circuit breaker" in message:
        return "Pooler menahan koneksi sementara (circuit breaker).", "Hentikan percobaan berulang, periksa kredensial, lalu coba kembali nanti."
    if "too many connections" in message or code == "53300":
        return "Batas koneksi Supabase tercapai.", "Periksa jumlah koneksi dan pooler di dashboard Supabase."
    if "ssl" in message or "certificate" in message or "tls" in message:
        return "Negosiasi SSL/TLS gagal.", "Periksa sslmode=require, konfigurasi TLS server, dan jangan menonaktifkan verifikasi secara sembarangan."
    if "timeout" in message or "timed out" in message:
        return "Koneksi timeout.", "Periksa firewall/VPN, host/port dan status project Supabase."
    if "connection refused" in message or "could not connect" in message:
        return "Koneksi jaringan ditolak.", "Periksa firewall, port, kemungkinan blokir koneksi akibat gagal login berulang, dan status Supabase."
    if "name or service not known" in message or "could not translate host" in message or "getaddrinfo failed" in message:
        return "DNS hostname gagal ditemukan.", "Salin ulang host pooler dari menu Connect Supabase."
    return "Kesalahan koneksi/query belum terklasifikasi.", "Catat tahap terakhir yang BERHASIL dan kode SQLSTATE (jika ada); jangan kirim traceback lengkap tanpa menyensor rahasia."


def main():
    load_dotenv(Path(__file__).resolve().parent / ".env")
    raw = os.getenv("SUPABASE_DATABASE_URL", "").strip()
    if not raw:
        stop("GAGAL: SUPABASE_DATABASE_URL tidak ada di .env di folder skrip ini.")
    try:
        url = make_url(raw)
    except Exception:
        stop("GAGAL: format SUPABASE_DATABASE_URL tidak valid. Periksa URL-encoding password.")
    if not url.drivername.startswith("postgresql"):
        stop("GAGAL: gunakan koneksi PostgreSQL, misalnya postgresql+psycopg://...")
    if not url.host or not url.port:
        stop("GAGAL: host/port belum ada di SUPABASE_DATABASE_URL.")

    print("DIAGNOSTIK SUPABASE ASCA (tidak mencetak kredensial)")
    print("Tahap 1 - Format URI: OK")
    if "pooler.supabase.com" in url.host and (not url.username or "." not in url.username):
        print("PERINGATAN: username Session pooler umumnya ROLE.PROJECT_REF, bukan hanya nama role.")
    if str(url.query.get("sslmode", "")).lower() != "require":
        print("PERINGATAN: sslmode=require tidak terdeteksi pada URL. Gunakan TLS sesuai konfigurasi Supabase.")
    try:
        socket.getaddrinfo(url.host, url.port, type=socket.SOCK_STREAM)
        print("Tahap 2 - DNS: OK")
    except OSError:
        stop("Tahap 2 - DNS: GAGAL. Host tidak ditemukan. Salin host dari Supabase Dashboard > Connect > Session pooler.")
    try:
        with socket.create_connection((url.host, url.port), timeout=8):
            print("Tahap 3 - TCP port database: OK")
    except OSError:
        stop("Tahap 3 - TCP: GAGAL. Cek jaringan/firewall/VPN dan port yang diberikan Supabase.")

    engine = create_engine(url, pool_pre_ping=True, connect_args={"connect_timeout": 10})
    try:
        with engine.connect() as conn:
            print("Tahap 4 - Login PostgreSQL: OK")
            role = conn.execute(text("SELECT current_user")).scalar_one()
            permissions = conn.execute(text("SELECT has_schema_privilege(current_user, 'public', 'USAGE'), has_table_privilege(current_user, 'public.telegram_chat_logs', 'SELECT')")).one()
            if not (permissions[0] and permissions[1]):
                stop("Tahap 5 - Izin read-only: GAGAL. Role berhasil login tetapi tidak mempunyai USAGE schema dan/atau SELECT tabel.")
            print("Tahap 5 - Izin SELECT: OK")
            amount = conn.execute(text("SELECT count(*) FROM public.telegram_chat_logs")).scalar_one()
            print("Tahap 6 - Membaca log: OK")
            print("JUMLAH LOG:", amount)
            print("Koneksi dan pembacaan tabel Supabase berhasil.")
            print("Role database aktif: (disembunyikan untuk keamanan)")
    except Exception as exc:
        category, advice = diagnose(exc)
        original = getattr(exc, "orig", exc)
        code = getattr(original, "sqlstate", None) or getattr(original, "pgcode", None)
        print("Tahap 4-6 - Database: GAGAL")
        print("Kategori:", category)
        if code:
            print("SQLSTATE:", code)
        print("Tindakan:", advice)
        print("Jangan kirim file .env, password, URI, atau traceback mentah.")
        sys.exit(1)
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
