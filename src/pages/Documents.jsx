import { useState } from "react";
import { FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import DocumentCard from "@/components/cards/DocumentCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import { CardGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAsync } from "@/hooks/useAsync";
import { getDocuments } from "@/services/documentService";
import { CATEGORIES } from "@/data/categories";
import { knowledgeBaseEntries } from "@/data/knowledgeBase";
import { formatDate } from "@/utils/format";

const INITIAL = { search: "", status: "all", categoryId: "all" };

export default function Documents() {
  const [filters, setFilters] = useState(INITIAL);
  const [detail, setDetail] = useState(null);
  const { data, loading, error, refresh, refreshedAt } = useAsync(
    () => getDocuments(filters),
    [filters],
  );

  const set = (key) => (value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const kbEntry = detail
    ? knowledgeBaseEntries.find((e) => e.documentId === detail.id)
    : null;

  return (
    <>
      <PageHeader
        title="Dokumen"
        subtitle="Berkas akademik yang menjadi sumber jawaban ASCA."
        onRefresh={refresh}
        refreshedAt={refreshedAt}
        loading={loading}
      />

      <FilterBar
        search={filters.search}
        onSearchChange={set("search")}
        searchPlaceholder="Cari judul dokumen…"
        onReset={() => setFilters(INITIAL)}
        filters={[
          {
            id: "status",
            label: "Status",
            value: filters.status,
            onChange: set("status"),
            options: [
              { value: "all", label: "Semua status" },
              { value: "active", label: "Aktif" },
              { value: "review", label: "Tinjauan" },
              { value: "archived", label: "Arsip" },
            ],
          },
          {
            id: "category",
            label: "Kategori",
            value: filters.categoryId,
            onChange: set("categoryId"),
            options: [
              { value: "all", label: "Semua kategori" },
              ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
            ],
          },
        ]}
      />

      <div className="mt-4">
        {loading ? (
          <CardGridSkeleton count={6} height="h-52" />
        ) : error ? (
          <ErrorState error={error} onRetry={refresh} />
        ) : !data?.length ? (
          <EmptyState
            icon={FileText}
            title="Dokumen tidak ditemukan"
            description="Tidak ada dokumen yang cocok dengan filter ini."
            actionLabel="Bersihkan filter"
            onAction={() => setFilters(INITIAL)}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onOpen={setDetail} />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.title ?? ""}
        description={detail ? `${detail.category} · ${detail.owner}` : ""}
      >
        {detail ? (
          <div className="space-y-5">
            <dl className="grid grid-cols-2 gap-4 text-[13.5px]">
              <div>
                <dt className="text-muted">Tahun</dt>
                <dd className="tabular mt-0.5 font-semibold text-ink">
                  {detail.year}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Halaman</dt>
                <dd className="tabular mt-0.5 font-semibold text-ink">
                  {detail.pages}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Versi</dt>
                <dd className="mt-0.5 font-mono text-[12.5px] text-ink">
                  {detail.version}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Ukuran</dt>
                <dd className="tabular mt-0.5 font-semibold text-ink">
                  {detail.sizeMb} MB
                </dd>
              </div>
              <div>
                <dt className="text-muted">Diperbarui</dt>
                <dd className="mt-0.5 font-semibold text-ink">
                  {formatDate(detail.updatedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={detail.status} />
                </dd>
              </div>
            </dl>

            <div className="border-t border-line pt-4">
              <p className="text-[12.5px] font-semibold text-muted">
                Status di knowledge base
              </p>
              {kbEntry ? (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[13.5px] text-ink">
                  <StatusBadge status={kbEntry.status} />
                  <span className="tabular font-mono text-[12.5px] text-muted">
                    {kbEntry.chunks} potongan
                  </span>
                  <span className="tabular font-mono text-[12.5px] text-muted">
                    {kbEntry.retrievalHits} kali dipanggil
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-[13.5px] text-muted">
                  Dokumen ini belum terdaftar di knowledge base.
                </p>
              )}
            </div>

            <p className="rounded-xl bg-ink/[0.03] px-4 py-3 text-[12.5px] leading-relaxed text-muted dark:bg-white/[0.04]">
              Pratinjau berkas belum tersedia pada prototipe. Pada versi
              terhubung backend, tombol unduh akan mengarah ke penyimpanan
              dokumen resmi.
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
