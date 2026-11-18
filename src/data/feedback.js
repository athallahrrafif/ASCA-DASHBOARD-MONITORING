/** DUMMY DATA umpan balik mahasiswa terhadap jawaban chatbot. */

export const feedbackSummary = {
  positivePercent: 92,
  negativePercent: 8,
  totalRatings: 3167,
  positiveCount: 2914,
  negativeCount: 253,
}

export const feedbackReasons = [
  { id: 'not-relevant', label: 'Jawaban tidak relevan', count: 92 },
  { id: 'incomplete', label: 'Jawaban kurang lengkap', count: 78 },
  { id: 'unclear', label: 'Jawaban kurang jelas', count: 51 },
  { id: 'unavailable', label: 'Informasi belum tersedia', count: 32 },
]

export const feedbackTrend = [
  { week: 'Minggu 1', positive: 88, negative: 12 },
  { week: 'Minggu 2', positive: 90, negative: 10 },
  { week: 'Minggu 3', positive: 89, negative: 11 },
  { week: 'Minggu 4', positive: 92, negative: 8 },
  { week: 'Minggu 5', positive: 93, negative: 7 },
  { week: 'Minggu 6', positive: 92, negative: 8 },
]

export const feedbackEntries = [
  { id: 'fb-1', date: '2026-09-16', user: 'Student 014', categoryId: 'capstone', rating: 'negative', reasonId: 'incomplete', note: 'Syarat SKS disebut, tapi tidak menjelaskan batas nilai minimal.' },
  { id: 'fb-2', date: '2026-09-16', user: 'Student 067', categoryId: 'krs', rating: 'positive', reasonId: null, note: 'Jadwal KRS langsung dapat, tidak perlu buka portal.' },
  { id: 'fb-3', date: '2026-09-15', user: 'Student 031', categoryId: 'ta', rating: 'negative', reasonId: 'not-relevant', note: 'Menanyakan ganti pembimbing, dijawab alur pendaftaran TA.' },
  { id: 'fb-4', date: '2026-09-15', user: 'Student 088', categoryId: 'mata-kuliah', rating: 'positive', reasonId: null, note: 'Prasyarat mata kuliah dijelaskan berikut kodenya.' },
  { id: 'fb-5', date: '2026-09-14', user: 'Student 045', categoryId: 'administrasi', rating: 'negative', reasonId: 'unavailable', note: 'Biaya legalisir belum ada di dokumen sumber.' },
  { id: 'fb-6', date: '2026-09-14', user: 'Student 052', categoryId: 'kp', rating: 'positive', reasonId: null, note: 'Alur KP dijawab lengkap dengan dokumen yang dibutuhkan.' },
  { id: 'fb-7', date: '2026-09-13', user: 'Student 009', categoryId: 'panduan-akademik', rating: 'negative', reasonId: 'unclear', note: 'Jawaban terlalu panjang, sulit menemukan poin utamanya.' },
  { id: 'fb-8', date: '2026-09-13', user: 'Student 073', categoryId: 'krs', rating: 'positive', reasonId: null, note: 'Batas SKS sesuai dengan yang tertulis di panduan.' },
]
