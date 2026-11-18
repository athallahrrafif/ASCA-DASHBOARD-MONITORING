/**
 * DUMMY DATA status knowledge base.
 * Halaman ini hanya memvisualisasikan konsep; tidak ada pipeline RAG di frontend.
 */
export const knowledgeBaseEntries = [
  { id: 'kb-1', documentId: 'doc-1', name: 'Panduan Akademik', categoryId: 'panduan-akademik', uploadedAt: '2026-07-04', updatedAt: '2026-09-10', status: 'indexed', chunks: 248, embeddingModel: 'text-embedding-3-small', dimensions: 1536, retrievalHits: 1842 },
  { id: 'kb-2', documentId: 'doc-2', name: 'Panduan Tugas Akhir', categoryId: 'ta', uploadedAt: '2026-07-04', updatedAt: '2026-08-28', status: 'indexed', chunks: 137, embeddingModel: 'text-embedding-3-small', dimensions: 1536, retrievalHits: 964 },
  { id: 'kb-3', documentId: 'doc-3', name: 'Panduan Kerja Praktik', categoryId: 'kp', uploadedAt: '2026-07-05', updatedAt: '2026-08-14', status: 'indexed', chunks: 96, embeddingModel: 'text-embedding-3-small', dimensions: 1536, retrievalHits: 713 },
  { id: 'kb-4', documentId: 'doc-4', name: 'Panduan Capstone Project', categoryId: 'capstone', uploadedAt: '2026-07-05', updatedAt: '2026-09-02', status: 'indexed', chunks: 112, embeddingModel: 'text-embedding-3-small', dimensions: 1536, retrievalHits: 1126 },
  { id: 'kb-5', documentId: 'doc-5', name: 'Kurikulum Program Studi SI', categoryId: 'mata-kuliah', uploadedAt: '2026-07-19', updatedAt: '2026-07-19', status: 'indexed', chunks: 184, embeddingModel: 'text-embedding-3-small', dimensions: 1536, retrievalHits: 1391 },
  { id: 'kb-6', documentId: 'doc-6', name: 'Prosedur Administrasi Mahasiswa', categoryId: 'administrasi', uploadedAt: '2026-07-01', updatedAt: '2026-06-30', status: 'indexed', chunks: 58, embeddingModel: 'text-embedding-3-small', dimensions: 1536, retrievalHits: 402 },
  { id: 'kb-7', documentId: 'doc-8', name: 'Panduan Pengisian KRS', categoryId: 'krs', uploadedAt: '2026-09-15', updatedAt: '2026-09-15', status: 'processing', chunks: 0, embeddingModel: 'text-embedding-3-small', dimensions: 1536, retrievalHits: 0 },
  { id: 'kb-8', documentId: 'doc-7', name: 'Kalender Akademik 2025/2026', categoryId: 'krs', uploadedAt: '2025-08-01', updatedAt: '2025-08-01', status: 'stale', chunks: 24, embeddingModel: 'text-embedding-3-small', dimensions: 1536, retrievalHits: 88 },
]

export const knowledgeBaseSummary = {
  totalDocuments: 8,
  indexedDocuments: 6,
  totalChunks: 859,
  lastIndexedAt: '2026-09-10',
  vectorStore: 'pgvector',
  chunkSize: 800,
  chunkOverlap: 120,
}

/** Tahapan pipeline — ditampilkan sebagai diagram konsep, bukan proses berjalan. */
export const pipelineStages = [
  { id: 'document', label: 'Dokumen', detail: 'PDF panduan akademik diunggah oleh pengelola.' },
  { id: 'extraction', label: 'Ekstraksi teks', detail: 'Isi dokumen diubah menjadi teks polos.' },
  { id: 'chunking', label: 'Pemecahan', detail: '800 karakter per potongan, tumpang tindih 120.' },
  { id: 'embedding', label: 'Embedding', detail: 'Setiap potongan diubah menjadi vektor 1.536 dimensi.' },
  { id: 'vector', label: 'Vector database', detail: 'Vektor disimpan beserta metadata sumber.' },
  { id: 'retrieval', label: 'Retrieval', detail: 'Potongan paling relevan diambil saat ada pertanyaan.' },
  { id: 'telegram', label: 'Chatbot Telegram', detail: 'Jawaban dirangkai dan dikirim ke mahasiswa.' },
]
