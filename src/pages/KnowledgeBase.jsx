import { useState } from 'react'
import { ArrowRight, Boxes, Database, FileStack, Layers } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import FilterBar from '@/components/ui/FilterBar'
import StatCard from '@/components/cards/StatCard'
import KnowledgeBaseCard from '@/components/cards/KnowledgeBaseCard'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { CardGridSkeleton, StatCardSkeleton } from '@/components/ui/LoadingSkeleton'
import { useAsync } from '@/hooks/useAsync'
import { getKnowledgeBase } from '@/services/knowledgeBaseService'
import { formatDate } from '@/utils/format'

const INITIAL = { search: '', status: 'all' }

export default function KnowledgeBase() {
  const [filters, setFilters] = useState(INITIAL)
  const { data, loading, error, refresh, refreshedAt } = useAsync(() => getKnowledgeBase(filters), [filters])

  const set = (key) => (value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const summary = data?.summary

  return (
    <>
      <PageHeader
        title="Knowledge Base"
        subtitle="Dokumen yang sudah diolah menjadi sumber jawaban chatbot."
        onRefresh={refresh} refreshedAt={refreshedAt} loading={loading}
      />

      {error ? <ErrorState error={error} onRetry={refresh} /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading || !summary ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />) : (
              <>
                <StatCard label="Dokumen terdaftar" value={summary.totalDocuments} icon={FileStack} />
                <StatCard label="Sudah terindeks" value={summary.indexedDocuments} icon={Database} accent="blue"
                  hint={`dari ${summary.totalDocuments} dokumen`} />
                <StatCard label="Total potongan" value={summary.totalChunks} icon={Layers} />
                <StatCard label="Vector store" value={summary.vectorStore} icon={Boxes} accent="blue"
                  hint={`chunk ${summary.chunkSize}/overlap ${summary.chunkOverlap}`} />
              </>
            )}
          </section>

          {/* Diagram alur pipeline — konsep, bukan proses yang berjalan di frontend */}
          <section className="mt-4 card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-[19px] text-ink">Alur pengolahan dokumen</h2>
                <p className="mt-1 text-[13px] text-muted">
                  Visualisasi konsep. Seluruh tahapan dijalankan di backend, bukan di browser.
                </p>
              </div>
              {summary ? (
                <p className="text-[12.5px] text-muted">Pengindeksan terakhir {formatDate(summary.lastIndexedAt)}</p>
              ) : null}
            </div>

            <ol className="mt-5 flex gap-3 overflow-x-auto scrollbar-slim pb-2">
              {(data?.pipeline || []).map((stage, index, all) => (
                <li key={stage.id} className="flex shrink-0 items-center gap-3">
                  <div className="w-[196px] rounded-card border border-line bg-canvas px-4 py-3.5">
                    <p className="font-mono text-[11.5px] text-muted">{String(index + 1).padStart(2, '0')}</p>
                    <p className="mt-1 font-display text-[16px] leading-snug text-ink">{stage.label}</p>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{stage.detail}</p>
                  </div>
                  {index < all.length - 1 ? (
                    <ArrowRight size={16} className="shrink-0 text-muted" aria-hidden />
                  ) : null}
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-6">
            <FilterBar
              search={filters.search} onSearchChange={set('search')}
              searchPlaceholder="Cari dokumen di knowledge base…"
              onReset={() => setFilters(INITIAL)}
              filters={[{
                id: 'status', label: 'Status', value: filters.status, onChange: set('status'),
                options: [
                  { value: 'all', label: 'Semua status' },
                  { value: 'indexed', label: 'Terindeks' },
                  { value: 'processing', label: 'Diproses' },
                  { value: 'stale', label: 'Perlu diperbarui' },
                ],
              }]}
            />
          </div>

          <div className="mt-4">
            {loading ? <CardGridSkeleton count={4} height="h-44" /> : !data?.entries?.length ? (
              <EmptyState icon={Database} title="Belum ada dokumen terindeks"
                description="Unggah dokumen akademik melalui backend agar dapat dipakai chatbot."
                actionLabel="Bersihkan filter" onAction={() => setFilters(INITIAL)} />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {data.entries.map((entry) => <KnowledgeBaseCard key={entry.id} entry={entry} />)}
              </div>
            )}
          </div>

          <p className="mt-8 rounded-card border border-line bg-surface px-5 py-4 text-[13px] leading-relaxed text-muted">
            Halaman ini disiapkan untuk kemungkinan judul penelitian berbasis Retrieval-Augmented Generation.
            Bila judul akhir tidak memakai RAG, halaman dapat dinonaktifkan tanpa memengaruhi halaman lain.
          </p>
        </>
      )}
    </>
  )
}
