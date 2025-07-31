import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>,
) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
    }

    return handler(request, token.id as string)
  } catch (error) {
    console.error("Auth middleware error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.id) {
      return null
    }

    return {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
    }
  } catch (error) {
    console.error("Get authenticated user error:", error)
    return null
  }
}
