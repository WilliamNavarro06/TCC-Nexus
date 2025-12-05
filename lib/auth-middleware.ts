import { type NextRequest, NextResponse } from "next/server"
import { getUserById } from "./db-utils"

export async function authenticateUser(request: NextRequest) {
  try {
    const userId = request.cookies.get("userId")?.value

    if (!userId) {
      return null
    }

    const user = await getUserById(Number.parseInt(userId))
    return user || null
  } catch (error) {
    console.error("Auth middleware error:", error)
    return null
  }
}

export function createProtectedResponse(allowedMethods: string[]) {
  return (handler: Function) => async (request: NextRequest) => {
    if (!allowedMethods.includes(request.method)) {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
    }

    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(request, user)
  }
}
