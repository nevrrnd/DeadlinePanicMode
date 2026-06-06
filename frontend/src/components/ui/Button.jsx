import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'btn-gradient text-white shadow-glow hover:shadow-lg focus:ring-violet-500',
  secondary:
    'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 focus:ring-slate-500',
  danger:
    'bg-red-500/90 text-white hover:bg-red-500 focus:ring-red-500',
  ghost:
    'bg-transparent text-slate-300 hover:bg-white/5 focus:ring-slate-500',
  outline:
    'bg-transparent text-violet-300 border border-violet-500/40 hover:bg-violet-500/10 focus:ring-violet-500',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-panic-bg disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
