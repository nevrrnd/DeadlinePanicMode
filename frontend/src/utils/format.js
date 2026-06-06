import dayjs from 'dayjs'
import 'dayjs/locale/id'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('id')

export function formatDate(value) {
  if (!value) return '-'
  return dayjs(value).format('DD MMM YYYY')
}

export function formatDateTime(value) {
  if (!value) return '-'
  return dayjs(value).format('DD MMM YYYY, HH:mm')
}

// Convert ISO datetime to the value accepted by <input type="datetime-local">.
export function toInputDateTime(value) {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DDTHH:mm')
}

// Tailwind class sets per backend status_color token.
// Selesai=green, Santai=blue, Mulai Bahaya=yellow, Panik=orange,
// Darurat=red, Tamat=gray/dark red.
export const STATUS_STYLES = {
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_-4px_rgba(16,185,129,0.5)]',
  blue: 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-[0_0_12px_-4px_rgba(14,165,233,0.5)]',
  yellow: 'bg-amber-400/15 text-amber-300 border-amber-400/40 shadow-[0_0_12px_-4px_rgba(251,191,36,0.5)]',
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/40 shadow-[0_0_12px_-4px_rgba(249,115,22,0.55)]',
  red: 'bg-red-500/20 text-red-300 border-red-500/50 shadow-[0_0_14px_-4px_rgba(239,68,68,0.65)]',
  gray: 'bg-rose-950/40 text-rose-300/90 border-rose-800/50 shadow-[0_0_12px_-5px_rgba(159,18,57,0.6)]',
}

// Soft accent ring/glow per status, used on cards to make state pop.
export const STATUS_ACCENT = {
  green: 'ring-emerald-500/20',
  blue: 'ring-sky-500/20',
  yellow: 'ring-amber-400/20',
  orange: 'ring-orange-500/25',
  red: 'ring-red-500/30',
  gray: 'ring-rose-800/30',
}

export const PRIORITY_META = {
  low: { label: 'Low', class: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  medium: { label: 'Medium', class: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  high: { label: 'High', class: 'bg-pink-500/15 text-pink-300 border-pink-500/30' },
}

export function getDeadlineMeter(task = {}) {
  const statusKey = task.status_key

  if (task.is_done || statusKey === 'selesai') {
    return { value: 100, color: 'from-emerald-500 to-green-400', label: 'Selesai' }
  }

  if (statusKey === 'tamat') {
    return { value: 100, color: 'from-rose-600 to-red-500', label: 'Tamat' }
  }

  const deadline = task.deadline ? dayjs(task.deadline) : null
  const hoursLeft = deadline?.isValid() ? deadline.diff(dayjs(), 'hour', true) : Number(task.remaining_hours)

  if (!Number.isFinite(hoursLeft)) {
    return { value: 10, color: 'from-sky-500 to-cyan-400', label: 'Deadline Meter' }
  }

  if (hoursLeft <= 24) {
    return { value: Math.max(85, Math.min(99, Math.round(99 - (hoursLeft / 24) * 14))), color: 'from-red-500 to-rose-500', label: 'Darurat' }
  }

  if (hoursLeft <= 72) {
    return { value: Math.max(60, Math.min(85, Math.round(85 - ((hoursLeft - 24) / 48) * 25))), color: 'from-orange-500 to-red-400', label: 'Panik' }
  }

  if (hoursLeft <= 168) {
    return { value: Math.max(35, Math.min(60, Math.round(60 - ((hoursLeft - 72) / 96) * 25))), color: 'from-amber-500 to-orange-400', label: 'Mulai Bahaya' }
  }

  const value = Math.max(5, Math.min(35, Math.round(35 - Math.min(hoursLeft - 168, 336) / 336 * 30)))
  return { value, color: 'from-sky-500 to-violet-400', label: 'Santai' }
}

export function progressColor(progress, task = null) {
  if (task) return getDeadlineMeter(task).color
  if (progress >= 100) return 'from-emerald-500 to-green-400'
  if (progress >= 60) return 'from-orange-500 to-red-400'
  if (progress >= 30) return 'from-amber-500 to-orange-400'
  return 'from-sky-500 to-violet-400'
}

// A little motivational line for tasks running out of time.
export function panicMessage(statusKey) {
  switch (statusKey) {
    case 'darurat':
      return 'Gas sekarang, jangan tunggu malam terakhir! 🔥'
    case 'panik':
      return 'Mode panik aktif. Cicil dari sekarang ya.'
    case 'tamat':
      return 'Deadline lewat. Masih bisa diselesaikan, jangan menyerah.'
    case 'bahaya':
      return 'Mulai bahaya. Sisihkan waktu hari ini.'
    case 'selesai':
      return 'Mantap, tugas ini sudah beres! 🎉'
    default:
      return 'Masih santai, tapi jangan keenakan nunda.'
  }
}
