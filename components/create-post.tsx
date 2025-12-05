"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, X } from "lucide-react"
import { useAuth } from "@/lib/auth-hook"

export function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
    } else {
      setError("Selecione uma imagem válida")
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handlePost = async () => {
    if (!content.trim() && !image) {
      setError("Adicione texto ou uma imagem")
      return
    }

    if (!user) {
      setError("Você precisa estar logado para postar")
      return
    }

    setLoading(true)
    setError("")

    try {
      let imageUrl = null

      if (image) {
        const formData = new FormData()
        formData.append("file", image)

        const uploadResponse = await fetch("/api/posts/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Erro ao fazer upload da imagem")
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.imageUrl
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          content: content.trim(),
          imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar post")
      }

      setContent("")
      setImage(null)
      setImagePreview(null)
      onPostCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar post")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card className="p-6 bg-card border-border">
        <p className="text-muted-foreground text-center">Faça login para criar posts</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {user.full_name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <Textarea
            placeholder="No que você está pensando?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full resize-none"
            rows={3}
          />

          {imagePreview && (
            <div className="relative mt-4 rounded-lg overflow-hidden">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {error && <p className="text-destructive text-sm mt-2">{error}</p>}

          <div className="flex items-center justify-between mt-4">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <ImageIcon className="w-5 h-5 text-primary hover:text-accent transition" />
            </label>

            <Button onClick={handlePost} disabled={loading} className="bg-primary hover:bg-accent">
              {loading ? "Postando..." : "Postar"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}