import { type NextRequest, NextResponse } from "next/server"
import { getUpcomingEventsUser, createEvent } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const events = await getUpcomingEventsUser(Number.parseInt(userId))
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, startDate, endDate, location, type, projectId } = body

    if (!userId || !title || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await createEvent(userId, title, description, startDate, endDate, location, type, projectId)
    return NextResponse.json({
      success: true,
      eventId: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
