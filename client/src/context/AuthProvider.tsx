import { useState } from 'react'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'))
  const [userId, setUserId] = useState<string | null>(null)

  const login = (accessToken: string, refreshToken: string, userId: string) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    setUserId(userId)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('userId', userId)
  }

  const logout = () => {
    setAccessToken(null)
    setRefreshToken(null)
    setUserId(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
  }

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, userId, login, logout }}>{children}</AuthContext.Provider>
  )
}
