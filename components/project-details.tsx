"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, UserPlus, User, Mail, Trash2, Star, GitBranch, Eye, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Member {
  id: number
  name: string
  email: string
  role: string
}

interface Project {
  id: number
  name: string
  description: string
  language: string
  repositoryUrl: string
  status: string
  stars_count: number
  forks_count: number
  members_count: number
  created_at: string
}

interface ProjectDetailsProps {
  project: Project | null
  onClose: () => void
  userId: number
}

export function ProjectDetails({ project, onClose, userId }: ProjectDetailsProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("Membro")

  useEffect(() => {
    if (project?.id) {
      fetchMembers()
    }
  }, [project?.id])

  const fetchMembers = async () => {
    if (!project?.id) return

    try {
      const response = await fetch(`/api/projects/${project.id}/members`)
      const data = await response.json()
      setMembers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao buscar membros:", error)
      setMembers([])
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project?.id || !newMemberEmail.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          email: newMemberEmail,
          role: newMemberRole,
          invitedBy: userId,
        }),
      })

      if (!response.ok) throw new Error("Erro ao adicionar membro")

      // Atualizar lista de membros
      fetchMembers()
      setNewMemberEmail("")
      setShowAddMember(false)
    } catch (error) {
      console.error("Erro ao adicionar membro:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    if (!project?.id) return

    if (!confirm("Tem certeza que deseja remover este membro?")) return

    try {
      const response = await fetch(`/api/projects/${project.id}/members/${memberId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao remover membro")

      // Atualizar lista de membros
      setMembers(members.filter((member) => member.id !== memberId))
    } catch (error) {
      console.error("Erro ao remover membro:", error)
    }
  }

  if (!project) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{project.name}</h2>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-4">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Informações do projeto */}
            <div className="lg:col-span-2 space-y-6">
              {/* Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center bg-secondary/50">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    <span className="text-lg font-semibold">{project.stars_count || 0}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Estrelas</p>
                </Card>
                <Card className="p-4 text-center bg-secondary/50">
                  <div className="flex items-center justify-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    <span className="text-lg font-semibold">{project.forks_count || 0}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Forks</p>
                </Card>
                <Card className="p-4 text-center bg-secondary/50">
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-lg font-semibold">{members.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Membros</p>
                </Card>
                <Card className="p-4 text-center bg-secondary/50">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-lg font-semibold">
                      {new Date(project.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Criado em</p>
                </Card>
              </div>

              {/* Detalhes */}
              <Card className="p-6 bg-secondary/50">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Detalhes do Projeto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground min-w-24">Linguagem:</span>
                    <Badge variant="secondary">{project.language || "Indefinido"}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground min-w-24">Status:</span>
                    <Badge variant={project.status === "Ativo" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground min-w-24">Repositório:</span>
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm truncate"
                    >
                      {project.repositoryUrl || "Não definido"}
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* Coluna 2: Membros */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">Membros do Projeto</h3>
                <Button
                  size="sm"
                  onClick={() => setShowAddMember(true)}
                  className="bg-primary hover:bg-accent"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {/* Lista de membros */}
              <div className="space-y-3">
                {members.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum membro adicionado</p>
                  </div>
                ) : (
                  members.map((member) => (
                    <Card key={member.id} className="p-4 bg-secondary/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{member.name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{member.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{member.role}</Badge>
                          {member.id !== userId && (
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Modal para adicionar membro */}
              {showAddMember && (
                <Card className="p-4 bg-card border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">Adicionar Membro</h4>
                    <button
                      onClick={() => setShowAddMember(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleAddMember} className="space-y-3">
                    <div>
                      <Input
                        type="email"
                        placeholder="Email do membro"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="bg-secondary border-border"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="w-full p-2 bg-secondary border border-border rounded text-foreground text-sm"
                      >
                        <option value="Membro">Membro</option>
                        <option value="Admin">Admin</option>
                        <option value="Desenvolvedor">Desenvolvedor</option>
                        <option value="Designer">Designer</option>
                        <option value="Product Owner">Product Owner</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddMember(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        className="flex-1 bg-primary hover:bg-accent"
                        disabled={loading}
                      >
                        {loading ? "Adicionando..." : "Adicionar"}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button
              className="bg-primary hover:bg-accent"
              onClick={() => window.open(project.repositoryUrl, "_blank")}
              disabled={!project.repositoryUrl}
            >
              Acessar Repositório
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}