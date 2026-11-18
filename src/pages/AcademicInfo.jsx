import { useState } from "react";
import { BookOpen, Clock, FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { CardGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAsync } from "@/hooks/useAsync";
import { getAcademicInfo } from "@/services/academicInfoService";
import { documents } from "@/data/documents";
import { categoryLabel } from "@/data/categories";

const docTitle = (id) =>
  documents.find((d) => d.id === id)?.title ?? "Dokumen sumber";

export default function AcademicInfo() {
  const [search, setSearch] = useState("");
  const { data, loading, error, refresh, refreshedAt } = useAsync(
    () => getAcademicInfo({ search }),
    [search],
  );

  return (
    <>
      <PageHeader
        title="Katalog Informasi Akademik"
        subtitle="Topik yang dapat dijawab ASCA beserta dokumen rujukannya."
        onRefresh={refresh}
        refreshedAt={refreshedAt}
        loading={loading}
        showDemoBadge
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari topik, misalnya “prasyarat” atau “capstone”…"
        onReset={() => setSearch("")}
      />

      <div className="mt-6">
        {loading ? (
          <CardGridSkeleton count={6} />
        ) : error ? (
          <ErrorState error={error} onRetry={refresh} />
        ) : !data?.length ? (
          <EmptyState
            icon={BookOpen}
            title="Topik tidak ditemukan"
            description="Coba kata kunci lain, atau bersihkan pencarian."
            actionLabel="Bersihkan pencarian"
            onAction={() => setSearch("")}
          />
        ) : (
          <div className="space-y-10">
            {data.map((group) => (
              <section key={group.id}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-display text-[22px] text-ink">
                    {group.title}
                  </h2>
                  <span className="tabular font-mono text-[12.5px] text-muted">
                    {group.items.length} topik
                  </span>
                </div>
                <p className="mt-1.5 text-[14px] text-muted">{group.summary}</p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((item) => (
                    <article
                      key={item.id}
                      className="card flex h-full flex-col p-5 transition-shadow duration-300 ease-calm hover:shadow-lift"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-[18px] leading-snug text-ink">
                          {item.title}
                        </h3>
                        <span className="shrink-0 rounded-full bg-purple-500/10 px-2.5 py-1 text-[11.5px] font-semibold text-purple-700 dark:text-purple-200">
                          {categoryLabel(item.categoryId)}
                        </span>
                      </div>

                      <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-muted">
                        {item.summary}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3.5 text-[12.5px] text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} aria-hidden /> {item.readMinutes}{" "}
                          menit baca
                        </span>
                        <span className="inline-flex items-center gap-1.5 truncate">
                          <FileText size={13} aria-hidden />{" "}
                          {docTitle(item.sourceDocId)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <p className="mt-10 rounded-card border border-line bg-surface px-5 py-4 text-[13px] leading-relaxed text-muted">
        Isi katalog ini adalah data contoh untuk prototipe. Pada penerapan
        sebenarnya, daftar topik dibangkitkan dari dokumen akademik resmi yang
        diunggah ke knowledge base.
      </p>
    </>
  );
}
