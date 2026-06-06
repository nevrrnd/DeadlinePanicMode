import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

let idCounter = 0

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const STYLES = {
  success: 'border-emerald-500/40 text-emerald-200',
  error: 'border-red-500/40 text-red-200',
  info: 'border-indigo-500/40 text-indigo-200',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'success', options = {}) => {
      const id = ++idCounter
      const duration = options.duration ?? 3500
      setToasts((prev) => [...prev, { id, message, type, action: options.action }])
      setTimeout(() => remove(id), duration)
    },
    [remove],
  )

  const toast = {
    success: (msg, options) => push(msg, 'success', options),
    error: (msg, options) => push(msg, 'error', options),
    info: (msg, options) => push(msg, 'info', options),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info
          return (
            <div
              key={t.id}
              className={`glass flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-glow animate-slide-in ${STYLES[t.type]}`}
            >
              <Icon size={20} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-100">{t.message}</p>
                {t.action && (
                  <button
                    type="button"
                    onClick={() => {
                      t.action.onClick?.()
                      remove(t.id)
                    }}
                    className="mt-2 rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-violet-200 transition hover:bg-white/10"
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
              <button onClick={() => remove(t.id)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
