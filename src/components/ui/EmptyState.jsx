import { Inbox } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Belum ada data',
  description = 'Data akan muncul di sini setelah mahasiswa mulai bertanya melalui Telegram.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-500/10 text-purple-500">
        <Icon size={22} strokeWidth={1.9} aria-hidden />
      </span>
      <p className="mt-4 font-display text-lg text-ink">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {actionLabel ? (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </div>
  )
}
