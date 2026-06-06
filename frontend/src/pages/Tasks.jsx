import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ListTodo, SlidersHorizontal, AlertCircle } from 'lucide-react'
import { TaskService } from '../services/tasks'
import { useToast } from '../context/ToastContext'
import { useTaskModal } from '../context/TaskModalContext'
import TaskCard from '../components/TaskCard'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import ConfirmModal from '../components/ConfirmModal'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { extractError } from '../lib/api'
import { addRecentActivity } from '../utils/recentActivity'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua status' },
  { value: 'belum', label: 'Belum selesai' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'santai', label: 'Santai' },
  { value: 'bahaya', label: 'Mulai Bahaya' },
  { value: 'panik', label: 'Panik' },
  { value: 'darurat', label: 'Darurat' },
  { value: 'tamat', label: 'Tamat' },
]

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'Semua prioritas' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const SORT_OPTIONS = [
  { value: 'deadline_asc', label: 'Deadline terdekat' },
  { value: 'deadline_desc', label: 'Deadline terjauh' },
  { value: 'newest', label: 'Terbaru dibuat' },
]

const TABS = [
  { key: 'active', label: 'Aktif', empty: 'Tidak ada tugas aktif.' },
  { key: 'done', label: 'Selesai', empty: 'Belum ada tugas selesai.' },
  { key: 'overdue', label: 'Terlewat', empty: 'Tidak ada tugas terlewat. Aman.' },
]

function tabKeyForTask(task) {
  if (task.is_done || Number(task.progress) >= 100 || task.status_key === 'selesai') return 'done'
  if (task.status_key === 'tamat') return 'overdue'
  return 'active'
}

export default function Tasks() {
  const toast = useToast()
  const { openCreateTask } = useTaskModal()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [sort, setSort] = useState('deadline_asc')
  const [activeTab, setActiveTab] = useState('active')

  const [togglingId, setTogglingId] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTasks = useCallback(() => {
    setLoading(true)
    setError(false)
    const params = { status, sort }
    if (priority !== 'all') params.priority = priority
    if (search.trim()) params.search = search.trim()
    TaskService.list(params)
      .then((res) => setTasks(res.data || []))
      .catch((err) => {
        setError(true)
        toast.error(extractError(err, 'Gagal memuat tugas.'))
      })
      .finally(() => setLoading(false))
  }, [status, priority, sort, search]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search; refetch on filter changes.
  useEffect(() => {
    const t = setTimeout(fetchTasks, 300)
    return () => clearTimeout(t)
  }, [fetchTasks])

  useEffect(() => {
    window.addEventListener('task:created', fetchTasks)
    return () => window.removeEventListener('task:created', fetchTasks)
  }, [fetchTasks])

  const handleToggle = async (task) => {
    setTogglingId(task.id)
    try {
      const updated = await TaskService.toggleDone(task.id)
      addRecentActivity(updated, updated.is_done ? 'Baru selesai' : 'Dibuka lagi')
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
      toast.success(updated.is_done ? 'Tugas ditandai selesai. 🎉' : 'Tugas dibuka lagi.')
    } catch (err) {
      toast.error(extractError(err, 'Gagal memperbarui tugas.'))
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      const deletedResponse = await TaskService.remove(toDelete.id)
      addRecentActivity(deletedResponse.data || toDelete, 'Baru dihapus')
      setTasks((prev) => prev.filter((t) => t.id !== toDelete.id))
      toast.success('Tugas berhasil dihapus', {
        duration: 7000,
        action: {
          label: 'Undo',
          onClick: async () => {
            try {
              const restored = await TaskService.restore(toDelete.id)
              addRecentActivity(restored, 'Dikembalikan')
              fetchTasks()
              toast.success('Tugas dikembalikan.')
            } catch (err) {
              toast.error(extractError(err, 'Gagal mengembalikan tugas.'))
            }
          },
        },
      })
      setToDelete(null)
    } catch (err) {
      toast.error(extractError(err, 'Gagal menghapus tugas.'))
    } finally {
      setDeleting(false)
    }
  }

  const tabCounts = TABS.reduce(
    (counts, tab) => ({
      ...counts,
      [tab.key]: tasks.filter((task) => tabKeyForTask(task) === tab.key).length,
    }),
    {},
  )
  const visibleTasks = tasks.filter((task) => tabKeyForTask(task) === activeTab)
  const emptyMessage = TABS.find((tab) => tab.key === activeTab)?.empty || 'Belum ada tugas.'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
            <ListTodo className="text-violet-400" /> Daftar Tugas
          </h1>
          <p className="mt-1 text-sm text-slate-400">Kelola semua tugas kuliahmu di sini.</p>
        </div>
        <Button size="lg" className="w-full sm:w-auto" onClick={openCreateTask}><Plus size={18} /> Tambah Tugas</Button>
      </div>

      <div className="glass flex gap-2 overflow-x-auto rounded-2xl p-2">
        {TABS.map((tab) => {
          const active = activeTab === tab.key

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-violet-500/25 text-white shadow-glow'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              {tab.label} <span className="text-xs opacity-80">({tabCounts[tab.key] || 0})</span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, mata kuliah..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-slate-100 placeholder-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
            />
          </div>
          <Select options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
          <Select options={PRIORITY_OPTIONS} value={priority} onChange={(e) => setPriority(e.target.value)} />
          <Select options={SORT_OPTIONS} value={sort} onChange={(e) => setSort(e.target.value)} />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <SlidersHorizontal size={12} /> {visibleTasks.length} tugas ditemukan
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner label="Memuat tugas..." />
        </div>
      ) : error ? (
        <EmptyState
          icon={AlertCircle}
          tone="danger"
          title="Tugas gagal dimuat"
          description="Cek koneksi backend, lalu refresh halaman."
        />
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          title={emptyMessage}
          description="Belum ada tugas yang cocok dengan filter ini. Hidup masih aman untuk sementara. 😌"
          action={
            <Button onClick={openCreateTask}><Plus size={16} /> Tambah Tugas Pertama</Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              toggling={togglingId === task.id}
              onToggleDone={handleToggle}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Yakin ingin menghapus tugas ini?"
        message={`"${toDelete?.title}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
