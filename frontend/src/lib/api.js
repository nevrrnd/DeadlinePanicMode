import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

export const TOKEN_KEY = 'dpm_token'

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Attach bearer token to every request if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear the stored token so the app falls back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
    }
    return Promise.reject(error)
  },
)

/**
 * Normalize a Laravel error response into a single readable message.
 */
export function extractError(error, fallback = 'Terjadi kesalahan. Coba lagi.') {
  const res = error?.response?.data
  if (!res) return error?.message || fallback
  if (res.errors) {
    const first = Object.values(res.errors)[0]
    if (Array.isArray(first) && first.length) return first[0]
  }
  return res.message || fallback
}

export default api
