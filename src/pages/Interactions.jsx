import { useEffect, useState } from "react";
import { MessageSquareText, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Modal from "@/components/ui/Modal";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAsync, usePolling } from "@/hooks/useAsync";
import { getInteractions } from "@/services/interactionService";
import { formatDateTime } from "@/utils/format";

const PAGE_SIZE = 10;
const AUTO_REFRESH_MS = 15_000; // Auto-refresh data setiap 15 detik.
// Pilihan kategori berdasarkan enam intent dalam laporan Capstone.
// Gunakan key yang dikenali backend; nilai historis lain tetap terlihat
// pada tabel, tanpa dipaksa menjadi salah satu dari enam kelas.
const INTENT_OPTIONS = [
  { value: "all", label: "Semua intent" },
  { value: "definition", label: "Pengertian" },
  { value: "procedure", label: "Prosedur" },
  { value: "requirements", label: "Persyaratan" },
  { value: "schedule", label: "Jadwal" },
  { value: "consequence", label: "Konsekuensi" },
  { value: "general", label: "Umum" },
  { value: "belum-dikategorikan", label: "Belum terklasifikasi" },
];

// Samakan warna dengan Dashboard dan Analytics.
const INTENT_COLORS = {
  definition: "#6D4AFF",
  procedure: "#3B82F6",
  requirements: "#14B8A6",
  schedule: "#F59E0B",
  consequence: "#EC4899",
  general: "#64748B",
};

const INTENT_LABELS = {
  definition: "Pengertian",
  procedure: "Prosedur",
  requirements: "Persyaratan",
  schedule: "Jadwal",
  consequence: "Konsekuensi",
  general: "Umum",
  "belum-dikategorikan": "Belum terklasifikasi",
  "belum-terklasifikasi": "Belum terklasifikasi",
};

function intentColor(intentId) {
  return INTENT_COLORS[String(intentId ?? "").toLowerCase()] ?? "#94A3B8";
}

function intentLabel(row) {
  const id = String(row?.categoryId ?? "")
    .trim()
    .toLowerCase();
  // Untuk intent historis, utamakan label asli yang dikirim backend.
  const savedLabel = String(row?.category ?? row?.intent ?? "").trim();
  return INTENT_LABELS[id] ?? (savedLabel || id || "Belum terklasifikasi");
}

const INITIAL = {
  search: "",
  categoryId: "all",
  from: "",
  to: "",
};

export default function Interactions() {
  const [filters, setFilters] = useState(INITIAL);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, meta, loading, error, refresh, refreshedAt } = useAsync(
    () => getInteractions({ ...filters, page, pageSize: PAGE_SIZE }),
    [filters, page],
  );

  // Meminta data terbaru untuk filter dan halaman yang sedang dipilih.
  usePolling(refresh, AUTO_REFRESH_MS);

  const set = (key) => (value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const columns = [
    {
      id: "date",
      header: "Tanggal",
      width: "160px",
      cell: (row) => (
        <span className="tabular whitespace-nowrap text-muted">
          {formatDateTime(row.timestamp)}
        </span>
      ),
    },
    {
      id: "question",
      header: "Pertanyaan",
      cell: (row) => (
        <span className="block max-w-[720px] break-words text-ink">
          {row.question}
        </span>
      ),
    },
    {
      id: "category",
      header: "Kategori intent",
      width: "185px",
      cell: (row) => (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: intentColor(row.categoryId) }}
            aria-hidden
          />
          <span className="break-words">{intentLabel(row)}</span>
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: "150px",
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Data Interaksi"
        subtitle="Catatan pertanyaan mahasiswa yang masuk melalui chatbot Telegram."
        onRefresh={refresh}
        refreshedAt={refreshedAt}
        loading={loading}
      />

      <div className="mb-4 flex items-start gap-2.5 rounded-card border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3">
        <ShieldCheck
          size={16}
          className="mt-0.5 shrink-0 text-blue-500"
          aria-hidden
        />
        <p className="text-[13px] leading-relaxed text-muted">
          Identitas mahasiswa tidak pernah ditampilkan pada halaman pemantauan.
        </p>
      </div>

      <FilterBar
        search={filters.search}
        onSearchChange={set("search")}
        searchPlaceholder="Cari pertanyaan…"
        onReset={() => setFilters(INITIAL)}
        filters={[
          {
            id: "category",
            label: "Intent",
            value: filters.categoryId,
            onChange: set("categoryId"),
            options: INTENT_OPTIONS,
          },
          {
            id: "from",
            label: "Dari",
            type: "date",
            value: filters.from,
            onChange: set("from"),
          },
          {
            id: "to",
            label: "Sampai",
            type: "date",
            value: filters.to,
            onChange: set("to"),
          },
        ]}
      />

      <div className="mt-4">
        {loading && !data ? (
          <TableSkeleton rows={PAGE_SIZE} />
        ) : error ? (
          <ErrorState error={error} onRetry={refresh} />
        ) : !data?.length ? (
          <EmptyState
            icon={MessageSquareText}
            title="Tidak ada data interaksi"
            description="Tidak ada pertanyaan yang cocok dengan filter saat ini."
            actionLabel="Bersihkan filter"
            onAction={() => setFilters(INITIAL)}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={data}
            caption="Daftar interaksi mahasiswa dengan chatbot ASCA di Telegram"
            onRowClick={setDetail}
            pagination={{
              page,
              totalPages: meta?.totalPages ?? 1,
              total: meta?.total ?? 0,
              pageSize: PAGE_SIZE,
              onPageChange: setPage,
            }}
          />
        )}
      </div>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title="Detail interaksi"
        description={detail ? formatDateTime(detail.timestamp) : ""}
      >
        {detail ? (
          <div className="space-y-4">
            <div>
              <p className="text-[12.5px] font-semibold text-muted">
                Pertanyaan
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink">
                {detail.question}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 border-t border-line pt-4 text-[13.5px]">
              <div>
                <dt className="text-muted">Kategori intent</dt>
                <dd className="mt-0.5 font-semibold text-ink">
                  {intentLabel(detail)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={detail.status} />
                </dd>
              </div>
              <div>
                <dt className="text-muted">Waktu respons</dt>
                <dd className="tabular mt-0.5 font-semibold text-ink">
                  {detail.responseTimeMs == null ||
                  !Number.isFinite(Number(detail.responseTimeMs))
                    ? "Belum tercatat"
                    : `${(Number(detail.responseTimeMs) / 1000).toFixed(2)} detik`}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Kanal</dt>
                <dd className="mt-0.5 font-semibold capitalize text-ink">
                  {detail.channel}
                </dd>
              </div>
            </dl>
            <div className="border-t border-line pt-4">
              <p className="text-[12.5px] font-semibold text-muted">
                Dokumen sumber jawaban
              </p>
              <p className="mt-1 text-[13.5px] text-ink">{detail.source}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
