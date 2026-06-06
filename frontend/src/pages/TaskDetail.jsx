import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, BookOpen, Calendar, Clock, Pencil, Trash2, Check, RotateCcw, AlignLeft,
} from 'lucide-react'
import { TaskService } from '../services/tasks'
import { useToast } from '../context/ToastContext'
import { extractError } from '../lib/api'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import ProgressBar from '../components/ProgressBar'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/ui/Button'
import { formatDateTime, panicMessage } from '../utils/format'
import { addRecentActivity } from '../utils/recentActivity'

export default function TaskDetail() {
  const { id } = useParams()
  const toast = useToast()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    TaskService.get(id)
      .then((loadedTask) => {
        setTask(loadedTask)
        addRecentActivity(loadedTask, 'Baru dibuka')
      })
      .catch((err) => {
        toast.error(extractError(err, 'Tugas tidak ditemukan.'))
        navigate('/tasks')
      })
      .finally(() => setLoading(false))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = async () => {
    setToggling(true)
    try {
      const updated = await TaskService.toggleDone(id)
      setTask(updated)
      addRecentActivity(updated, updated.is_done ? 'Baru selesai' : 'Dibuka lagi')
      toast.success(updated.is_done ? 'Tugas ditandai selesai. 🎉' : 'Tugas dibuka lagi.')
    } catch (err) {
      toast.error(extractError(err, 'Gagal memperbarui tugas.'))
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const deletedResponse = await TaskService.remove(id)
      addRecentActivity(deletedResponse.data || task, 'Baru dihapus')
      toast.success('Tugas berhasil dihapus', {
        duration: 7000,
        action: {
          label: 'Undo',
          onClick: async () => {
            try {
              const restored = await TaskService.restore(task.id)
              addRecentActivity(restored, 'Dikembalikan')
              toast.success('Tugas dikembalikan.')
              navigate(`/tasks/${restored.id}`)
            } catch (err) {
              toast.error(extractError(err, 'Gagal mengembalikan tugas.'))
            }
          },
        },
      })
      navigate('/tasks')
    } catch (err) {
      toast.error(extractError(err, 'Gagal menghapus tugas.'))
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Memuat detail..." />
      </div>
    )
  }
  if (!task) return null

  const isDone = task.status_key === 'selesai'

  return (
    <div className="mx-auto max-w-2xl space-y-5 animate-fade-in">
      <Link to="/tasks" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Kembali ke daftar tugas
      </Link>

      <div className="glass space-y-5 rounded-3xl p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className={`text-2xl font-bold ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>
              {task.title}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-slate-400">
              <BookOpen size={15} className="text-violet-400" /> {task.course}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge label={task.status_label} color={task.status_color} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Panic message */}
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm text-violet-200">
          {panicMessage(task.status_key)}
        </div>

        {/* Meta grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Meta icon={Calendar} label="Deadline" value={formatDateTime(task.deadline)} accent="text-indigo-400" />
          <Meta icon={Clock} label="Sisa Waktu" value={task.remaining_time_text} accent="text-pink-400" />
        </div>

        {/* Progress */}
        <div>
          <ProgressBar task={task} />
        </div>

        {/* Description */}
        {task.description && (
          <div>
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-300">
              <AlignLeft size={15} /> Deskripsi
            </h2>
            <p className="whitespace-pre-line rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
              {task.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant={isDone ? 'secondary' : 'primary'} loading={toggling} onClick={handleToggle}>
            {isDone ? <RotateCcw size={16} /> : <Check size={16} />}
            {isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
          </Button>
          <Link to={`/tasks/${task.id}/edit`}>
            <Button variant="secondary"><Pencil size={16} /> Edit</Button>
          </Link>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={16} /> Hapus
          </Button>
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Yakin ingin menghapus tugas ini?"
        message={`"${task.title}" akan dihapus permanen.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}

function Meta({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-500">
        <Icon size={13} className={accent} /> {label}
      </p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}
