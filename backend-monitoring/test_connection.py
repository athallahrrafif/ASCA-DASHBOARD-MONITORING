
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise RuntimeError("DATABASE_URL belum diatur!")

engine = create_engine(
    database_url,
    connect_args={"connect_timeout": 5}
)

print("=== TEST KONEKSI POSTGRESQL ===")
print("Host:", engine.url.host)
print("Port:", engine.url.port)
print("Database:", engine.url.database)
print("User:", engine.url.username)

try:
    with engine.connect() as conn:
        print("\n[1] Koneksi PostgreSQL BERHASIL!")

        result = conn.execute(
            text("SELECT current_database(), current_user")
        ).one()

        print("Database aktif:", result[0])
        print("User aktif:", result[1])

        print("\n[2] Mengecek tabel telegram_chat_logs...")

        total = conn.execute(
            text("SELECT COUNT(*) FROM public.telegram_chat_logs")
        ).scalar()

        print("BERHASIL membaca tabel!")
        print("Total baris:", total)

except SQLAlchemyError as error:
    print("\n=== TERJADI ERROR ===")
    print("Jenis:", type(error).__name__)
    print("Detail PostgreSQL:")
    print(str(getattr(error, "orig", error)))

finally:
    engine.dispose()
