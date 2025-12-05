"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getStoredUser, clearAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

// Defina as interfaces
interface User {
  id: string | number
  full_name?: string
  username?: string
  [key: string]: any
}

interface SearchResult {
  id: string | number
  type: 'user' | 'post'
  name?: string
  title?: string
  username?: string
  preview?: string
}

interface Notification {
  id: string | number
  read: boolean
  message: string
  created_at: string
  [key: string]: any
}

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    if (storedUser?.id) {
      fetchNotifications(storedUser.id)
    }
  }, [])

  const fetchNotifications = async (userId: string | number) => {
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.log("[v0] Error fetching notifications:", error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data || [])
      setShowSearchResults(true)
    } catch (error) {
      console.log("[v0] Error searching:", error)
    }
  }

  const handleLogout = () => {
    clearAuth()
    router.push("/")
  }

  const handleNotificationClick = (notificationId: string | number) => {
    markNotificationAsRead(notificationId)
  }

  const markNotificationAsRead = async (notificationId: string | number) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, { method: "PUT" })
      setNotifications(notifications.map((n) => 
        n.id === notificationId ? { ...n, read: true } : n
      ))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.log("[v0] Error marking notification as read:", error)
    }
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar pessoas, projetos..."
              className="pl-10 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
          </div>

          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={result.type === "user" ? `/perfil/${result.id}` : `/post/${result.id}`}
                  className="px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0 flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{result.name || result.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.type === "user" ? `@${result.username}` : result.preview}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />}
            </Button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notificações</h3>
                </div>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`p-4 border-b border-border cursor-pointer transition-colors ${
                        notification.read ? "bg-background" : "bg-primary/5 hover:bg-primary/10"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.created_at}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">Sem notificações</div>
                )}
              </div>
            )}
          </div>

          {user && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {user?.full_name
                    ? user.full_name.charAt(0).toUpperCase()
                    : user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </Button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg w-64 overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold text-foreground">{user?.full_name || "Usuário"}</p>
                    <p className="text-sm text-muted-foreground">@{user?.username || "unknown"}</p>
                  </div>
                  <Link
                    href={`/perfil/${user.id}`}
                    onClick={() => setShowProfileMenu(false)}
                    className="px-4 py-3 flex items-center gap-3 hover:bg-secondary transition-colors border-b border-border text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Meu Perfil</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setShowProfileMenu(false)
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-destructive/10 transition-colors text-destructive text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sair</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}