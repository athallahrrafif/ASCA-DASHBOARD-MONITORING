import { CATEGORIES } from './categories'

/**
 * DUMMY DATA — bukan data nyata Universitas Mercu Buana.
 * Identitas mahasiswa sengaja dianonimkan (Student 001, dst).
 */
const QUESTION_POOL = {
  krs: [
    'Kapan jadwal pengisian KRS semester ganjil dibuka?',
    'Berapa SKS maksimal yang bisa saya ambil semester ini?',
    'Bagaimana cara mengubah KRS setelah masa isi berakhir?',
    'Apakah KRS bisa diisi kalau ada nilai yang belum keluar?',
    'Siapa yang menyetujui KRS saya?',
  ],
  'mata-kuliah': [
    'Mata kuliah apa yang bisa diambil semester 7?',
    'Apa prasyarat mata kuliah Basis Data Lanjut?',
    'Apakah mata kuliah pilihan boleh diambil lintas semester?',
    'Berapa SKS mata kuliah Analisis dan Perancangan Sistem?',
    'Mata kuliah wajib semester 5 apa saja?',
  ],
  ta: [
    'Bagaimana prosedur pengajuan TA?',
    'Berapa minimal SKS untuk mengambil Tugas Akhir?',
    'Dokumen apa saja yang diperlukan untuk sidang TA?',
    'Bagaimana cara mengganti dosen pembimbing TA?',
    'Kapan batas akhir pengumpulan draft TA?',
  ],
  kp: [
    'Bagaimana prosedur KP?',
    'Berapa lama durasi minimal Kerja Praktik?',
    'Apakah KP bisa dilakukan di perusahaan tempat saya bekerja?',
    'Format laporan KP seperti apa?',
    'Siapa yang menandatangani surat pengantar KP?',
  ],
  capstone: [
    'Apa saja persyaratan Capstone Project?',
    'Apa syarat mengambil Capstone Project?',
    'Berapa jumlah anggota kelompok Capstone?',
    'Apa perbedaan Capstone Project dan Tugas Akhir?',
    'Kapan pendaftaran Capstone dibuka?',
  ],
  administrasi: [
    'Bagaimana cara mengurus surat keterangan aktif kuliah?',
    'Di mana saya bisa mengambil transkrip sementara?',
    'Bagaimana prosedur cuti akademik?',
    'Berapa biaya pengurusan legalisir ijazah?',
    'Bagaimana cara mengurus keterlambatan pembayaran?',
  ],
  'panduan-akademik': [
    'Di mana saya bisa mengunduh panduan akademik terbaru?',
    'Apa isi bab evaluasi studi pada panduan akademik?',
    'Berapa IPK minimal untuk lulus?',
    'Apa aturan masa studi maksimal?',
    'Bagaimana sistem penilaian huruf mutu?',
  ],
}

const STATUSES = ['answered', 'answered', 'answered', 'answered', 'partial', 'unanswered']
const SOURCES = ['Panduan Akademik 2026', 'Panduan Tugas Akhir 2026', 'Panduan Kerja Praktik 2026', 'Panduan Capstone Project 2026', 'Kurikulum Fasilkom 2024']

/** PRNG deterministik agar dummy data tidak berubah setiap render. */
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function build(count = 168) {
  const rand = seeded(20260912)
  const rows = []
  const end = new Date('2026-09-17T09:40:00')

  for (let i = 0; i < count; i += 1) {
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)]
    const pool = QUESTION_POOL[category.id]
    const question = pool[Math.floor(rand() * pool.length)]
    const semester = 1 + Math.floor(rand() * 8)
    const status = STATUSES[Math.floor(rand() * STATUSES.length)]
    const minutesAgo = Math.floor(rand() * 60 * 24 * 26) + 2
    const timestamp = new Date(end.getTime() - minutesAgo * 60000)
    const studentNumber = 1 + Math.floor(rand() * 96)

    rows.push({
      id: `INT-${String(1000 + i)}`,
      timestamp: timestamp.toISOString(),
      user: `Student ${String(studentNumber).padStart(3, '0')}`,
      userId: `anon-${String(studentNumber).padStart(3, '0')}`,
      question,
      categoryId: category.id,
      semester,
      status,
      responseTimeMs: 600 + Math.floor(rand() * 2400),
      source: SOURCES[Math.floor(rand() * SOURCES.length)],
      channel: 'telegram',
    })
  }

  return rows.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const interactions = build()
