"use client"

import { FriendsList } from "@/components/FriendsList"
import { getStoredUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function FriendsPageClient() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    
    if (!storedUser) {
      router.push("/login")
      return
    }
    
    setUser(storedUser)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso não autorizado</h1>
          <p className="text-gray-600">Faça login para ver seus amigos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Amigos</h1>
            <p className="text-gray-600 mt-2">
              Conecte-se com seus amigos e inicie conversas
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista principal de amigos */}
            <div className="lg:col-span-2">
              <FriendsList userId={user.id} />
            </div>

            {/* Sidebar com estatísticas */}
            <div className="space-y-6">
              {/* Estatísticas */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-bold text-lg mb-4">Estatísticas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amigos totais</span>
                    <span className="font-bold">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amigos online</span>
                    <span className="font-bold text-green-600">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Mensagens hoje</span>
                    <span className="font-bold">12</span>
                  </div>
                </div>
              </div>

              {/* Dicas */}
              <div className="bg-blue-50 rounded-lg border border-blue-100 p-6">
                <h3 className="font-bold text-lg mb-3 text-blue-800">Dicas</h3>
                <ul className="space-y-3 text-sm text-blue-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                    Clique em um amigo para iniciar uma conversa
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                    Amigos online aparecem com um ponto verde
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                    Números azuis indicam mensagens não lidas
                  </li>
                </ul>
              </div>

              {/* Convite */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Convide amigos</h3>
                <p className="text-sm mb-4 opacity-90">
                  Compartilhe seu link para adicionar mais amigos
                </p>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={`https://seusite.com/add/${user.username || user.id}`}
                    className="flex-1 bg-white/20 text-white placeholder-white/70 rounded-l-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(`https://seusite.com/add/${user.username || user.id}`)}
                    className="bg-white text-purple-600 px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}