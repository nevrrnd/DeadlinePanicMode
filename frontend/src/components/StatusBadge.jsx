import { STATUS_STYLES } from '../utils/format'

export default function StatusBadge({ label, color = 'gray', className = '' }) {
  const style = STATUS_STYLES[color] || STATUS_STYLES.gray
  // Urgent states get an attention-grabbing pulse.
  const urgent = color === 'red' || color === 'orange'

  return (
    <span
      className={`inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none backdrop-blur-sm sm:text-xs ${style} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {urgent && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="truncate">{label}</span>
    </span>
  )
}
