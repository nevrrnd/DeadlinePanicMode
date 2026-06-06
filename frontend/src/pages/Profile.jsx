import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, Calendar, LogOut, ListTodo, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { TaskService } from '../services/tasks'
import Button from '../components/ui/Button'
import { formatDate } from '../utils/format'

export default function Profile() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    TaskService.dashboard()
      .then((d) => setSummary(d.summary))
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logout()
    toast.info('Kamu sudah logout.')
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white md:text-3xl">Profile</h1>

      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-2xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white">{user?.name}</h2>
            <p className="truncate text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Field icon={User} label="Nama" value={user?.name} />
          <Field icon={Mail} label="Email" value={user?.email} />
          <Field icon={Shield} label="Role" value={user?.role || 'student'} />
          <Field icon={Calendar} label="Bergabung" value={formatDate(user?.created_at)} />
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3">
        <MiniStat icon={ListTodo} label="Total" value={summary?.total ?? '—'} accent="text-indigo-300" />
        <MiniStat icon={CheckCircle2} label="Selesai" value={summary?.selesai ?? '—'} accent="text-emerald-300" />
        <MiniStat icon={ListTodo} label="Belum" value={summary?.belum_selesai ?? '—'} accent="text-violet-300" />
      </div>

      <div className="glass rounded-3xl p-6">
        <h3 className="font-semibold text-white">Akun</h3>
        <p className="mt-1 text-sm text-slate-400">Keluar dari sesi ini di perangkat ini.</p>
        <Button variant="danger" className="mt-4" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-500">
        <Icon size={13} /> {label}
      </p>
      <p className="mt-1 truncate font-medium text-white">{value || '-'}</p>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value, accent }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <Icon size={20} className={`mx-auto ${accent}`} />
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  )
}
