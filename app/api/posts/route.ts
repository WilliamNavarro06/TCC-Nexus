import { type NextRequest, NextResponse } from "next/server"
import { getPostsWithAuthor, createPost, createActivity } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const posts = await getPostsWithAuthor(limit, offset)
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, content, imageUrl } = body

    if (!userId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await createPost(userId, content, imageUrl)
    await createActivity(userId, "posted", "post", (result as any).insertId, content)

    return NextResponse.json({
      success: true,
      postId: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
