/** Kategori kanonik ASCA. Dipakai oleh filter, chart, dan katalog informasi. */
export const CATEGORIES = [
  { id: "krs", label: "KRS", topic: "krs", color: "#6D4AFF" },
  { id: "mata-kuliah", label: "Mata Kuliah", topic: "krs", color: "#8A6BFF" },
  { id: "ta", label: "TA", topic: "administration", color: "#4B32A8" },
  { id: "kp", label: "KP", topic: "administration", color: "#3B82F6" },
  {
    id: "capstone",
    label: "Capstone",
    topic: "administration",
    color: "#2563EB",
  },
  {
    id: "administrasi",
    label: "Administrasi",
    topic: "administration",
    color: "#60A5FA",
  },
  {
    id: "panduan-akademik",
    label: "Panduan Akademik",
    topic: "rag",
    color: "#A791FF",
  },
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id);
export const categoryLabel = (id) =>
  categoryById(id)?.label ??
  ({
    lainnya: "Lainnya",
    "belum-dikategorikan": "Belum Dikategorikan",
    "kalender-akademik": "Kalender Akademik",
  }[id] ||
    id);
export const categoryColor = (id) => categoryById(id)?.color ?? "#6D4AFF";
