'use client'

import { useState, useEffect, useCallback } from 'react'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'

interface User {
  name: string
  role: 'manager' | 'teacher' | 'student'
  id?: string
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('studya_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setIsLoggedIn(true)
      } catch {
        localStorage.removeItem('studya_user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = useCallback(async (role: string, username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, username, password }),
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.user)
        setIsLoggedIn(true)
        localStorage.setItem('studya_user', JSON.stringify(data.user))
      }
      return data
    } catch (error) {
      return { success: false, message: '网络错误' }
    }
  }, [])

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('studya_user')
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  )
}
