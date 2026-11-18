export default function ChartTooltip({ active, payload, label, unit = '', labelFormat }) {
  if (!active || !payload?.length) return null
  const heading = labelFormat ? labelFormat(label) : label

  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 shadow-lift">
      <p className="text-[12.5px] font-semibold text-ink">{heading}</p>
      <ul className="mt-1 space-y-0.5">
        {payload.map((item) => (
          <li key={item.dataKey} className="flex items-center gap-2 text-[12.5px] text-muted">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} aria-hidden />
            {item.name}: <span className="tabular font-semibold text-ink">{item.value}{unit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const axisProps = {
  stroke: 'var(--muted)',
  tick: { fill: 'var(--muted)', fontSize: 11.5 },
  tickLine: false,
  axisLine: false,
}

export const gridProps = {
  stroke: 'var(--line)',
  strokeDasharray: '3 6',
  vertical: false,
}
