"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Trash2, MoreVertical } from "lucide-react"
import { useAuth } from "@/lib/auth-hook"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Comment {
  id: number
  post_id: number
  user_id: number
  content: string
  created_at: string
  author_name: string
  username: string
  avatar_url?: string
}

interface CommentsProps {
  postId: number
}

export function Comments({ postId }: CommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      setFetching(true)
      const response = await fetch(`/api/posts/${postId}/comments`)
      
      if (!response.ok) {
        throw new Error("Erro ao carregar comentários")
      }
      
      const data = await response.json()
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar comentários")
    } finally {
      setFetching(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) {
      setError("Digite um comentário")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          content: newComment.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao adicionar comentário")
      }

      const newCommentData = await response.json()
      setComments([newCommentData, ...comments])
      setNewComment("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar comentário")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!user || !confirm("Tem certeza que deseja excluir este comentário?")) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir comentário")
      }

      setComments(comments.filter(comment => comment.id !== commentId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir comentário")
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      })
    } catch {
      return "há algum tempo"
    }
  }

  return (
    <div className="mt-6 border-t pt-6">
      {/* Formulário para novo comentário */}
      {user && (
        <div className="flex gap-3 mb-6">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
              {user.full_name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="Adicione um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAddComment()
                }
              }}
            />
            
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
            
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleAddComment}
                disabled={loading || !newComment.trim()}
                size="sm"
                className="bg-primary hover:bg-accent"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Enviando..." : "Comentar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de comentários */}
      <div className="space-y-4">
        {fetching ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Carregando comentários...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 border rounded-lg">
            <p className="text-muted-foreground">Nenhum comentário ainda. Seja o primeiro!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 flex-1">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                      {comment.author_name?.charAt(0).toUpperCase() || 
                       comment.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.author_name || comment.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
                
                {/* Menu de ações (apenas para dono do comentário) */}
                {user?.id === comment.user_id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}