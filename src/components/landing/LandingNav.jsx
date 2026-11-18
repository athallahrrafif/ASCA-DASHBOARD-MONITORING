import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import Logo from '../layout/Logo'
import ThemeToggle from '../layout/ThemeToggle'
import Button from '../ui/Button'
import { getTelegramUrl } from '@/config/env'

const LINKS = [
  { href: '#tentang', label: 'Tentang' },
  { href: '#cara-kerja', label: 'Cara kerja' },
  { href: '#cakupan', label: 'Cakupan informasi' },
]

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const telegramUrl = getTelegramUrl()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-300
      ${scrolled ? 'border-line bg-canvas/85 backdrop-blur-md' : 'border-transparent bg-transparent'}`}>
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-6 px-5 sm:px-8">
        <Logo />

        <nav className="ml-4 hidden flex-1 items-center gap-7 md:flex" aria-label="Bagian halaman">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}
              className="text-[14px] font-medium text-muted transition-colors hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <ThemeToggle />
          <Link to="/dashboard"
            className="hidden rounded-xl border border-line px-3.5 py-2 text-[13.5px] font-semibold text-ink
              transition-colors hover:border-purple-300 hover:text-purple-600 sm:inline-flex">
            Dashboard
          </Link>
          {telegramUrl ? (
            <Button href={telegramUrl} variant="gradient" size="sm" icon={Send}>Buka di Telegram</Button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
