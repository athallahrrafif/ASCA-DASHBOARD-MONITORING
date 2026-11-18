/** DUMMY DATA — angka ilustratif untuk prototipe, bukan hasil pengukuran. */

export const overviewStats = {
  totalUsers: 1248,
  totalQuestions: 5842,
  questionsThisMonth: 824,
  activeUsers: 342,
  deltas: {
    totalUsers: 6.4,
    totalQuestions: 11.2,
    questionsThisMonth: -3.1,
    activeUsers: 4.8,
  },
};

export const quickOverview = {
  mostAskedCategory: "KRS",
  mostActiveSemester: "Semester 5",
  averageQuestionsPerUser: 4.7,
  responseSatisfaction: 92,
};

/** Jumlah pertanyaan per hari (30 hari terakhir). */
export const questionsPerDay = (() => {
  const base = [
    38, 41, 52, 47, 63, 29, 22, 55, 61, 58, 72, 66, 41, 33, 78, 84, 69, 74, 62,
    45, 37, 91, 88, 76, 70, 64, 49, 42, 83, 79,
  ];
  const start = new Date("2026-08-19");
  return base.map((value, index) => {
    const date = new Date(start.getTime() + index * 86400000);
    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      questions: value,
      uniqueUsers: Math.round(value * (0.42 + (index % 5) * 0.03)),
    };
  });
})();

export const questionsByCategory = [
  { categoryId: "krs", label: "KRS", questions: 324 },
  { categoryId: "mata-kuliah", label: "Mata Kuliah", questions: 281 },
  { categoryId: "ta", label: "TA", questions: 176 },
  { categoryId: "kp", label: "KP", questions: 143 },
  { categoryId: "capstone", label: "Capstone", questions: 112 },
  { categoryId: "administrasi", label: "Administrasi", questions: 98 },
  { categoryId: "panduan-akademik", label: "Panduan Akademik", questions: 74 },
];

export const usersBySemester = [
  { semester: 1, users: 82 },
  { semester: 2, users: 96 },
  { semester: 3, users: 134 },
  { semester: 4, users: 151 },
  { semester: 5, users: 208 },
  { semester: 6, users: 187 },
  { semester: 7, users: 196 },
  { semester: 8, users: 114 },
];

export const topTopics = [
  { topic: "Syarat Capstone Project", count: 214 },
  { topic: "Jadwal dan revisi KRS", count: 198 },
  { topic: "Prasyarat mata kuliah", count: 173 },
  { topic: "Prosedur pengajuan TA", count: 156 },
  { topic: "Alur dan durasi KP", count: 131 },
  { topic: "Batas SKS per semester", count: 118 },
  { topic: "Surat keterangan aktif", count: 87 },
];

export const popularQuestions = [
  {
    id: "pq-1",
    question: "Apa saja persyaratan Capstone Project?",
    categoryId: "capstone",
    count: 214,
  },
  {
    id: "pq-2",
    question: "Mata kuliah apa yang bisa diambil semester 7?",
    categoryId: "mata-kuliah",
    count: 186,
  },
  {
    id: "pq-3",
    question: "Apa prasyarat mata kuliah ini?",
    categoryId: "mata-kuliah",
    count: 173,
  },
  {
    id: "pq-4",
    question: "Bagaimana prosedur pengajuan TA?",
    categoryId: "ta",
    count: 156,
  },
  {
    id: "pq-5",
    question: "Bagaimana prosedur KP?",
    categoryId: "kp",
    count: 131,
  },
  {
    id: "pq-6",
    question: "Berapa SKS maksimal yang bisa saya ambil?",
    categoryId: "krs",
    count: 118,
  },
  {
    id: "pq-7",
    question: "Kapan jadwal pengisian KRS dibuka?",
    categoryId: "krs",
    count: 104,
  },
];

export const hourlyUsage = [
  { hour: "00", questions: 12 },
  { hour: "03", questions: 4 },
  { hour: "06", questions: 21 },
  { hour: "09", questions: 96 },
  { hour: "12", questions: 118 },
  { hour: "15", questions: 134 },
  { hour: "18", questions: 87 },
  { hour: "21", questions: 63 },
];

export const botStatus = {
  name: "ASCA Telegram Bot",
  status: "online",
  uptimePercent: 99.4,
  totalInteractions: 5842,
  lastActivityMinutesAgo: 2,
  averageResponseMs: 1420,
  interactionsToday: 79,
  queueDepth: 0,
};
