import { ChevronDown } from 'lucide-react'

export default function Select({ label, error, id, options = [], className = '', children, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`w-full appearance-none rounded-xl border bg-white/5 px-4 py-2.5 pr-10 text-slate-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 ${
            error ? 'border-red-500/60' : 'border-white/10'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-panic-card text-slate-100">
              {opt.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
