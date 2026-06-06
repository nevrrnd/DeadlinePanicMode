import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Zap, User, Mail, Lock, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Register() {
  const { register, isAuthenticated, loading, extractError } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama wajib diisi.'
    if (!form.email) e.email = 'Email wajib diisi.'
    if (!form.password) e.password = 'Password wajib diisi.'
    else if (form.password.length < 6) e.password = 'Password minimal 6 karakter.'
    if (form.password !== form.password_confirmation)
      e.password_confirmation = 'Konfirmasi password tidak cocok.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await register(form)
      toast.success('Akun berhasil dibuat. Selamat datang!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(extractError(err, 'Registrasi gagal.'))
    } finally {
      setSubmitting(false)
    }
  }

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
          <h1 className="text-2xl font-bold text-white">Buat akun baru ✨</h1>
          <p className="mt-1 text-sm text-slate-400">Gratis, dan langsung bisa dipakai.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-[38px] text-slate-500" />
              <Input
                label="Nama"
                id="name"
                placeholder="Nama lengkap"
                className="pl-9"
                value={form.name}
                error={errors.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
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
                placeholder="Min. 6 karakter"
                className="pl-9"
                value={form.password}
                error={errors.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-[38px] text-slate-500" />
              <Input
                label="Konfirmasi Password"
                id="password_confirmation"
                type="password"
                placeholder="Ulangi password"
                className="pl-9"
                value={form.password_confirmation}
                error={errors.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              />
            </div>

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              <UserPlus size={18} /> Daftar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-violet-300 hover:text-violet-200">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
