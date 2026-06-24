import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { type ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth()

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
