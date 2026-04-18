'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User, AuthState } from '@/lib/types'
import { getAuth, setAuth, logout as storeLogout, getStudents, getTutors, getUsers, initializeStore } from '@/lib/store'
import { DEMO_CREDENTIALS } from '@/lib/mock-data'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize store with mock data if empty
    initializeStore()
    
    // Load auth state from localStorage
    const stored = getAuth()
    setAuthState(stored)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check demo credentials
    const demoEntries = Object.entries(DEMO_CREDENTIALS)
    const matchedDemo = demoEntries.find(([, cred]) => cred.email === email && cred.password === password)
    
    if (!matchedDemo) {
      return { success: false, error: 'Email atau password salah' }
    }

    const [role] = matchedDemo
    let user: User | undefined

    // Find user based on role
    if (role === 'admin') {
      user = getUsers().find(u => u.email === email && u.role === 'admin')
    } else if (role === 'tutor') {
      user = getTutors().find(t => t.email === email)
    } else if (role === 'student') {
      user = getStudents().find(s => s.email === email)
    } else if (role === 'parent') {
      user = getUsers().find(u => u.email === email && u.role === 'parent')
    }

    if (!user) {
      return { success: false, error: 'User tidak ditemukan' }
    }

    const newAuthState: AuthState = { user, isAuthenticated: true }
    setAuth(newAuthState)
    setAuthState(newAuthState)
    
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    storeLogout()
    setAuthState({ user: null, isAuthenticated: false })
  }, [])

  const updateUser = useCallback((data: Partial<User>) => {
    if (!authState.user) return
    
    const updatedUser = { ...authState.user, ...data }
    const newAuthState: AuthState = { user: updatedUser, isAuthenticated: true }
    setAuth(newAuthState)
    setAuthState(newAuthState)
  }, [authState.user])

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  }
}
