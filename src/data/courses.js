/** DUMMY DATA katalog mata kuliah untuk prototipe. */
export const programs = [
  { id: 'si', label: 'Sistem Informasi' },
  { id: 'ti', label: 'Teknik Informatika' },
]

export const courses = [
  { id: 'c1', code: 'SI-101', name: 'Algoritma dan Pemrograman', sks: 4, semester: 1, type: 'wajib', programId: 'si', prerequisites: [], description: 'Dasar logika pemrograman, struktur kendali, dan fungsi.' },
  { id: 'c2', code: 'SI-102', name: 'Matematika Diskrit', sks: 3, semester: 1, type: 'wajib', programId: 'si', prerequisites: [], description: 'Himpunan, logika proposisi, relasi, graf, dan kombinatorika.' },
  { id: 'c3', code: 'SI-104', name: 'Pengantar Sistem Informasi', sks: 3, semester: 1, type: 'wajib', programId: 'si', prerequisites: [], description: 'Konsep dasar sistem informasi dalam organisasi.' },
  { id: 'c4', code: 'SI-201', name: 'Struktur Data', sks: 4, semester: 2, type: 'wajib', programId: 'si', prerequisites: ['SI-101'], description: 'Array, linked list, stack, queue, tree, dan kompleksitas.' },
  { id: 'c5', code: 'SI-203', name: 'Basis Data', sks: 3, semester: 2, type: 'wajib', programId: 'si', prerequisites: ['SI-104'], description: 'Model relasional, normalisasi, dan SQL.' },
  { id: 'c6', code: 'SI-205', name: 'Statistika', sks: 3, semester: 2, type: 'wajib', programId: 'si', prerequisites: ['SI-102'], description: 'Statistika deskriptif dan inferensial untuk analisis data.' },
  { id: 'c7', code: 'SI-301', name: 'Pemrograman Berorientasi Objek', sks: 4, semester: 3, type: 'wajib', programId: 'si', prerequisites: ['SI-201'], description: 'Enkapsulasi, pewarisan, polimorfisme, dan design pattern dasar.' },
  { id: 'c8', code: 'SI-303', name: 'Analisis dan Perancangan Sistem', sks: 3, semester: 3, type: 'wajib', programId: 'si', prerequisites: ['SI-104'], description: 'Analisis kebutuhan, pemodelan proses, dan perancangan sistem.' },
  { id: 'c9', code: 'SI-305', name: 'Jaringan Komputer', sks: 3, semester: 3, type: 'wajib', programId: 'ti', prerequisites: [], description: 'Model OSI/TCP-IP, routing, dan keamanan jaringan dasar.' },
  { id: 'c10', code: 'SI-401', name: 'Basis Data Lanjut', sks: 3, semester: 4, type: 'wajib', programId: 'si', prerequisites: ['SI-203'], description: 'Query optimization, indexing, transaksi, dan basis data terdistribusi.' },
  { id: 'c11', code: 'SI-403', name: 'Rekayasa Perangkat Lunak', sks: 3, semester: 4, type: 'wajib', programId: 'si', prerequisites: ['SI-301', 'SI-303'], description: 'Siklus hidup perangkat lunak, pengujian, dan manajemen proyek.' },
  { id: 'c12', code: 'SI-405', name: 'Interaksi Manusia dan Komputer', sks: 3, semester: 4, type: 'pilihan', programId: 'si', prerequisites: [], description: 'Prinsip usability, perancangan antarmuka, dan evaluasi heuristik.' },
  { id: 'c13', code: 'SI-501', name: 'Kecerdasan Buatan', sks: 3, semester: 5, type: 'wajib', programId: 'ti', prerequisites: ['SI-201', 'SI-205'], description: 'Pencarian, representasi pengetahuan, dan dasar pembelajaran mesin.' },
  { id: 'c14', code: 'SI-503', name: 'Pemrograman Web', sks: 4, semester: 5, type: 'wajib', programId: 'si', prerequisites: ['SI-301'], description: 'Arsitektur klien-server, REST API, dan pengembangan aplikasi web.' },
  { id: 'c15', code: 'SI-505', name: 'Data Mining', sks: 3, semester: 5, type: 'pilihan', programId: 'si', prerequisites: ['SI-205', 'SI-401'], description: 'Klasifikasi, klasterisasi, dan aturan asosiasi.' },
  { id: 'c16', code: 'SI-601', name: 'Manajemen Proyek TI', sks: 3, semester: 6, type: 'wajib', programId: 'si', prerequisites: ['SI-403'], description: 'Perencanaan, penjadwalan, risiko, dan tata kelola proyek TI.' },
  { id: 'c17', code: 'SI-603', name: 'Pemrosesan Bahasa Alami', sks: 3, semester: 6, type: 'pilihan', programId: 'ti', prerequisites: ['SI-501'], description: 'Tokenisasi, representasi teks, embedding, dan aplikasi NLP.' },
  { id: 'c18', code: 'SI-605', name: 'Keamanan Informasi', sks: 3, semester: 6, type: 'wajib', programId: 'si', prerequisites: ['SI-305'], description: 'Kriptografi terapan, kontrol akses, dan manajemen risiko.' },
  { id: 'c19', code: 'SI-701', name: 'Kerja Praktik', sks: 2, semester: 7, type: 'wajib', programId: 'si', prerequisites: ['SI-403'], description: 'Praktik kerja di industri minimal 30 hari kerja.' },
  { id: 'c20', code: 'SI-703', name: 'Capstone Project', sks: 4, semester: 7, type: 'wajib', programId: 'si', prerequisites: ['SI-403', 'SI-503'], description: 'Proyek terapan kelompok yang menyelesaikan masalah nyata.' },
  { id: 'c21', code: 'SI-705', name: 'Sistem Informasi Enterprise', sks: 3, semester: 7, type: 'pilihan', programId: 'si', prerequisites: ['SI-601'], description: 'ERP, integrasi sistem, dan arsitektur enterprise.' },
  { id: 'c22', code: 'SI-801', name: 'Tugas Akhir', sks: 6, semester: 8, type: 'wajib', programId: 'si', prerequisites: ['SI-701'], description: 'Penelitian mandiri dengan bimbingan dosen dan sidang akhir.' },
  { id: 'c23', code: 'SI-803', name: 'Etika Profesi', sks: 2, semester: 8, type: 'wajib', programId: 'si', prerequisites: [], description: 'Etika profesi bidang TI, HAKI, dan tanggung jawab profesional.' },
  { id: 'c24', code: 'SI-807', name: 'Komputasi Awan', sks: 3, semester: 8, type: 'pilihan', programId: 'ti', prerequisites: ['SI-305'], description: 'Model layanan awan, kontainerisasi, dan deployment.' },
]
