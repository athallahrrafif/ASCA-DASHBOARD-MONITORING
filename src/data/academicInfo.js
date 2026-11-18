/** DUMMY DATA katalog informasi akademik (referensi prototipe). */
export const academicGroups = [
  {
    id: "administrasi",
    title: "Administrasi",
    summary: "Prosedur, persyaratan, dan dokumen yang perlu diurus mahasiswa.",
    topic: "administration",
    items: [
      {
        id: "ai-1",
        title: "Tugas Akhir",
        categoryId: "ta",
        readMinutes: 6,
        summary:
          "Syarat pengajuan, pembimbing, jadwal sidang, dan dokumen yang dikumpulkan.",
        sourceDocId: "doc-2",
      },
      {
        id: "ai-2",
        title: "Kerja Praktik",
        categoryId: "kp",
        readMinutes: 4,
        summary:
          "Durasi minimal, surat pengantar, laporan, dan penilaian pembimbing lapangan.",
        sourceDocId: "doc-3",
      },
      {
        id: "ai-3",
        title: "Capstone Project",
        categoryId: "capstone",
        readMinutes: 5,
        summary:
          "Komposisi kelompok, prasyarat SKS, luaran proyek, dan tahapan penilaian.",
        sourceDocId: "doc-4",
      },
      {
        id: "ai-4",
        title: "Prosedur akademik",
        categoryId: "administrasi",
        readMinutes: 5,
        summary:
          "Cuti akademik, perubahan data, dan pengurusan surat keterangan.",
        sourceDocId: "doc-6",
      },
      {
        id: "ai-5",
        title: "Persyaratan dokumen",
        categoryId: "administrasi",
        readMinutes: 3,
        summary: "Daftar berkas untuk setiap layanan administrasi mahasiswa.",
        sourceDocId: "doc-6",
      },
    ],
  },
  {
    id: "krs",
    title: "KRS & Mata Kuliah",
    summary:
      "Perencanaan studi, beban SKS, dan urutan pengambilan mata kuliah.",
    topic: "krs",
    items: [
      {
        id: "ai-6",
        title: "KRS",
        categoryId: "krs",
        readMinutes: 4,
        summary:
          "Jadwal pengisian, batas revisi, dan persetujuan dosen pembimbing akademik.",
        sourceDocId: "doc-8",
      },
      {
        id: "ai-7",
        title: "Mata Kuliah",
        categoryId: "mata-kuliah",
        readMinutes: 5,
        summary:
          "Daftar mata kuliah wajib dan pilihan beserta deskripsi singkat.",
        sourceDocId: "doc-5",
      },
      {
        id: "ai-8",
        title: "Semester",
        categoryId: "krs",
        readMinutes: 3,
        summary: "Struktur semester ganjil, genap, dan semester antara.",
        sourceDocId: "doc-1",
      },
      {
        id: "ai-9",
        title: "SKS",
        categoryId: "krs",
        readMinutes: 3,
        summary: "Batas SKS berdasarkan IP semester sebelumnya.",
        sourceDocId: "doc-1",
      },
      {
        id: "ai-10",
        title: "Prasyarat",
        categoryId: "mata-kuliah",
        readMinutes: 4,
        summary:
          "Rantai prasyarat antar mata kuliah dan konsekuensinya pada KRS.",
        sourceDocId: "doc-5",
      },
    ],
  },
  {
    id: "panduan",
    title: "Panduan",
    summary: "Dokumen rujukan resmi yang menjadi sumber jawaban ASCA.",
    topic: "rag",
    items: [
      {
        id: "ai-11",
        title: "Panduan Akademik",
        categoryId: "panduan-akademik",
        readMinutes: 12,
        summary: "Aturan studi, evaluasi, masa studi, dan sistem penilaian.",
        sourceDocId: "doc-1",
      },
      {
        id: "ai-12",
        title: "Kurikulum",
        categoryId: "mata-kuliah",
        readMinutes: 8,
        summary:
          "Peta kurikulum program studi beserta distribusi SKS per semester.",
        sourceDocId: "doc-5",
      },
      {
        id: "ai-13",
        title: "Dokumen akademik",
        categoryId: "panduan-akademik",
        readMinutes: 4,
        summary: "Daftar dokumen resmi, versi berlaku, dan tanggal pembaruan.",
        sourceDocId: "doc-1",
      },
    ],
  },
];
