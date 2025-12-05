"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Compass,
  Users,
  Code2,
  LayoutGrid,
  Calendar,
  Bookmark,
  Zap,
  Settings,
  HelpCircle,
  LogOut,
  Hexagon,
} from "lucide-react"

const menuItems = [
  { href: "/feed", icon: Compass, label: "Explorar" },
  { href: "/amigos", icon: Users, label: "Amigos" },
  { href: "/projetos", icon: Code2, label: "Projetos" },
  { href: "/kanban", icon: LayoutGrid, label: "Kanban" },
  { href: "/calendario", icon: Calendar, label: "Calendário" },
  { href: "/salvos", icon: Bookmark, label: "Salvos" },
  { href: "/atividades", icon: Zap, label: "Atividades" },
  { href: "/configuracoes", icon: Settings, label: "Configurações" },
  { href: "/ajuda", icon: HelpCircle, label: "Ajuda" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Hexagon className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">Nexus</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </Link>
      </div>
    </aside>
  )
}
