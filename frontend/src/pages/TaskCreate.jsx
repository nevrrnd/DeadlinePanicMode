import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { TaskService } from '../services/tasks'
import { useToast } from '../context/ToastContext'
import { extractError } from '../lib/api'
import TaskForm from '../components/TaskForm'
import { addRecentActivity } from '../utils/recentActivity'

export default function TaskCreate() {
  const toast = useToast()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      const task = await TaskService.create(payload)
      addRecentActivity(task, 'Baru ditambah')
      toast.success('Tugas berhasil ditambahkan! 🎯')
      navigate(`/tasks/${task.id}`)
    } catch (err) {
      toast.error(extractError(err, 'Gagal menambah tugas.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 animate-fade-in">
      <Link to="/tasks" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Kembali ke daftar tugas
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Tambah Tugas Baru</h1>
        <p className="mt-1 text-sm text-slate-400">Isi detail tugas, status deadline dihitung otomatis.</p>
      </div>
      <TaskForm submitting={submitting} submitLabel="Tambah Tugas" onSubmit={handleSubmit} />
    </div>
  )
}
