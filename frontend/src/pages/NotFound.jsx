import { Link } from 'react-router-dom'
import { Ghost, Home } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-pink-500/10 p-6 text-violet-300">
        <Ghost size={56} />
      </div>
      <h1 className="text-6xl font-extrabold gradient-text">404</h1>
      <p className="mt-3 text-lg font-semibold text-white">Halaman tidak ditemukan</p>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
        Sepertinya halaman ini ikut menghilang seperti motivasi di malam deadline. 👻
      </p>
      <Link to="/" className="mt-6">
        <Button size="lg"><Home size={18} /> Kembali ke Beranda</Button>
      </Link>
    </div>
  )
}
