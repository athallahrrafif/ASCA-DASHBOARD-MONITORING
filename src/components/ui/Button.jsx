import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-purple-500 text-white hover:bg-purple-600 border border-transparent shadow-sm',
  gradient: 'text-white border border-transparent shadow-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600',
  secondary: 'bg-surface text-ink border border-line hover:border-purple-300 hover:text-purple-600',
  ghost: 'bg-transparent text-muted border border-transparent hover:bg-purple-500/8 hover:text-purple-600',
  danger: 'bg-transparent text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-500/10',
}

const SIZES = {
  sm: 'text-[13px] px-3 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-[15px] px-6 py-3.5 gap-2.5 rounded-xl',
}

export default function Button({
  as = 'button', to, href, variant = 'primary', size = 'md',
  icon: Icon, iconRight: IconRight, className = '', children, ...props
}) {
  const classes = `inline-flex items-center justify-center font-semibold transition-all duration-200 ease-calm
    disabled:opacity-45 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  const content = (
    <>
      {Icon ? <Icon size={size === 'lg' ? 18 : 16} strokeWidth={2.1} aria-hidden /> : null}
      {children}
      {IconRight ? <IconRight size={size === 'lg' ? 18 : 16} strokeWidth={2.1} aria-hidden /> : null}
    </>
  )

  if (to) return <Link to={to} className={classes} {...props}>{content}</Link>
  if (href) return <a href={href} className={classes} target="_blank" rel="noreferrer noopener" {...props}>{content}</a>
  const Tag = as
  return <Tag className={classes} {...props}>{content}</Tag>
}
