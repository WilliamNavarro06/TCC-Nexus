"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface CreateProjectProps {
  userId?: number
  onClose: () => void
  onProjectCreated: () => void
}

export function CreateProject({ userId, onClose, onProjectCreated }: CreateProjectProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "",
    repositoryUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !formData.name.trim()) {
      setError("Nome do projeto é obrigatório")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      })

      if (!response.ok) throw new Error("Erro ao criar projeto")

      onProjectCreated()
    } catch (err) {
      setError("Erro ao criar projeto")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Novo Projeto</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Nome</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome do projeto"
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição do projeto"
              className="w-full p-2 bg-secondary border border-border rounded text-foreground text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Linguagem</label>
            <Input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="ex: JavaScript, Python"
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">URL do Repositório</label>
            <Input
              type="text"
              name="repositoryUrl"
              value={formData.repositoryUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="bg-secondary border-border"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button className="bg-primary hover:bg-accent" disabled={loading} type="submit">
              {loading ? "Criando..." : "Criar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
