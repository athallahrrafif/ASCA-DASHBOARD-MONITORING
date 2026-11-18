import { FileText, Layers } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { formatDate } from '@/utils/format'

export default function DocumentCard({ document, onOpen }) {
  return (
    <article className="card flex h-full flex-col p-5 transition-shadow duration-300 ease-calm hover:shadow-lift">
      <div className="flex items-start gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
          <FileText size={19} strokeWidth={1.9} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[18px] leading-snug text-ink">{document.title}</h3>
          <p className="mt-1 text-[13px] text-muted">{document.category} · {document.owner}</p>
        </div>
        <StatusBadge status={document.status} />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-[13px]">
        <div><dt className="text-muted">Tahun</dt><dd className="tabular mt-0.5 font-semibold text-ink">{document.year}</dd></div>
        <div><dt className="text-muted">Halaman</dt><dd className="tabular mt-0.5 font-semibold text-ink">{document.pages}</dd></div>
        <div><dt className="text-muted">Versi</dt><dd className="mt-0.5 font-mono text-[12.5px] font-medium text-ink">{document.version}</dd></div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
          <Layers size={13} aria-hidden /> Diperbarui {formatDate(document.updatedAt)}
        </p>
        {onOpen ? (
          <button onClick={() => onOpen(document)}
            className="text-[13px] font-semibold text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-300">
            Lihat detail
          </button>
        ) : null}
      </div>
    </article>
  )
}
