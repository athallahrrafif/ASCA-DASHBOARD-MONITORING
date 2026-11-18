/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F5EF',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        canvas: 'rgb(var(--canvas-rgb) / <alpha-value>)',
        raised: 'rgb(var(--raised-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        muted: 'rgb(var(--muted-rgb) / <alpha-value>)',
        purple: {
          50: '#F1EDFF',
          100: '#E3DBFF',
          200: '#C8B9FF',
          300: '#A791FF',
          400: '#8A6BFF',
          500: '#6D4AFF',
          600: '#5B3BE0',
          700: '#4B32A8',
          800: '#372578',
          900: '#241A4D',
        },
        blue: {
          100: '#DBEAFE',
          200: '#BFDBFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-lg': ['clamp(2.5rem, 5.2vw, 4rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.9rem, 3.4vw, 2.6rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
      },
      borderRadius: {
        card: '18px',
        xl2: '26px',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
