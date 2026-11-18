import { RotateCw } from 'lucide-react'
import Button from './Button'
import DemoBadge from './DemoBadge'
import { relativeTime } from '@/utils/format'

export default function PageHeader({ title, subtitle, onRefresh, refreshedAt, loading, actions, showDemoBadge = true }) {
  return (
    <header className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-display-md text-ink">{title}</h1>
          {showDemoBadge ? <DemoBadge /> : null}
        </div>
        {subtitle ? <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{subtitle}</p> : null}
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        {actions}
        {onRefresh ? (
          <div className="flex items-center gap-2.5">
            {refreshedAt ? (
              <span className="hidden text-xs text-muted sm:inline">Diperbarui {relativeTime(refreshedAt)}</span>
            ) : null}
            <Button variant="secondary" size="sm" icon={RotateCw} onClick={onRefresh} disabled={loading}>
              {loading ? 'Memuat…' : 'Muat ulang'}
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  )
}
