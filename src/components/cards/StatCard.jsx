import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { formatNumber } from '@/utils/format'

export default function StatCard({ label, value, delta, icon: Icon, hint, accent = 'purple' }) {
  const accents = {
    purple: 'text-purple-500 bg-purple-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    deep: 'text-purple-700 dark:text-purple-300 bg-purple-700/10',
  }
  const up = typeof delta === 'number' && delta >= 0
  const DeltaIcon = up ? ArrowUpRight : ArrowDownRight

  return (
    <article className="card group relative overflow-hidden p-5 transition-shadow duration-300 ease-calm hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-muted">{label}</p>
        {Icon ? (
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${accents[accent]}`}>
            <Icon size={17} strokeWidth={1.9} aria-hidden />
          </span>
        ) : null}
      </div>

      <p className="mt-3 font-mono text-[30px] font-medium leading-none tracking-tight tabular text-ink">
        {typeof value === 'number' ? formatNumber(value) : value}
      </p>

      <div className="mt-3 flex items-center gap-2 text-[12.5px]">
        {typeof delta === 'number' ? (
          <span className={`inline-flex items-center gap-0.5 font-semibold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            <DeltaIcon size={14} strokeWidth={2.4} aria-hidden />
            {Math.abs(delta)}%
          </span>
        ) : null}
        {hint ? <span className="text-muted">{hint}</span> : null}
      </div>
    </article>
  )
}
