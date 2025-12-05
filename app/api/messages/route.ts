import { NextResponse, type NextRequest } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const result = await query(
      `
      SELECT 
        c.id,
        CASE 
          WHEN c.user_1_id = ? THEN c.user_2_id
          ELSE c.user_1_id
        END as other_user_id,
        u.full_name as other_user_name,
        u.username,
        m.content as last_message,
        m.created_at
      FROM conversations c
      JOIN users u ON (
        CASE 
          WHEN c.user_1_id = ? THEN u.id = c.user_2_id
          ELSE u.id = c.user_1_id
        END
      )
      LEFT JOIN messages m ON m.conversation_id = c.id AND m.id = (
        SELECT id FROM messages 
        WHERE conversation_id = c.id 
        ORDER BY created_at DESC 
        LIMIT 1
      )
      WHERE c.user_1_id = ? OR c.user_2_id = ?
      ORDER BY COALESCE(m.created_at, c.updated_at) DESC
    `,
      [userId, userId, userId, userId],
    )

    return NextResponse.json(result || [])
  } catch (error) {
    console.error("Erro ao buscar conversas:", error)
    return NextResponse.json({ error: "Erro ao buscar conversas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, otherUserId } = body

    if (!userId || !otherUserId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingConv = await query(
      `
      SELECT id FROM conversations 
      WHERE (user_1_id = ? AND user_2_id = ?) OR (user_1_id = ? AND user_2_id = ?)
    `,
      [userId, otherUserId, otherUserId, userId],
    )

    let conversationId

    if ((existingConv as any).length > 0) {
      conversationId = (existingConv as any)[0].id
    } else {
      const result = await query("INSERT INTO conversations (user_1_id, user_2_id) VALUES (?, ?)", [
        userId,
        otherUserId,
      ])
      conversationId = (result as any).insertId
    }

    return NextResponse.json({ conversationId, success: true })
  } catch (error) {
    console.error("Erro ao criar/obter conversa:", error)
    return NextResponse.json({ error: "Erro ao criar conversa" }, { status: 500 })
  }
}
