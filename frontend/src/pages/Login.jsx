import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Zap, Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  const { login, isAuthenticated, loading, extractError } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email wajib diisi.'
    if (!form.password) e.password = 'Password wajib diisi.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      toast.success('Login berhasil!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(extractError(err, 'Login gagal.'))
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemo = () => setForm({ email: 'demo@panic.test', password: 'password' })

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fade-in">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 p-1.5 text-white">
            <Zap size={18} />
          </span>
          <span className="text-base font-bold text-white">
            Deadline <span className="gradient-text">Panic Mode</span>
          </span>
        </Link>

        <div className="glass rounded-3xl p-7 shadow-glow">
          <h1 className="text-2xl font-bold text-white">Selamat datang kembali 👋</h1>
          <p className="mt-1 text-sm text-slate-400">Masuk untuk lanjut mengatur deadline-mu.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-[38px] text-slate-500" />
              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="kamu@email.com"
                className="pl-9"
                value={form.email}
                error={errors.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-[38px] text-slate-500" />
              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                value={form.password}
                error={errors.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              <LogIn size={18} /> Masuk
            </Button>
          </form>

          <button
            onClick={fillDemo}
            className="mt-3 w-full rounded-xl border border-dashed border-violet-500/30 px-4 py-2 text-xs text-violet-300 transition hover:bg-violet-500/10"
          >
            Pakai akun demo (demo@panic.test / password)
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-violet-300 hover:text-violet-200">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
