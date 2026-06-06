import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Memuat sesi..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Remember where the user wanted to go.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
