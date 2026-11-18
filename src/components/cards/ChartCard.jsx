import DemoBadge from '../ui/DemoBadge'

export default function ChartCard({ title, subtitle, children, action, footnote, className = '' }) {
  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-[19px] leading-tight text-ink">{title}</h2>
          {subtitle ? <p className="mt-1 text-[13px] text-muted">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <DemoBadge compact />
        </div>
      </div>
      <div className="mt-5">{children}</div>
      {footnote ? <p className="mt-3 text-xs text-muted">{footnote}</p> : null}
    </section>
  )
}
