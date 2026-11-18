# FASCA — Fasilkom Academic Assistant

Frontend React untuk **FASCA**, layanan informasi akademik yang chatbot-nya berjalan di **Telegram**.

Situs ini **bukan** chatbot. Perannya: landing page, dashboard pemantauan, visualisasi data interaksi,
dan katalog informasi akademik. Tidak ada chat window, chat input, atau simulasi jawaban AI di dalam kode.

```
Mahasiswa → Telegram → FASCA Chatbot (AI/RAG) → Backend → Database + Knowledge Base
                                                             ↓
                                                         REST API
                                                             ↓
                                                   React Dashboard (repo ini)
```

## Menjalankan

```bash
npm install
cp .env.example .env
npm run dev      # http://localhost:5173
npm run build
npm run smoke    # render seluruh route di jsdom, mendeteksi error runtime
```

Aplikasi berjalan penuh tanpa backend.

## Environment

| Variabel | Arti |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL REST API backend. |
| `VITE_USE_MOCK_DATA` | `true` → dummy data lokal; `false` → panggil REST API. |
| `VITE_TELEGRAM_BOT_URL` | Tautan bot. Tidak di-hardcode; bila kosong, tombol Telegram otomatis dinonaktifkan. |
| `VITE_TELEGRAM_BOT_USERNAME` | Ditampilkan pada sidebar, navbar, dan halaman status bot. |
| `VITE_MOCK_LATENCY` | Latensi buatan (ms) agar loading state terlihat saat memakai dummy data. |
| `VITE_RESEARCH_FOCUS` | `all` \| `administration` \| `krs` \| `rag`. Membatasi katalog informasi pada satu arah penelitian. |

## Struktur

```
src/
  config/env.js          satu-satunya pembaca import.meta.env
  data/                  dummy data, terpisah penuh dari UI
  services/              lapisan service; mengembalikan { data, meta }
    apiClient.js         resolve() memilih mock atau fetch REST
  hooks/useAsync.js      loading / error / empty / success + refresh()
  components/
    ui/                  Button, Modal, DataTable, FilterBar, StatusBadge,
                         EmptyState, ErrorState, LoadingSkeleton, PageHeader, DemoBadge
    cards/               StatCard, ChartCard, CategoryCard, CourseCard,
                         DocumentCard, KnowledgeBaseCard
    layout/              Sidebar, Navbar, DashboardLayout, NotificationDropdown, Logo, ThemeToggle
    landing/             LandingNav, TelegramMockup, FlowDiagram, Footer
    charts/              ChartTooltip + tema sumbu Recharts
  pages/                 satu berkas per route
```

## Mengganti dummy data dengan backend

Ubah `VITE_USE_MOCK_DATA=false` dan arahkan `VITE_API_BASE_URL`. Tidak ada komponen UI yang perlu disentuh.

Setiap service memanggil `resolve({ path, params, mockFn })`. Saat mock dimatikan, `path` dipanggil
dengan `params` sebagai query string.

Endpoint yang diharapkan:

```
GET /interactions?search&categoryId&semester&from&to&page&pageSize
GET /interactions/recent?limit
GET /analytics/overview
GET /analytics?range
GET /analytics/popular-questions?limit
GET /bot/status
GET /academic-info?search
GET /courses?search&semester&type&sks&programId
GET /courses/programs
GET /documents?search&status&categoryId
GET /knowledge-base?search&status
GET /feedback?rating
GET /users/me
GET /notifications
```

**Kontrak respons.** Backend harus mengembalikan:

```json
{ "data": ..., "meta": { "total": 168, "page": 1, "pageSize": 10, "totalPages": 17 } }
```

`meta` wajib untuk endpoint berhalaman. Bila backend mengembalikan array telanjang, `apiClient`
membungkusnya, tetapi paginasi tidak akan berfungsi. Bentuk objek per baris harus sama persis dengan
berkas di `src/data/` — itulah spesifikasi yang dipakai UI.

## Siap real-time

`useAsync` mengembalikan `refresh()`, dan `usePolling(refresh, ms)` tersedia di `src/hooks/useAsync.js`
tetapi belum diaktifkan di halaman mana pun. Untuk polling: panggil `usePolling(refresh, 30000)`.
Untuk SSE/WebSocket: panggil `refresh()` saat pesan masuk. Tidak ada perubahan komponen yang diperlukan.

Saat ini pembaruan dilakukan lewat tombol **Muat ulang** di setiap header halaman.

## Privasi

- Halaman pemantauan menampilkan `Student 001`, bukan nama atau NIM.
- Nama dan NIM hanya muncul di `/profile`, yaitu profil pemilik akun itu sendiri.
- Tidak ada kata sandi, nomor telepon, alamat, atau ID Telegram di mana pun dalam kode maupun dummy data.

**Belum ada di prototipe ini:** autentikasi dan pembatasan peran. Seluruh route dapat diakses siapa pun
yang membuka URL-nya. Sebelum dipasang dengan data nyata, `/interactions`, `/feedback`, dan `/analytics`
harus berada di balik login dan dibatasi untuk peran pengelola. Anonimisasi mengurangi dampak kebocoran,
tetapi tidak menggantikan kontrol akses.

## Data contoh

`VITE_USE_MOCK_DATA=true` menyalakan badge **Data contoh** pada setiap header halaman dan setiap kartu chart.
Seluruh angka (1.248 pengguna, kepuasan 92%, dan seterusnya) adalah ilustrasi untuk prototipe —
bukan hasil pengukuran layanan Universitas Mercu Buana.

## Tiga kemungkinan judul penelitian

| Arah | Halaman pendukung |
| --- | --- |
| Administrasi (TA, KP, Capstone) | `/academic-info`, `/documents`, `/interactions`, `/analytics` |
| KRS & mata kuliah | `/courses`, `/academic-info`, `/analytics` |
| RAG | `/knowledge-base`, `/documents`, `/feedback` |

Setel `VITE_RESEARCH_FOCUS` untuk mempersempit katalog informasi ke salah satu arah.
Bila judul akhir bukan RAG, `/knowledge-base` dapat dihapus dari `src/components/layout/navigation.js`
dan `src/App.jsx` tanpa memengaruhi halaman lain.

## Teknologi

React 18 · Vite 5 · React Router 6 · Tailwind CSS 3 · Recharts 2 · Framer Motion 11 · Lucide React
