import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Zap, ArrowRight, Clock, AlarmClock, BarChart3, Sparkles, LogIn,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/ui/Button'

const BADGES = [
  { label: 'Santai', color: 'blue' },
  { label: 'Mulai Bahaya', color: 'yellow' },
  { label: 'Panik', color: 'orange' },
  { label: 'Darurat', color: 'red' },
  { label: 'Tamat', color: 'gray' },
]

const FEATURES = [
  {
    icon: Clock,
    title: 'Deadline otomatis terbaca',
    desc: 'Cukup masukkan tanggal deadline, sisa waktu dihitung otomatis sampai jam terakhir.',
  },
  {
    icon: AlarmClock,
    title: 'Mode panik berdasarkan sisa waktu',
    desc: 'Status berubah dari Santai, Bahaya, Panik, sampai Darurat sesuai waktu tersisa.',
  },
  {
    icon: BarChart3,
    title: 'Deadline lebih kebaca',
    desc: 'Pantau Panic Meter tiap tugas dan tekanan deadline lewat dashboard.',
  },
]

export default function Landing() {
  const { isAuthenticated, login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [demoLoading, setDemoLoading] = useState(false)

  const loginDemo = async () => {
    setDemoLoading(true)
    try {
      await login('demo@panic.test', 'password')
      toast.success('Masuk sebagai akun demo!')
      navigate('/dashboard')
    } catch {
      toast.error('Gagal login demo. Pastikan backend & seeder sudah jalan.')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 p-1.5 text-white">
            <Zap size={18} />
          </span>
          <span className="text-base font-bold text-white">
            Deadline <span className="gradient-text">Panic Mode</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button size="sm" variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 text-center md:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-200 animate-fade-in">
          <Sparkles size={14} /> Manajemen deadline khusus mahasiswa
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl animate-fade-in">
          Atur tugas sebelum hidup masuk <span className="gradient-text">mode panik</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-slate-400 md:text-lg">
          Catat tugas kuliah, pantau deadline, dan biarkan sistem memberi tahu kapan kamu harus
          mulai panik — sebelum benar-benar terlambat.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Mulai Sekarang <ArrowRight size={18} />
            </Button>
          </Link>
          <Button size="lg" variant="outline" loading={demoLoading} onClick={loginDemo} className="w-full sm:w-auto">
            <LogIn size={18} /> Login Demo
          </Button>
        </div>

        {/* Status badges showcase */}
        <div className="mt-12">
          <p className="mb-3 text-sm text-slate-500">Contoh badge status deadline:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {BADGES.map((b) => (
              <StatusBadge key={b.label} label={b.label} color={b.color} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-3xl p-6 transition hover:border-white/10 hover:shadow-glow">
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/10 p-3 text-violet-300">
                <f.icon size={26} />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="glass rounded-3xl px-6 py-12 text-center shadow-glow">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Siap keluar dari mode panik?</h2>
          <p className="mx-auto mt-2 max-w-md text-slate-400">
            Buat akun gratis dan mulai kelola deadline tugasmu hari ini.
          </p>
          <Link to="/register" className="mt-6 inline-block">
            <Button size="lg">
              Buat Akun Gratis <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-6 text-center text-sm text-slate-500">
        Deadline Panic Mode — atur tugas sebelum hidup masuk mode panik.
      </footer>
    </div>
  )
}
