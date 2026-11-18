import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Tabel data generik.
 * columns: [{ id, header, cell(row), className, width, align }]
 * Pada layar kecil tabel dapat digeser horizontal.
 */
export default function DataTable({ columns, rows, keyField = 'id', pagination, caption, onRowClick }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto scrollbar-slim">
        <table className="w-full min-w-[820px] border-collapse text-left">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-line bg-ink/[0.02] dark:bg-white/[0.02]">
              {columns.map((col) => (
                <th key={col.id} scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-5 py-3.5 text-[12.5px] font-semibold text-muted ${col.align === 'right' ? 'text-right' : ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row[keyField]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors duration-150 hover:bg-purple-500/[0.045] ${onRowClick ? 'cursor-pointer' : ''}`}>
                {columns.map((col) => (
                  <td key={col.id}
                    className={`px-5 py-4 align-top text-[13.5px] text-ink ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination ? <Pagination {...pagination} /> : null}
    </div>
  )
}

function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-3 border-t border-line px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-muted">
        Menampilkan <span className="tabular font-medium text-ink">{from}–{to}</span> dari{' '}
        <span className="tabular font-medium text-ink">{total}</span> interaksi
      </p>

      <div className="flex items-center gap-1">
        <PageButton onClick={() => onPageChange(page - 1)} disabled={page <= 1} label="Halaman sebelumnya">
          <ChevronLeft size={16} />
        </PageButton>

        {buildPages(page, totalPages).map((item, index) =>
          item === '…' ? (
            <span key={`gap-${index}`} className="px-1.5 text-sm text-muted">…</span>
          ) : (
            <button key={item} onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={`tabular h-8 min-w-8 rounded-lg px-2 text-[13px] font-medium transition-colors
                ${item === page ? 'bg-purple-500 text-white' : 'text-muted hover:bg-purple-500/10 hover:text-purple-600'}`}>
              {item}
            </button>
          ),
        )}

        <PageButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} label="Halaman berikutnya">
          <ChevronRight size={16} />
        </PageButton>
      </div>
    </div>
  )
}

function PageButton({ children, label, ...props }) {
  return (
    <button aria-label={label} {...props}
      className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors
        hover:bg-purple-500/10 hover:text-purple-600 disabled:opacity-35 disabled:hover:bg-transparent">
      {children}
    </button>
  )
}

function buildPages(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, '…', totalPages]
  if (page >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  return [1, '…', page - 1, page, page + 1, '…', totalPages]
}
