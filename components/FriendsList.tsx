"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, MessageCircle, Circle, RefreshCw } from "lucide-react"

interface Friend {
  id: number
  full_name: string
  username: string
  avatar_url: string
  is_online: boolean
  bio: string
  last_message: string
  last_message_at: string | null
  unread_count: number
}

export function FriendsList({ userId }: { userId: number }) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "online" | "offline">("all")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchFriends()
    }
  }, [userId])

  const fetchFriends = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/friends?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setFriends(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Error fetching friends:", error)
      setError("Falha ao carregar amigos. Tente novamente.")
      
      // Dados mockados para desenvolvimento
      setFriends([
        {
          id: 2,
          full_name: "Amigo Teste",
          username: "amigo",
          avatar_url: "https://ui-avatars.com/api/?name=Amigo+Teste&background=random",
          is_online: true,
          bio: "Desenvolvedor web",
          last_message: "Olá! Como você está?",
          last_message_at: new Date().toISOString(),
          unread_count: 2
        },
        {
          id: 3,
          full_name: "Maria Silva",
          username: "maria",
          avatar_url: "https://ui-avatars.com/api/?name=Maria+Silva&background=FFC0CB",
          is_online: true,
          bio: "Designer UX/UI",
          last_message: "",
          last_message_at: null,
          unread_count: 0
        },
        {
          id: 4,
          full_name: "Carlos Santos",
          username: "carlos",
          avatar_url: "https://ui-avatars.com/api/?name=Carlos+Santos&background=87CEEB",
          is_online: false,
          bio: "Gerente de Projetos",
          last_message: "Até amanhã!",
          last_message_at: new Date(Date.now() - 86400000).toISOString(),
          unread_count: 0
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar amigos baseado no filtro selecionado
  const filteredFriends = friends.filter(friend => {
    if (filter === "online") return friend.is_online
    if (filter === "offline") return !friend.is_online
    return true // "all"
  })

  // Separar amigos online e offline para exibição
  const onlineFriends = friends.filter(f => f.is_online)
  const offlineFriends = friends.filter(f => !f.is_online)

  // Formatar a data da última mensagem
  const formatLastSeen = (dateString: string | null) => {
    if (!dateString) return "Nunca conversou"
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return "Agora mesmo"
      if (diffMins < 60) return `${diffMins} min atrás`
      if (diffHours < 24) return `${diffHours} h atrás`
      if (diffDays < 7) return `${diffDays} dias atrás`
      
      return date.toLocaleDateString('pt-BR')
    } catch {
      return "Data inválida"
    }
  }

  if (error && friends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchFriends}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Cabeçalho com contadores */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Amigos</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-sm text-gray-600">{onlineFriends.length} online</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{offlineFriends.length} offline</span>
            </div>
            <button
              onClick={fetchFriends}
              disabled={isLoading}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Atualizar"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === "all" 
                ? "bg-blue-100 text-blue-700" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todos ({friends.length})
          </button>
          <button
            onClick={() => setFilter("online")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center ${
              filter === "online" 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
            Online ({onlineFriends.length})
          </button>
          <button
            onClick={() => setFilter("offline")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === "offline" 
                ? "bg-gray-800 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Offline ({offlineFriends.length})
          </button>
        </div>
      </div>

      {/* Lista de amigos */}
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="p-8 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {filter === "online" 
                ? "Nenhum amigo online no momento" 
                : filter === "offline"
                ? "Nenhum amigo offline"
                : "Nenhum amigo encontrado"}
            </p>
            {filter === "all" && (
              <p className="text-sm text-gray-400 mt-1">
                Adicione amigos para começar a conversar
              </p>
            )}
          </div>
        ) : (
          filteredFriends.map(friend => (
            <Link 
              key={friend.id} 
              href={`/chat/${friend.id}`}
              className={`block p-4 hover:bg-gray-50 transition-colors ${
                friend.is_online ? "bg-green-50/50" : ""
              }`}
            >
              <div className="flex items-center">
                {/* Avatar com status */}
                <div className="relative mr-3">
                  <img
                    src={friend.avatar_url}
                    alt={friend.full_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    friend.is_online ? "bg-green-500" : "bg-gray-300"
                  }`}></div>
                </div>

                {/* Informações do amigo */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {friend.full_name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        @{friend.username}
                      </p>
                    </div>
                    {friend.unread_count > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2">
                        {friend.unread_count}
                      </span>
                    )}
                  </div>

                  {/* Bio e última mensagem */}
                  <div className="mt-1">
                    {friend.last_message ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <MessageCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{friend.last_message}</span>
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {formatLastSeen(friend.last_message_at)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 truncate">
                        {friend.bio || "Nenhuma descrição"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status online/offline */}
                <div className="ml-4">
                  {friend.is_online ? (
                    <div className="flex items-center text-xs text-green-600">
                      <Circle className="w-2 h-2 fill-current mr-1" />
                      <span>Online</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Offline
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}