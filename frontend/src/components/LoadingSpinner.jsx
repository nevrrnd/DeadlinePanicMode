import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label, size = 28, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-3 text-slate-400 ${className}`}>
      <Loader2 size={size} className="animate-spin text-violet-400" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  )
}
