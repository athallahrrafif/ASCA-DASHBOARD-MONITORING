# Deploy ke VPS (Docker + Caddy, HTTPS otomatis)

Satu server menjalankan dua container: `app` (FastAPI + frontend) dan `caddy` (HTTPS). Frontend dan
API berada di **satu domain**, jadi cookie login berfungsi.

Biaya: VPS + domain. Berhenti membayar setelah pameran = batalkan VPS dan domain.

## 0. Yang perlu disiapkan
- **VPS Linux**, Ubuntu 22.04 atau 24.04, lokasi Indonesia. Catat **alamat IP** dan **password root**
  (atau SSH key) dari email / panel penyedia.
- **Domain** (mis. `.my.id`) dari registrar mana saja.
- Password admin dashboard yang panjang dan acak (min. 10 karakter).

> RAM 1 GB cukup untuk menjalankan aplikasi, tetapi **build** pertama bisa kehabisan memori.
> Langkah 3 menambah swap supaya aman. Kalau tersedia paket RAM lebih besar dengan selisih harga kecil, ambil itu.

## 1. Arahkan domain ke VPS
Di panel DNS registrar, buat **A record**:

| Type | Name | Value |
|---|---|---|
| A | `dashboard` (atau `@` untuk domain utama) | IP VPS |

Hasilnya `dashboard.namadomain.my.id` mengarah ke VPS. Propagasi bisa beberapa menit sampai beberapa jam.
Cek dari laptop (PowerShell): `nslookup dashboard.namadomain.my.id` harus menampilkan IP VPS.

## 2. Masuk ke VPS
Dari PowerShell di laptop:
```
ssh root@IP_VPS
```
Jawab `yes` pada pertanyaan fingerprint, lalu masukkan password.

## 3. Siapkan server (sekali saja, jalankan di VPS)
Swap 2 GB, supaya build tidak kehabisan memori:
```
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```
Docker (skrip resmi):
```
curl -fsSL https://get.docker.com | sh
```
Firewall (hanya SSH, HTTP, HTTPS):
```
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw --force enable
```

## 4. Ambil kode
```
git clone -b deploy-render https://github.com/athallahrrafif/ASCA-DASHBOARD-MONITORING.git
cd ASCA-DASHBOARD-MONITORING
```
(Jika branch sudah digabung ke `main`, hapus `-b deploy-render`.)

## 5. Isi konfigurasi rahasia
```
cp server.env.example .env
nano .env
```
Isi `SITE_DOMAIN` dan `FASCA_ADMIN_PASSWORD`. Biarkan `DATABASE_URL` dan `MONITOR_TABLE` pada mode
simulasi dulu. Simpan di nano: `Ctrl+O`, Enter, lalu `Ctrl+X`.

## 6. Jalankan
```
docker compose up -d --build
```
Build pertama beberapa menit. Pantau:
```
docker compose logs -f
```
Keluar dari log dengan `Ctrl+C` (aplikasi tetap jalan). Caddy otomatis meminta sertifikat HTTPS begitu
domain sudah mengarah ke VPS.

## 7. Uji
Buka `https://dashboard.namadomain.my.id`, login dengan username `admin` dan password tadi. Banner
**DATA SIMULASI** harus tampil.

## 8. Ganti ke data asli
```
nano .env
```
Ubah `DATABASE_URL` dan `MONITOR_TABLE` ke blok TAHAP 2 (Supabase **Session pooler**, akun **read-only**,
tabel `telegram_chat_logs`), lalu:
```
docker compose up -d
```
Jika dashboard menampilkan "Database monitoring belum dapat diakses", cek ulang `DATABASE_URL`
(password di-URL-encode, host pooler, akses read-only) dengan `docker compose logs app`.

## Memperbarui kode
```
cd ~/ASCA-DASHBOARD-MONITORING
git pull
docker compose up -d --build
```

## Masalah umum
- **Browser menampilkan error sertifikat / tidak bisa dibuka:** DNS belum mengarah ke VPS, atau port
  80/443 tertutup. Cek `nslookup`, lalu `docker compose logs caddy`.
- **Container `app` terus restart:** lihat `docker compose logs app`. Penyebab umum: password admin kosong
  atau kurang dari 10 karakter, atau variabel di `.env` kosong.
- **Build berhenti dengan "Killed":** kehabisan memori. Pastikan swap aktif (`swapon --show`).
- **Semua pengguna ter-logout setelah restart:** normal, sesi disimpan di memori proses.

## Setelah pameran
Batalkan VPS dan domain di penyedia agar tagihan berhenti. Ganti password database Supabase atau
hapus akun read-only yang dipakai dashboard jika tidak diperlukan lagi.
