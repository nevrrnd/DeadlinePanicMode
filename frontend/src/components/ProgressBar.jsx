import { getDeadlineMeter, progressColor } from '../utils/format'

export default function ProgressBar({ progress = 0, task = null, showLabel = true, className = '' }) {
  const meter = task ? getDeadlineMeter(task) : null
  const value = meter ? meter.value : Math.min(100, Math.max(0, progress))
  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
          <span>{meter ? 'Panic Meter' : 'Deadline Meter'}</span>
          <span className="font-semibold text-slate-200">{value}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${meter?.color || progressColor(value)} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
