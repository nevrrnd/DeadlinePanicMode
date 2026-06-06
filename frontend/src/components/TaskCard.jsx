import { Link } from 'react-router-dom'
import { BookOpen, Calendar, Clock, Eye, Pencil, Trash2, Check, RotateCcw } from 'lucide-react'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import ProgressBar from './ProgressBar'
import Button from './ui/Button'
import { formatDateTime } from '../utils/format'

export default function TaskCard({ task, onToggleDone, onDelete, toggling = false }) {
  const isDone = task.status_key === 'selesai'

  return (
    <div className="glass flex h-full flex-col gap-4 rounded-2xl p-4 transition hover:border-white/10 hover:shadow-glow sm:p-5 animate-fade-in">
      {/* Header: title + badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={`line-clamp-2 text-base font-semibold leading-snug sm:text-lg ${
              isDone ? 'text-slate-400 line-through' : 'text-white'
            }`}
          >
            {task.title}
          </h3>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-slate-400">
            <BookOpen size={14} className="shrink-0 text-violet-400" />
            <span className="truncate">{task.course}</span>
          </p>
        </div>
        <StatusBadge label={task.status_label} color={task.status_color} />
      </div>

      {task.description && (
        <p className="line-clamp-2 text-sm text-slate-400">{task.description}</p>
      )}

      {/* Meta: deadline + remaining */}
      <div className="grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <Calendar size={14} className="shrink-0 text-indigo-400" />
          <span className="truncate">{formatDateTime(task.deadline)}</span>
        </span>
        <span className="flex min-w-0 items-center gap-1.5 font-medium text-slate-300">
          <Clock size={14} className="shrink-0 text-pink-400" />
          <span className="truncate">{task.remaining_time_text}</span>
        </span>
        <div className="sm:col-span-2">
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      <ProgressBar task={task} />

      {/* Actions */}
      <div className="mt-auto grid grid-cols-2 gap-2 pt-1 sm:flex sm:flex-wrap sm:items-center">
        <Button
          size="sm"
          variant={isDone ? 'secondary' : 'primary'}
          loading={toggling}
          className="w-full sm:w-auto"
          onClick={() => onToggleDone?.(task)}
        >
          {isDone ? <RotateCcw size={15} /> : <Check size={15} />}
          {isDone ? 'Buka lagi' : 'Selesai'}
        </Button>
        <Link to={`/tasks/${task.id}`} className="w-full sm:w-auto">
          <Button size="sm" variant="ghost" className="w-full sm:w-auto">
            <Eye size={15} /> Detail
          </Button>
        </Link>
        <Link to={`/tasks/${task.id}/edit`} className="w-full sm:w-auto">
          <Button size="sm" variant="ghost" className="w-full sm:w-auto">
            <Pencil size={15} /> Edit
          </Button>
        </Link>
        <Button size="sm" variant="ghost" className="w-full text-red-300 hover:bg-red-500/10 sm:w-auto" onClick={() => onDelete?.(task)}>
          <Trash2 size={15} /> Hapus
        </Button>
      </div>
    </div>
  )
}
