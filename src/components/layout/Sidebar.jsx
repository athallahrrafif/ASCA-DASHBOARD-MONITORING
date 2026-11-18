import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send } from 'lucide-react'
import Logo from './Logo'
import { navGroups } from './navigation'
import { env, getTelegramUrl } from '@/config/env'

function NavItems({ onNavigate }) {
  return (
    <nav className="flex-1 overflow-y-auto scrollbar-slim px-3 py-4" aria-label="Navigasi utama">
      {navGroups.map((group) => (
        <div key={group.id} className="mb-5 last:mb-0">
          <p className="px-3 pb-2 text-[11.5px] font-semibold text-muted">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} onClick={onNavigate}
                  className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium
                    transition-colors duration-200 ${isActive
                      ? 'bg-purple-500/10 text-purple-700 dark:text-purple-200'
                      : 'text-muted hover:bg-ink/[0.04] hover:text-ink dark:hover:bg-white/[0.04]'}`}>
                  {({ isActive }) => (
                    <>
                      <span aria-hidden className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-purple-500
                        transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                      <Icon size={17} strokeWidth={1.9} aria-hidden />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function TelegramFooter() {
  const url = getTelegramUrl()

  return (
    <div className="border-t border-line p-3">
      <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-4 text-white">
        <p className="font-display text-[15px] leading-snug">Chatbot berada di Telegram</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-white/80">
          Dashboard ini hanya memantau. Pertanyaan dijawab di {env.telegramBotUsername}.
        </p>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer noopener"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-[13px] font-semibold
              backdrop-blur transition-colors hover:bg-white/25">
            <Send size={14} aria-hidden /> Buka Telegram
          </a>
        ) : (
          <p className="mt-3 text-[12px] text-white/70">Atur VITE_TELEGRAM_BOT_URL untuk mengaktifkan tautan.</p>
        )}
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop: sidebar permanen */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-line px-5"><Logo /></div>
        <NavItems />
        <TelegramFooter />
      </aside>

      {/* Mobile: drawer */}
      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.aside
              className="relative flex h-full w-[276px] flex-col border-r border-line bg-surface"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Menu navigasi">
              <div className="flex h-16 items-center justify-between border-b border-line px-5">
                <Logo />
                <button onClick={onClose} aria-label="Tutup menu"
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-ink/5 hover:text-ink">
                  <X size={18} />
                </button>
              </div>
              <NavItems onNavigate={onClose} />
              <TelegramFooter />
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
