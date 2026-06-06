import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api, { TOKEN_KEY, extractError } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // initial "am I logged in?" check

  // On mount: if a token exists, try to fetch the current user.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/user')
      .then((r) => setUser(r.data.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const persist = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token)
    setUser(userData)
  }, [])

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/login', { email, password })
      persist(data.token, data.user)
      return data.user
    },
    [persist],
  )

  const register = useCallback(
    async (payload) => {
      const { data } = await api.post('/register', payload)
      persist(data.token, data.user)
      return data.user
    },
    [persist],
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/logout')
    } catch {
      // ignore network errors on logout; we clear locally anyway
    }
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    extractError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
