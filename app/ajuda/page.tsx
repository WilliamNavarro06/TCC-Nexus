"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    id: 1,
    question: "Como criar uma conta no Nexus?",
    answer: 'Clique no botão "Criar Conta" na página inicial e preencha seus dados.',
  },
  {
    id: 2,
    question: "Como posso colaborar em um projeto?",
    answer: 'Navegue até a página de Projetos, encontre o projeto desejado e clique em "Colaborar".',
  },
  {
    id: 3,
    question: "Como usar o Kanban?",
    answer: "O Kanban ajuda você a organizar tarefas em colunas: A Fazer, Em Progresso, Revisão e Concluído.",
  },
  {
    id: 4,
    question: "Como adicionar amigos?",
    answer: 'Na página de Amigos, clique no botão "Adicionar" ao lado do perfil que deseja seguir.',
  },
]

export default function AjudaPage() {
  const [search, setSearch] = useState("")

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Central de Ajuda</h1>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar perguntas frequentes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id} className="p-6 bg-card border-border hover:border-primary/50 transition-all">
                  <h3 className="font-bold text-lg text-foreground">{faq.question}</h3>
                  <p className="text-foreground mt-2">{faq.answer}</p>
                </Card>
              ))}
            </div>

            {/* Support Contact */}
            <Card className="p-6 bg-accent/10 border-primary/50">
              <h3 className="font-bold text-foreground text-lg mb-3">Ainda precisa de ajuda?</h3>
              <p className="text-foreground mb-4">Entre em contato com nosso time de suporte</p>
              <Button className="bg-primary hover:bg-accent">Enviar Mensagem</Button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
