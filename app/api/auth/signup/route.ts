import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Validações
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (!["student", "teacher"].includes(role)) {
      return NextResponse.json({ error: "Role inválido" }, { status: 400 })
    }

    try {
      const existingUsers = await query("SELECT id FROM users WHERE email = ?", [email])

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
      }
    } catch (checkError) {
      console.log("[v0] Erro ao verificar email:", checkError)
      // Continuar mesmo se a tabela não existe ainda
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await query(
      "INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
      [name, email, hashedPassword, role],
    )

    const userId = (result as any).insertId

    // Gerar token JWT
    const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET || "default-secret-key", {
      expiresIn: "7d",
    })

    return NextResponse.json({
      token,
      userId,
      role,
      message: "Cadastro realizado com sucesso",
    })
  } catch (error) {
    console.log("[v0] Signup error:", error)
    return NextResponse.json(
      { error: "Erro ao criar conta: " + (error instanceof Error ? error.message : "Erro desconhecido") },
      { status: 500 },
    )
  }
}
