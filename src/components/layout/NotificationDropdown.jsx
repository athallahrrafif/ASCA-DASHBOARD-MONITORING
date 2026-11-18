import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Bot, Database, FileText, MessageSquareText, ThumbsDown } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getNotifications } from '@/services/notificationService'
import { relativeTime } from '@/utils/format'

const ICONS = {
  interaction: MessageSquareText,
  knowledge: Database,
  document: FileText,
  bot: Bot,
  feedback: ThumbsDown,
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState([])
  const wrapRef = useRef(null)
  const { data, loading } = useAsync(() => getNotifications(), [])

  const items = (data || []).filter((n) => !dismissed.includes(n.id))
  const unread = items.filter((n) => !n.read).length

  useEffect(() => {
    const onClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="relative" ref={wrapRef}>
      <button onClick={() => setOpen((v) => !v)}
        aria-expanded={open} aria-haspopup="true" aria-label={`Notifikasi${unread ? `, ${unread} belum dibaca` : ''}`}
        className="relative grid h-9 w-9 place-items-center rounded-xl border border-line text-muted
          transition-colors duration-200 hover:border-purple-300 hover:text-purple-600">
        <Bell size={16} strokeWidth={2} aria-hidden />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-purple-500 px-1
            font-mono text-[10px] font-medium text-white">{unread}</span>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.16 }}
            className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl2 border border-line bg-surface shadow-lift">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="font-display text-[16px] text-ink">Notifikasi</p>
              {items.length ? (
                <button onClick={() => setDismissed(items.map((n) => n.id))}
                  className="text-[12.5px] font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-300">
                  Bersihkan
                </button>
              ) : null}
            </div>

            <div className="max-h-[22rem] overflow-y-auto scrollbar-slim">
              {loading ? (
                <p className="px-4 py-6 text-center text-sm text-muted">Memuat notifikasi…</p>
              ) : items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted">Tidak ada notifikasi baru.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((item) => {
                    const Icon = ICONS[item.type] || Bell
                    return (
                      <li key={item.id} className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-purple-500/[0.045]">
                        <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg
                          ${item.read ? 'bg-ink/5 text-muted' : 'bg-purple-500/10 text-purple-500'}`}>
                          <Icon size={15} strokeWidth={1.9} aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
                          <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{item.message}</p>
                          <p className="mt-1 text-[11.5px] text-muted">{relativeTime(item.time)}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
