"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-hook"

export default function AmigosPage() {
  const { user, loading: authLoading } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOnlineUsers()
  }, [])

  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch("/api/users/online")
      const data = await response.json()
      setOnlineUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao buscar usuários online:", error)
      setOnlineUsers([])
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-6">
              <div className="text-center text-muted-foreground py-8">Carregando usuários...</div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-foreground mb-6">Amigos Online</h1>

            {onlineUsers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">Nenhum usuário online no momento</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {onlineUsers.map((friend: any) => (
                  <Card key={friend.id} className="p-6 bg-card border-border hover:border-primary/50 transition-all">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg font-bold text-white">
                          {friend.full_name?.charAt(0).toUpperCase() || friend.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                      </div>
                      <h3 className="font-bold text-foreground text-lg">{friend.full_name || friend.username}</h3>
                      <p className="text-sm text-muted-foreground">@{friend.username}</p>
                      <p className="text-sm text-foreground mt-2 line-clamp-2">{friend.bio || "Sem bio"}</p>
                      <div className="flex gap-2 mt-4 w-full">
                        <Button className="flex-1 bg-primary hover:bg-accent" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Mensagem
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
