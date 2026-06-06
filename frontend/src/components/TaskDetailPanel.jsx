import { Link } from 'react-router-dom'
import { BookOpen, Calendar, Check, Clock, FileText, Pencil, RotateCcw, Trash2, X } from 'lucide-react'
import Button from './ui/Button'
import EmptyState from './EmptyState'
import PriorityBadge from './PriorityBadge'
import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'
import { formatDateTime } from '../utils/format'

export default function TaskDetailPanel({
  task,
  loading = false,
  toggling = false,
  deleting = false,
  className = '',
  onClose,
  onToggleDone,
  onDelete,
}) {
  if (!task) {
    return (
      <PanelFrame onClose={onClose} showClose={false} className={className}>
        <EmptyState
          icon={FileText}
          title="Pilih tugas untuk melihat detailnya."
          description="Klik salah satu tugas terdekat di dashboard."
        />
      </PanelFrame>
    )
  }

  const isDone = task.status_key === 'selesai' || task.is_done

  return (
    <PanelFrame onClose={onClose} className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-1.5 text-sm text-slate-400">
            <BookOpen size={15} className="shrink-0 text-violet-400" />
            <span className="truncate">{task.course}</span>
          </p>
          <h2 className="text-xl font-bold leading-snug text-white">{task.title}</h2>
        </div>
        <StatusBadge label={task.status_label} color={task.status_color} />
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-300">
        <div className="flex min-w-0 items-center gap-2">
          <Calendar size={16} className="shrink-0 text-indigo-400" />
          <span className="truncate">{formatDateTime(task.deadline)}</span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Clock size={16} className="shrink-0 text-pink-400" />
          <span className="truncate">{task.remaining_time_text}</span>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      <ProgressBar task={task} className="mt-5" />

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-white">Deskripsi</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-400">
          {task.description || 'Belum ada deskripsi.'}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link to={`/tasks/${task.id}/edit`} className="w-full">
          <Button variant="secondary" className="w-full">
            <Pencil size={16} /> Edit
          </Button>
        </Link>
        <Button loading={toggling || loading} onClick={onToggleDone} className="w-full">
          {isDone ? <RotateCcw size={16} /> : <Check size={16} />}
          {isDone ? 'Belum selesai' : 'Selesai'}
        </Button>
        <Button
          variant="danger"
          loading={deleting}
          onClick={onDelete}
          className="col-span-2 w-full"
        >
          <Trash2 size={16} /> Hapus
        </Button>
      </div>
    </PanelFrame>
  )
}

function PanelFrame({ children, onClose, showClose = true, className = '' }) {
  return (
    <aside className={`glass h-fit rounded-3xl border border-white/10 p-4 shadow-glow animate-fade-in sm:p-5 ${className}`}>
      {showClose && (
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="mb-4 ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>
      )}
        {children}
      </aside>
  )
}
