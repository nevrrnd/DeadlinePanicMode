import api from '../lib/api'

// Thin service layer over the Laravel task endpoints.
export const TaskService = {
  list(params = {}) {
    return api.get('/tasks', { params }).then((r) => r.data)
  },
  get(id) {
    return api.get(`/tasks/${id}`).then((r) => r.data.data)
  },
  create(payload) {
    return api.post('/tasks', payload).then((r) => r.data.data)
  },
  update(id, payload) {
    return api.put(`/tasks/${id}`, payload).then((r) => r.data.data)
  },
  remove(id) {
    return api.delete(`/tasks/${id}`).then((r) => r.data)
  },
  restore(id) {
    return api.post(`/tasks/${id}/restore`).then((r) => r.data.data)
  },
  toggleDone(id) {
    return api.patch(`/tasks/${id}/toggle-done`).then((r) => r.data.data)
  },
  dashboard() {
    return api.get('/dashboard').then((r) => r.data)
  },
}
