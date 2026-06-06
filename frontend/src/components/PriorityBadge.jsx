import { Flag } from 'lucide-react'
import { PRIORITY_META } from '../utils/format'

export default function PriorityBadge({ priority = 'medium', className = '' }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.medium
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.class} ${className}`}
    >
      <Flag size={12} />
      {meta.label}
    </span>
  )
}
