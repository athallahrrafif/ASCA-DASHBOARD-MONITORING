import { Database, Hash } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { formatDate, formatNumber } from '@/utils/format'

export default function KnowledgeBaseCard({ entry }) {
  return (
    <article className="card p-5 transition-shadow duration-300 ease-calm hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
            <Database size={19} strokeWidth={1.9} aria-hidden />
          </span>
          <div>
            <h3 className="font-display text-[18px] leading-snug text-ink">{entry.name}</h3>
            <p className="mt-1 font-mono text-[12px] text-muted">{entry.embeddingModel} · {entry.dimensions}d</p>
          </div>
        </div>
        <StatusBadge status={entry.status} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 text-[13px] sm:grid-cols-4">
        <div>
          <dt className="text-muted">Potongan</dt>
          <dd className="tabular mt-0.5 flex items-center gap-1 font-semibold text-ink">
            <Hash size={12} className="text-muted" aria-hidden />{formatNumber(entry.chunks)}
          </dd>
        </div>
        <div><dt className="text-muted">Diunggah</dt><dd className="mt-0.5 font-medium text-ink">{formatDate(entry.uploadedAt)}</dd></div>
        <div><dt className="text-muted">Diperbarui</dt><dd className="mt-0.5 font-medium text-ink">{formatDate(entry.updatedAt)}</dd></div>
        <div><dt className="text-muted">Dipanggil</dt><dd className="tabular mt-0.5 font-semibold text-ink">{formatNumber(entry.retrievalHits)}</dd></div>
      </dl>
    </article>
  )
}
