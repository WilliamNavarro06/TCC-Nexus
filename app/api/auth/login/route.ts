import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Define a proper type for the user data
interface User {
  id: number
  email: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  role: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validações
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    const userDataResult = await query(
      "SELECT id, email, username, full_name, avatar_url, bio, role, password FROM users WHERE email = ?",
      [email]
    )

    // Type assertion for the query result
    const users = userDataResult as User[]
    
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      )
    }

    const userData = users[0]

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, userData.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      )
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: userData.id, email, role: userData.role },
      process.env.JWT_SECRET || "default-secret-key",
      {
        expiresIn: "7d",
      }
    )

    return NextResponse.json({
      token,
      userId: userData.id,
      role: userData.role,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        role: userData.role,
      },
      message: "Login realizado com sucesso",
    })
  } catch (error) {
    console.log("[v0] Login error:", error)
    return NextResponse.json(
      {
        error:
          "Erro ao fazer login: " +
          (error instanceof Error ? error.message : "Erro desconhecido"),
      },
      { status: 500 }
    )
  }
}