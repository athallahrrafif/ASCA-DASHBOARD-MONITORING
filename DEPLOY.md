# Deploy ke Render (Starter, satu service)

Frontend dan backend disajikan dari **satu domain**, jadi cookie login berfungsi. GitHub Pages tidak
dipakai lagi (frontend di sana tidak bisa mencapai backend dan login selalu gagal).

## Langkah
1. Render → **New → Blueprint** → pilih repo ini (membaca `render.yaml`).
2. Isi env var yang `sync: false`:
   - `FASCA_ADMIN_PASSWORD` — panjang & acak (server menolak start bila < 10 karakter).
   - `DATABASE_URL=sqlite:///./demo.sqlite3` dan `MONITOR_TABLE=chatbot_logs` untuk mode simulasi
     (**jangan dikosongkan**: variabel kosong membuat server gagal start); uji login & tampilan dulu.
3. Setelah login berhasil, isi data asli:
   - `DATABASE_URL=postgresql+psycopg://ROLE.PROJECT_REF:PASSWORD@<host-session-pooler>:5432/postgres`
     (Supabase → Connect → **Session pooler**; password di-URL-encode; akun **read-only**).
   - `MONITOR_TABLE=telegram_chat_logs`
4. Cek `https://<service>.onrender.com/` → login admin.

## Setelah pameran
Render menagih per detik. **Suspend/hapus service** supaya biaya berhenti.

## Catatan
- Sesi login disimpan di memori: restart server = semua ter-logout; jalankan 1 worker saja.
- Proyek Supabase tier gratis bisa ter-pause bila idle; cek sebelum pameran.
- Lokal: `uvicorn main:app --port 8001` di `backend-monitoring/` + `npm run dev` (proxy `/api` → 8001).
  Set `FASCA_ENABLE_DOCS=true` jika perlu `/docs`.
