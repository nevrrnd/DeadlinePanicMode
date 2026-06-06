import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TaskService } from '../services/tasks'
import { useToast } from '../context/ToastContext'
import { useTaskModal } from '../context/TaskModalContext'
import { extractError } from '../lib/api'
import { addRecentActivity } from '../utils/recentActivity'
import TaskForm from './TaskForm'

export default function CreateTaskModal() {
  const { createOpen, closeCreateTask } = useTaskModal()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!createOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !submitting) closeCreateTask()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeCreateTask, createOpen, submitting])

  if (!createOpen) return null

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      const task = await TaskService.create(payload)
      addRecentActivity(task, 'Baru ditambah')
      window.dispatchEvent(new CustomEvent('task:created', { detail: task }))
      toast.success('Tugas berhasil ditambahkan.')
      closeCreateTask()
    } catch (err) {
      toast.error(extractError(err, 'Gagal menambah tugas.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup modal tambah tugas"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
        onClick={submitting ? undefined : closeCreateTask}
      />
      <section className="glass relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 p-5 shadow-glow animate-[modalPop_.18s_ease-out] sm:p-6">
        <button
          type="button"
          aria-label="Tutup"
          onClick={closeCreateTask}
          disabled={submitting}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
        >
          <X size={20} />
        </button>
        <div className="mb-5 pr-12">
          <h2 className="text-2xl font-bold text-white">Tambah Tugas</h2>
          <p className="mt-1 text-sm text-slate-400">Isi deadline dan prioritas, Panic Meter dihitung otomatis.</p>
        </div>
        <TaskForm submitting={submitting} submitLabel="Tambah Tugas" onSubmit={handleSubmit} compact />
      </section>
    </div>
  )
}
