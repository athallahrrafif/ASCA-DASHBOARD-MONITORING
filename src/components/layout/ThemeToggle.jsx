import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const Icon = theme === 'dark' ? Sun : Moon

  return (
    <button onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Gunakan tampilan terang' : 'Gunakan tampilan gelap'}
      className="grid h-9 w-9 place-items-center rounded-xl border border-line text-muted
        transition-colors duration-200 hover:border-purple-300 hover:text-purple-600">
      <Icon size={16} strokeWidth={2} aria-hidden />
    </button>
  )
}
