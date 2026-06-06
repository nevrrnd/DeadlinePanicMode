import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { TaskService } from '../services/tasks'
import { useToast } from '../context/ToastContext'
import { extractError } from '../lib/api'
import TaskForm from '../components/TaskForm'
import LoadingSpinner from '../components/LoadingSpinner'
import { toInputDateTime } from '../utils/format'
import { addRecentActivity } from '../utils/recentActivity'

export default function TaskEdit() {
  const { id } = useParams()
  const toast = useToast()
  const navigate = useNavigate()
  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    TaskService.get(id)
      .then((task) =>
        setInitial({
          title: task.title,
          course: task.course,
          description: task.description || '',
          deadline: toInputDateTime(task.deadline),
          priority: task.priority,
          progress: task.progress,
          is_done: task.is_done,
        }),
      )
      .catch((err) => {
        toast.error(extractError(err, 'Tugas tidak ditemukan.'))
        navigate('/tasks')
      })
      .finally(() => setLoading(false))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      const task = await TaskService.update(id, payload)
      addRecentActivity(task, 'Baru diedit')
      toast.success('Tugas berhasil diperbarui. ✅')
      navigate(`/tasks/${id}`)
    } catch (err) {
      toast.error(extractError(err, 'Gagal memperbarui tugas.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Memuat tugas..." />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 animate-fade-in">
      <Link to={`/tasks/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Kembali ke detail tugas
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Edit Tugas</h1>
        <p className="mt-1 text-sm text-slate-400">Perbarui detail tugasmu.</p>
      </div>
      <TaskForm initial={initial} submitting={submitting} submitLabel="Simpan Perubahan" onSubmit={handleSubmit} />
    </div>
  )
}
