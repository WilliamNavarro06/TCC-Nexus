"use client"

import { useEffect, useState } from "react"

export interface AuthUser {
  id: number
  username: string
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  role?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Erro ao recuperar usuário:", error)
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
  }

  return { user, loading, logout }
}
