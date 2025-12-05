"use client"

export interface User {
  id: number
  email: string
  username: string
  full_name: string
  avatar_url?: string
  bio?: string
  role: "professor" | "aluno"
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function setStoredUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

export function setStoredToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
  }
}
