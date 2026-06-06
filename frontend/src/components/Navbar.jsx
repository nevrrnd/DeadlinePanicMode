import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListTodo, User, LogOut, Menu, X, Zap, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useTaskModal } from '../context/TaskModalContext'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tugas', icon: ListTodo },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const { openCreateTask } = useTaskModal()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.info('Kamu sudah logout.')
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-violet-500/20 text-violet-200' : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-panic-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 p-1.5 text-white">
            <Zap size={18} />
          </span>
          <span className="text-base font-bold text-white">
            Deadline <span className="gradient-text">Panic</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              <l.icon size={16} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={openCreateTask}
            className="btn-gradient flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-glow"
          >
            <Plus size={16} /> Tambah
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="max-w-[120px] truncate text-sm text-slate-300">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-xl p-2 text-slate-300 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 px-4 py-3 md:hidden">
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                <l.icon size={16} />
                {l.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                openCreateTask()
              }}
              className="mt-1 flex items-center gap-2 rounded-xl bg-violet-500/20 px-3 py-2 text-sm font-medium text-violet-200"
            >
              <Plus size={16} /> Tambah Tugas
            </button>
            <button
              onClick={handleLogout}
              className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
