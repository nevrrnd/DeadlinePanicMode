export default function StatCard({ icon: Icon, label, value, accent = 'indigo', hint }) {
  const accents = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-300',
    violet: 'from-violet-500/20 to-violet-500/5 text-violet-300',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300',
    orange: 'from-orange-500/20 to-orange-500/5 text-orange-300',
    red: 'from-red-500/20 to-red-500/5 text-red-300',
    gray: 'from-slate-500/20 to-slate-500/5 text-slate-300',
    pink: 'from-pink-500/20 to-pink-500/5 text-pink-300',
  }
  return (
    <div className="glass rounded-2xl p-4 transition hover:border-white/10 hover:shadow-glow">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`rounded-xl bg-gradient-to-br p-2.5 ${accents[accent]}`}>
            <Icon size={20} />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
