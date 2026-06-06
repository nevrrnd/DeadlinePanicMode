import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ListTodo, CheckCircle2, CircleDashed, Flame, Siren, Skull, Plus, ArrowRight, TrendingUp, AlertCircle, Trash2, RotateCcw,
} from 'lucide-react'
import { TaskService } from '../services/tasks'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useTaskModal } from '../context/TaskModalContext'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import ConfirmModal from '../components/ConfirmModal'
import TaskDetailPanel from '../components/TaskDetailPanel'
import Button from '../components/ui/Button'
import { formatDateTime, getDeadlineMeter } from '../utils/format'
import { extractError } from '../lib/api'
import { addRecentActivity, canRestoreActivity, getRecentActivities, undoText } from '../utils/recentActivity'

function greeting() {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export default function Dashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const { openCreateTask } = useTaskModal()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [recentActivities, setRecentActivities] = useState(() => getRecentActivities())

  const refreshDashboard = () => {
    setError(false)
    return TaskService.dashboard()
      .then((nextData) => {
        setData(nextData)
        return nextData
      })
      .catch(() => {
        setError(true)
        toast.error('Gagal memuat dashboard.')
      })
  }

  useEffect(() => {
    refreshDashboard().finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onTaskCreated = () => {
      setRecentActivities(getRecentActivities())
      refreshDashboard()
    }

    window.addEventListener('task:created', onTaskCreated)
    return () => window.removeEventListener('task:created', onTaskCreated)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner label="Memuat dashboard..." />
      </div>
    )
  }

  const s = data?.summary || {}
  const upcoming = data?.upcoming || []
  const avgDeadlineMeter = upcoming.length
    ? Math.round(upcoming.reduce((sum, task) => sum + getDeadlineMeter(task).value, 0) / upcoming.length)
    : 0

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        tone="danger"
        title="Dashboard gagal dimuat"
        description="Cek koneksi backend, lalu refresh halaman."
      />
    )
  }

  const stats = [
    { label: 'Total Tugas', value: s.total ?? 0, icon: ListTodo, accent: 'indigo' },
    { label: 'Selesai', value: s.selesai ?? 0, icon: CheckCircle2, accent: 'emerald' },
    { label: 'Belum Selesai', value: s.belum_selesai ?? 0, icon: CircleDashed, accent: 'violet' },
    { label: 'Mode Panik', value: s.panik ?? 0, icon: Flame, accent: 'orange' },
    { label: 'Darurat', value: s.darurat ?? 0, icon: Siren, accent: 'red' },
    { label: 'Tamat (lewat)', value: s.tamat ?? 0, icon: Skull, accent: 'gray' },
  ]

  const selectTask = async (task) => {
    setSelectedTask(task)
    setRecentActivities(addRecentActivity(task, 'Baru dibuka'))
    setDetailLoading(true)
    try {
      const detail = await TaskService.get(task.id)
      setSelectedTask(detail)
    } catch (err) {
      toast.error(extractError(err, 'Gagal memuat detail tugas.'))
    } finally {
      setDetailLoading(false)
    }
  }

  const handleToggleSelected = async () => {
    if (!selectedTask) return
    setToggling(true)
    try {
      const updated = await TaskService.toggleDone(selectedTask.id)
      setSelectedTask(updated)
      setRecentActivities(addRecentActivity(updated, updated.is_done ? 'Baru selesai' : 'Dibuka lagi'))
      await refreshDashboard()
      toast.success(updated.is_done ? 'Tugas ditandai selesai.' : 'Tugas dibuka lagi.')
    } catch (err) {
      toast.error(extractError(err, 'Gagal memperbarui tugas.'))
    } finally {
      setToggling(false)
    }
  }

  const handleDeleteSelected = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      const deletedResponse = await TaskService.remove(toDelete.id)
      const deletedTask = deletedResponse.data || toDelete
      setSelectedTask(null)
      setToDelete(null)
      setRecentActivities(addRecentActivity(deletedTask, 'Baru dihapus'))
      await refreshDashboard()
      toast.success('Tugas berhasil dihapus', {
        duration: 7000,
        action: {
          label: 'Undo',
          onClick: async () => {
            try {
              const restored = await TaskService.restore(toDelete.id)
              setRecentActivities(addRecentActivity(restored, 'Dikembalikan'))
              await refreshDashboard()
              toast.success('Tugas dikembalikan.')
            } catch (err) {
              toast.error(extractError(err, 'Gagal mengembalikan tugas.'))
            }
          },
        },
      })
    } catch (err) {
      toast.error(extractError(err, 'Gagal menghapus tugas.'))
    } finally {
      setDeleting(false)
    }
  }

  const restoreActivity = async (activity) => {
    if (!canRestoreActivity(activity)) return

    try {
      const restored = await TaskService.restore(activity.id)
      setRecentActivities(addRecentActivity(restored, 'Dikembalikan'))
      await refreshDashboard()
      toast.success('Tugas dikembalikan.')
    } catch (err) {
      toast.error(extractError(err, 'Gagal mengembalikan tugas.'))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting + quick action */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {greeting()}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Mahasiswa'}</span> 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Ini ringkasan deadline tugasmu hari ini.
          </p>
        </div>
        <Button size="lg" className="w-full sm:w-auto" onClick={openCreateTask}>
            <Plus size={18} /> Tambah Tugas
        </Button>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((st) => (
          <StatCard key={st.label} {...st} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* Upcoming */}
        <div>
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-white">Aktivitas Terbaru</h2>
            {recentActivities.length === 0 ? (
              <div className="glass rounded-2xl px-4 py-3 text-sm text-slate-400">
                Belum ada aktivitas terbaru.
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {recentActivities.map((activity) => (
                  <button
                    key={`${activity.id}-${activity.at}`}
                    type="button"
                    onClick={() => !activity.deleted && selectTask(activity)}
                    className={`glass min-w-[230px] rounded-2xl p-3 text-left transition hover:border-violet-300/40 hover:bg-white/10 hover:shadow-glow ${
                      activity.deleted ? 'border-rose-500/30 bg-rose-500/10 cursor-default' : ''
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                        activity.deleted ? 'bg-rose-500/20 text-rose-200' : 'bg-violet-500/15 text-violet-200'
                      }`}>
                        {activity.deleted && <Trash2 size={11} />}
                        {activity.action}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge label={activity.status_label} color={activity.status_color} />
                        {activity.deleted && canRestoreActivity(activity) && (
                          <span
                            role="button"
                            tabIndex={0}
                            title="Pulihkan tugas"
                            onClick={(event) => {
                              event.stopPropagation()
                              restoreActivity(activity)
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                event.stopPropagation()
                                restoreActivity(activity)
                              }
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-300/20 bg-rose-500/15 text-rose-100 transition hover:bg-rose-500/25"
                          >
                            <RotateCcw size={13} />
                          </span>
                        )}
                        {activity.deleted && !canRestoreActivity(activity) && (
                          <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold text-slate-500">
                            Kedaluwarsa
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="truncate text-sm font-semibold text-white">{activity.title}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{activity.course}</p>
                    {activity.deleted && (
                      <p className={`mt-2 text-[11px] font-semibold ${canRestoreActivity(activity) ? 'text-rose-200' : 'text-slate-500'}`}>
                        {undoText(activity)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Tugas Terdekat</h2>
            <Link to="/tasks" className="flex items-center gap-1 text-sm text-violet-300 hover:text-violet-200">
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <EmptyState
              title="Tidak ada deadline mendesak"
              description="Belum ada tugas yang mendekati deadline. Hidup masih aman untuk sementara. 😌"
              action={
                <Button onClick={openCreateTask}><Plus size={16} /> Tambah Tugas</Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((t) => {
                const selected = selectedTask?.id === t.id

                return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTask(t)}
                  className={`glass block w-full cursor-pointer rounded-2xl p-4 text-left transition hover:border-violet-300/40 hover:shadow-glow ${
                    selected ? 'border-violet-300/60 bg-white/10 shadow-glow' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 font-semibold text-white">{t.title}</h3>
                      <p className="mt-1 truncate text-sm text-slate-400">{t.course}</p>
                    </div>
                    <StatusBadge label={t.status_label} color={t.status_color} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                    <span className="min-w-0 truncate">{formatDateTime(t.deadline)}</span>
                    <span className="font-medium text-pink-300">{t.remaining_time_text}</span>
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <ProgressBar task={t} showLabel={false} className="mt-3" />
                </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="relative flex flex-col gap-6">
          {selectedTask && (
            <TaskDetailPanel
              task={selectedTask}
              loading={detailLoading}
              toggling={toggling}
              deleting={deleting}
              className="z-30 max-h-[calc(100vh-7rem)] overflow-y-auto lg:sticky lg:top-28"
              onClose={() => setSelectedTask(null)}
              onToggleDone={handleToggleSelected}
              onDelete={() => setToDelete(selectedTask)}
            />
          )}

          <div className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2 text-violet-300">
              <TrendingUp size={18} />
              <h2 className="text-lg font-semibold text-white">Tekanan Deadline</h2>
            </div>
            <p className="text-sm text-slate-400">Rata-rata Panic Meter tugas terdekat.</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{avgDeadlineMeter}</span>
              <span className="mb-1 text-lg text-slate-400">%</span>
            </div>
            <ProgressBar progress={avgDeadlineMeter} showLabel={false} className="mt-3" />
            <p className="mt-3 text-xs text-slate-500">
              {avgDeadlineMeter >= 70
                ? 'Deadline sedang panas. Prioritaskan yang paling dekat.'
                : 'Tekanan masih terkendali. Tetap cicil sebelum naik.'}
            </p>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="mb-3 text-lg font-semibold text-white">Status lain</h2>
            <div className="space-y-2 text-sm">
              <Row label="Santai" value={s.santai ?? 0} color="blue" />
              <Row label="Mulai Bahaya" value={s.bahaya ?? 0} color="yellow" />
              <Row label="Panik" value={s.panik ?? 0} color="orange" />
              <Row label="Darurat" value={s.darurat ?? 0} color="red" />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!toDelete}
        title="Yakin ingin menghapus tugas ini?"
        message={`"${toDelete?.title}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        loading={deleting}
        onConfirm={handleDeleteSelected}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}

function Row({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <StatusBadge label={label} color={color} />
      <span className="font-semibold text-white">{value}</span>
    </div>
  )
}
