export function Skeleton({ className = '', ...props }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-ink/[0.07] dark:bg-white/[0.07] ${className}`} {...props} />
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="mt-4 h-9 w-32" />
      <Skeleton className="mt-3 h-3 w-20" />
    </div>
  )
}

export function ChartSkeleton({ height = 260 }) {
  return (
    <div className="card p-5">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="mt-2 h-3 w-64" />
      <Skeleton className="mt-6 w-full" style={{ height }} />
    </div>
  )
}

export function TableSkeleton({ rows = 6, cols = 6 }) {
  return (
    <div className="card overflow-hidden">
      <div className="hairline px-5 py-4"><Skeleton className="h-4 w-40" /></div>
      <div className="divide-y divide-line">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 px-5 py-4">
            {Array.from({ length: cols }).map((__, c) => (
              <Skeleton key={c} className={`h-4 ${c === 2 ? 'flex-[3]' : 'flex-1'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridSkeleton({ count = 6, height = 'h-40' }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className={`${height} rounded-card`} />)}
    </div>
  )
}

export default Skeleton
