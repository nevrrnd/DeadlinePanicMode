const RECENT_ACTIVITY_KEY = 'dpm_recent_activity'
const MAX_ITEMS = 5

export function getRecentActivities() {
  try {
    const raw = localStorage.getItem(RECENT_ACTIVITY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addRecentActivity(task, action = 'Baru dibuka') {
  if (!task?.id) return []
  const deleted = action === 'Baru dihapus'

  const item = {
    id: task.id,
    title: task.title,
    course: task.course,
    status_label: task.status_label,
    status_color: task.status_color,
    action,
    deleted,
    undo_expires_at: task.undo_expires_at || (deleted ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null),
    undo_remaining_text: task.undo_remaining_text || (deleted ? 'Bisa dipulihkan 7 hari' : null),
    at: new Date().toISOString(),
  }

  const next = [item, ...getRecentActivities().filter((entry) => entry.id !== task.id)].slice(0, MAX_ITEMS)
  localStorage.setItem(RECENT_ACTIVITY_KEY, JSON.stringify(next))
  return next
}

export function canRestoreActivity(activity) {
  if (!activity?.deleted || !activity.undo_expires_at) return false

  const expiresAt = new Date(activity.undo_expires_at).getTime()
  return Date.now() < expiresAt
}

export function undoText(activity) {
  if (!activity?.deleted) return null
  if (!canRestoreActivity(activity)) return 'Undo kedaluwarsa'

  const hours = Math.ceil((new Date(activity.undo_expires_at).getTime() - Date.now()) / (60 * 60 * 1000))
  const days = Math.max(1, Math.ceil(hours / 24))
  return `Sisa undo: ${days} hari`
}

export function removeRecentActivity(taskId) {
  const next = getRecentActivities().filter((entry) => entry.id !== taskId)
  localStorage.setItem(RECENT_ACTIVITY_KEY, JSON.stringify(next))
  return next
}
