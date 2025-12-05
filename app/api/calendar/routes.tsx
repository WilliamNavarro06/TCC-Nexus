import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Buscar eventos do usuário
    const events = await query(
      `SELECT 
        id,
        title,
        description,
        start_date as start,
        end_date as end,
        color,
        user_id,
        created_at
      FROM calendar_events 
      WHERE user_id = ?
      ORDER BY start_date ASC`,
      [userId]
    )

    return NextResponse.json(Array.isArray(events) ? events : [])

  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, start, end, color, userId } = await request.json()

    if (!title || !start || !userId) {
      return NextResponse.json({ error: "Title, start date and user ID are required" }, { status: 400 })
    }

    // Inserir novo evento
    const result = await query(
      `INSERT INTO calendar_events 
        (title, description, start_date, end_date, color, user_id, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [title, description || "", start, end || start, color || "#3b82f6", userId]
    )

    let eventId = 0
    if (result && typeof result === 'object' && 'insertId' in result) {
      eventId = (result as any).insertId
    }

    // Buscar o evento criado
    const newEvent = await query(
      `SELECT 
        id,
        title,
        description,
        start_date as start,
        end_date as end,
        color,
        user_id,
        created_at
      FROM calendar_events 
      WHERE id = ?`,
      [eventId]
    )

    return NextResponse.json(Array.isArray(newEvent) && newEvent.length > 0 ? newEvent[0] : null)

  } catch (error) {
    console.error("Error creating calendar event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, start, end, color } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    await query(
      `UPDATE calendar_events 
       SET title = ?, description = ?, start_date = ?, end_date = ?, color = ?
       WHERE id = ?`,
      [title, description || "", start, end || start, color || "#3b82f6", id]
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Error updating calendar event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    await query(
      `DELETE FROM calendar_events WHERE id = ?`,
      [id]
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Error deleting calendar event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}