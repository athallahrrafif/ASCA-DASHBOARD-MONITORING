const TONES = {
  success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20',
  warning: 'bg-amber-500/12 text-amber-700 dark:text-amber-300 ring-amber-500/25',
  danger: 'bg-red-500/10 text-red-700 dark:text-red-300 ring-red-500/20',
  info: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-200 ring-purple-500/20',
  neutral: 'bg-ink/5 text-muted ring-line',
}

const PRESETS = {
  answered: { tone: 'success', label: 'Terjawab' },
  partial: { tone: 'warning', label: 'Sebagian' },
  unanswered: { tone: 'danger', label: 'Belum terjawab' },
  online: { tone: 'success', label: 'Online' },
  offline: { tone: 'danger', label: 'Offline' },
  active: { tone: 'success', label: 'Aktif' },
  archived: { tone: 'neutral', label: 'Arsip' },
  review: { tone: 'warning', label: 'Tinjauan' },
  indexed: { tone: 'success', label: 'Terindeks' },
  processing: { tone: 'info', label: 'Diproses' },
  stale: { tone: 'warning', label: 'Perlu diperbarui' },
  wajib: { tone: 'purple', label: 'Wajib' },
  pilihan: { tone: 'info', label: 'Pilihan' },
  positive: { tone: 'success', label: 'Positif' },
  negative: { tone: 'danger', label: 'Negatif' },
}

export default function StatusBadge({ status, tone, label, dot = false, className = '' }) {
  const preset = PRESETS[status] || {}
  const finalTone = tone || preset.tone || 'neutral'
  const finalLabel = label || preset.label || status

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold
      ring-1 ring-inset ${TONES[finalTone]} ${className}`}>
      {dot ? <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span> : null}
      {finalLabel}
    </span>
  )
}
