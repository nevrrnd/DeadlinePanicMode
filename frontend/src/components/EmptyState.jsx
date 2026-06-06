import { Coffee } from 'lucide-react'

export default function EmptyState({
  icon: Icon = Coffee,
  title = 'Belum ada tugas',
  description = 'Belum ada data untuk ditampilkan.',
  action,
  tone = 'default',
}) {
  const tones = {
    default: 'from-violet-500/20 to-pink-500/10 text-violet-300',
    danger: 'from-red-500/20 to-orange-500/10 text-red-300',
  }

  return (
    <div className="glass flex min-h-[260px] flex-col items-center justify-center rounded-2xl px-5 py-10 text-center sm:px-6 sm:py-12">
      <div className={`mb-4 rounded-2xl bg-gradient-to-br p-4 ${tones[tone] || tones.default}`}>
        <Icon size={36} />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
