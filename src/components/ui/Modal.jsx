import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const width = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-lg'

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog" aria-modal="true" aria-label={title}
            className={`relative w-full ${width} rounded-t-xl2 bg-surface shadow-lift sm:rounded-xl2`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-6">
              <div>
                <h2 className="font-display text-xl text-ink">{title}</h2>
                {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
              </div>
              <button onClick={onClose} aria-label="Tutup"
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-ink/5 hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto scrollbar-slim px-6 py-5">{children}</div>
            {footer ? <div className="border-t border-line px-6 py-4">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
