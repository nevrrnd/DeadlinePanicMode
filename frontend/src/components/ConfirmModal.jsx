import { AlertTriangle } from 'lucide-react'
import Button from './ui/Button'

export default function ConfirmModal({
  open,
  title = 'Yakin?',
  message = 'Tindakan ini tidak bisa dibatalkan.',
  confirmText = 'Hapus',
  cancelText = 'Batal',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />
      <div className="glass relative w-full max-w-sm rounded-3xl p-6 shadow-glow animate-fade-in">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-red-500/15 p-2.5 text-red-300">
            <AlertTriangle size={22} />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-slate-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
