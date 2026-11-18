import { Search, X } from 'lucide-react'

/**
 * Bar filter generik. Setiap filter dideskripsikan sebagai data sehingga
 * halaman tidak perlu menyusun markup-nya sendiri.
 */
export default function FilterBar({ search, onSearchChange, searchPlaceholder = 'Cari…', filters = [], onReset, dense = false }) {
  const hasActive = (search && search.length > 0) ||
    filters.some((f) => f.value && f.value !== 'all' && f.value !== '')

  return (
    <div className={`card flex flex-col gap-3 ${dense ? 'p-3' : 'p-4'} lg:flex-row lg:items-center`}>
      {onSearchChange ? (
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="field pl-9"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2.5">
        {filters.map((filter) => (
          filter.type === 'date' ? (
            <label key={filter.id} className="flex items-center gap-2 text-[13px] text-muted">
              <span className="whitespace-nowrap">{filter.label}</span>
              <input
                type="date" value={filter.value} onChange={(e) => filter.onChange(e.target.value)}
                className="field w-[150px] py-1.5" aria-label={filter.label}
              />
            </label>
          ) : (
            <select
              key={filter.id} value={filter.value} onChange={(e) => filter.onChange(e.target.value)}
              aria-label={filter.label}
              className="field w-auto min-w-[136px] cursor-pointer py-2"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )
        ))}

        {hasActive && onReset ? (
          <button onClick={onReset}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-medium text-purple-600 transition-colors hover:bg-purple-500/10 dark:text-purple-300">
            <X size={14} strokeWidth={2.4} aria-hidden /> Bersihkan
          </button>
        ) : null}
      </div>
    </div>
  )
}
