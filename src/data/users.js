/**
 * DUMMY DATA profil.
 * Catatan privasi: NIM dan nama hanya muncul pada profil pemilik akun itu sendiri,
 * tidak pernah pada halaman monitoring yang menampilkan mahasiswa lain.
 */
export const currentUser = {
  id: 'usr-001',
  name: 'Athallah Rafif Hidayat',
  nim: '41523010001',
  program: 'Sistem Informasi',
  faculty: 'Fakultas Ilmu Komputer',
  semester: 7,
  role: 'student',
  telegramLinked: true,
  joinedAt: '2026-02-11',
  stats: {
    questionsAsked: 38,
    favoriteCategoryId: 'capstone',
    lastInteraction: '2026-09-17T08:12:00',
    averageResponseMs: 1380,
    satisfactionGiven: 34,
  },
  recentQuestions: [
    { id: 'uq-1', question: 'Apa saja persyaratan Capstone Project?', categoryId: 'capstone', date: '2026-09-17T08:12:00' },
    { id: 'uq-2', question: 'Mata kuliah apa yang bisa diambil semester 7?', categoryId: 'mata-kuliah', date: '2026-09-15T19:44:00' },
    { id: 'uq-3', question: 'Bagaimana prosedur KP?', categoryId: 'kp', date: '2026-09-12T10:03:00' },
    { id: 'uq-4', question: 'Berapa SKS maksimal yang bisa saya ambil semester ini?', categoryId: 'krs', date: '2026-09-08T14:26:00' },
  ],
}
