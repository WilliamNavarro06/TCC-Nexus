import { NextResponse, type NextRequest } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const { conversationId } = params

    const result = await query(
      `
      SELECT 
        m.id,
        m.sender_id,
        m.content,
        m.created_at,
        u.full_name as sender_name,
        u.username as sender_username
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `,
      [conversationId],
    )

    return NextResponse.json(result || [])
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const { conversationId } = params
    const body = await request.json()
    const { senderId, content } = body

    if (!senderId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await query("INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)", [
      conversationId,
      senderId,
      content,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
  }
}
