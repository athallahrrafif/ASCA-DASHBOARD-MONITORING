# FASCA Monitoring — backend mandiri untuk membaca database chatbot

Ini adalah **starter lokal**, bukan server admin siap publik. Tidak ada perubahan data di database asli. Semua query backend menggunakan SELECT melalui SQLAlchemy; keamanan final tetap perlu **akun database read-only**, jaringan privat/VPN atau SSH tunnel, dan **autentikasi admin** sebelum di-deploy.

## 1. Jalankan contoh tanpa database temen dulu (Windows / PowerShell)

Buka terminal di folder `fasca/backend-monitoring` lalu:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python make_demo_db.py
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

Kalau aktivasi PowerShell diblokir, gunakan `\.venv\Scripts\python.exe -m pip install -r requirements.txt`, `\.venv\Scripts\python.exe make_demo_db.py`, dan `\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload` tanpa mengubah ExecutionPolicy.

Tes API lewat `http://127.0.0.1:8001/api/health` dan `http://127.0.0.1:8001/docs`.

## 2. Jalankan frontend pada terminal LAIN

Pindah ke folder `fasca` (yang berisi `package.json`):

```powershell
npm install
npm run dev
```

Buka `http://localhost:5173/dashboard`. Browser akan memanggil `http://localhost:5173/api/...`; Vite meneruskan ke FastAPI lokal port **8001**.

File `fasca/.env` sudah berisi:

```dotenv
VITE_API_BASE_URL=http://localhost:5173/api
VITE_USE_MOCK_DATA=true
VITE_USE_LIVE_MONITORING=true
```

`VITE_USE_LIVE_MONITORING=true` = empat halaman **Dashboard, Analitik, Interaksi, Monitoring Bot** menggunakan backend FastAPI; halaman lain (katalog / dokumen / profil / notifikasi) tetap memakai data dummy masing-masing. Lihat banner **DATA SIMULASI** ketika backend memakai demo.sqlite3.

Dashboard dan status bot diperbarui otomatis setiap **10 detik**. Statistik ditarik dari database setiap request; penyimpanan di chatbot harus selesai dulu sebelum muncul pada grafik. WebSocket tidak diperlukan.

## 3. Saat dapat akses read-only DB dari teman

Minta teman memberikan lewat kanal privat:

- **Jenis DB** (PostgreSQL / MySQL / SQLite), nama database dan nama tabel riwayat;
- **Host, port**, dan apakah backend lu bisa mencapai host dari komputer/server lu;
- Akun pengguna **SELECT only**, jangan pakai akun admin;
- Apakah database di jaringan privat, memerlukan VPN / SSH tunnel;
- Nama kolom dan tipe `created_at`, serta zona waktunya.

**Jangan kirim password di chat atau menaruhnya di file frontend/`VITE_`**. Isi file `fasca/backend-monitoring/.env` di komputer sendiri, misalnya:

```dotenv
# PostgreSQL
DATABASE_URL=postgresql+psycopg://monitor_readonly:ISI_PASSWORD_DI_KOMPUTER_SENDIRI@HOST_DB:5432/NAMA_DB
MONITOR_TABLE=NAMA_TABEL_ASLI
MONITOR_EXCLUDE_TEST=true
```

Atau untuk MySQL:

```dotenv
DATABASE_URL=mysql+pymysql://monitor_readonly:ISI_PASSWORD_DI_KOMPUTER_SENDIRI@HOST_DB:3306/NAMA_DB
MONITOR_TABLE=NAMA_TABEL_ASLI
```

Bila kredensial mengandung karakter khusus (`@`, `#`, `/`, `:`), karakter tersebut perlu URL-encoding. Jangan menyambungkan database publik tanpa perlindungan jaringan / TLS.

Restart FastAPI setelah edit `.env`. **Jangan jalankan `make_demo_db.py` lagi untuk data asli** (file itu hanya untuk contoh SQLite lokal).

## 4. Bentuk tabel yang diasumsikan

Wajib: `question`, `created_at`.

Sesuai screenshot: `answer`, `institution`, `status`, `intent`, `source_file`, `category`.

Bila ada `id`, dipakai sebagai ID interaksi. Jika tidak ada, backend membuat ID sementara untuk UI (tidak cocok menjadi ID permanen). Kolom untuk statistik pengguna unik, semester, feedback, latency, uptime **tidak terlihat** dalam screenshot, jadi tidak dimunculkan sebagai angka sungguhan. `status=success` tidak sama dengan jawaban benar.

`MONITOR_EXCLUDE_TEST=true`: catatan `status=test` dan pertanyaan yang dimulai `TES ` dikecualikan dari analitik. Ini bisa diubah jika kebutuhan berubah.

Kolom `created_at` **diasumsikan waktu lokal Asia/Jakarta jika tidak mengandung timezone**. Jika nilai UTC tanpa zona, ubah fungsi `as_datetime` terlebih dahulu.

## 5. Endpoint backend lu

| Endpoint | Apa yang dikirim |
|---|---|
| `/api/health` | Koneksi database monitoring |
| `/api/analytics/overview` | Angka utama |
| `/api/analytics?range=30d` | Grafik harian, kategori, kampus, intent, jam |
| `/api/analytics/monthly-categories?months=6` | Grafik kategori per bulan |
| `/api/analytics/popular-questions?limit=7` | Pertanyaan yang secara teks identik paling sering |
| `/api/interactions?page=1&pageSize=10` | Log dengan pagination dan filter |
| `/api/interactions/recent?limit=6` | Interaksi terbaru |
| `/api/bot/status` | Jumlah log hari ini / terakhir; **tidak menyatakan status online bot** |

**Tidak ada route POST/PUT/DELETE** ke database temen lu. Koneksi ke DB melalui backend Python, tidak dari React.

## 6. Catatan keamanan sebelum dipublikasikan

Versi ini **hanya untuk development lokal**. FastAPI dipasang ke `127.0.0.1`. Sebelum dipakai admin sungguhan di internet, tambahkan login server-side dan role admin, rate limiting, HTTPS, audit akses, pembatasan exposure pertanyaan/jawaban, serta kebijakan retensi data. Vite dev proxy hanya untuk lokal dan bukan mekanisme keamanan produksi.

## 7. Uji near-real-time

1. Jalankan backend dan dashboard.
2. Jika ingin menguji perubahan data tanpa Telegram, tambahkan **satu catatan dummy baru** ke `demo.sqlite3` lewat SQLite editor, bukan ke database temen.
3. Dalam maksimal sekitar 10 detik, total pertanyaan di dashboard meningkat setelah data di-commit.
4. Jika database temen sudah tersambung dan bot menyimpan catatan, efeknya sama: backend membaca tabel yang sama.
