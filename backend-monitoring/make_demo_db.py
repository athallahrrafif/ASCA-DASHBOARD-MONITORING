"""Local-only demo records — NEVER connects to friend's database."""
import sqlite3
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

DB = 'demo.sqlite3'
now = datetime.now(ZoneInfo('Asia/Jakarta'))
items = [
    ('Bagaimana cara mengisi KRS di UMB?', 'Panduan KRS UMB', 'UMB', 'success', 'procedure', 'Buku_Panduan_KRS_UMB.pdf', 'KRS'),
    ('Apa itu KRS di UNJ?', 'Definisi KRS UNJ', 'UNJ', 'success', 'definition', 'Buku_Panduan_KRS_UNJ.pdf', 'KRS'),
    ('Kapan kalender akademik?', 'Jadwal perkuliahan', 'UMB', 'success', 'general', None, 'Kalender Akademik'),
    ('Siapa rektor?', 'Informasi tidak ditemukan dalam dokumen', 'UMB', 'success', 'general', None, 'Lainnya'),
    ('Bagaimana cara revisi KRS?', 'Periksa panduan resmi', 'UMB', 'success', 'procedure', 'Buku_Panduan_KRS_UMB.pdf', 'KRS'),
    ('Cara daftar tugas akhir?', 'Silakan baca buku pedoman', 'UNJ', 'success', 'procedure', None, None),
]
with sqlite3.connect(DB) as conn:
    conn.execute('''CREATE TABLE IF NOT EXISTS chatbot_logs (
        id INTEGER PRIMARY KEY,
        question TEXT,
        answer TEXT,
        institution TEXT,
        status TEXT,
        created_at TEXT,
        intent TEXT,
        source_file TEXT,
        category TEXT
    )''')
    conn.execute('DELETE FROM chatbot_logs')
    for i in range(40):
        q, a, inst, status, intent, source, cat = items[i % len(items)]
        ts = (now - timedelta(days=i % 32, hours=i % 7)).isoformat()
        conn.execute('''INSERT INTO chatbot_logs (question,answer,institution,status,created_at,intent,source_file,category)
            VALUES (?,?,?,?,?,?,?,?)''', (q, a, inst, status, ts, intent, source, cat))
    conn.execute('''INSERT INTO chatbot_logs (question, status, created_at) VALUES (?,?,?)''', ('TES DATABASE LANGSUNG', 'test', now.isoformat()))
print(f'File simulasi dibuat: {DB}. Ada 40 interaksi simulasi + 1 data uji yang dikecualikan.')
