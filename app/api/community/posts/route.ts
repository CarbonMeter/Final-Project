import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const posts = await db.collection("communityPosts").find({}).sort({ createdAt: -1 }).limit(20).toArray()

    console.log("Fetched posts:", posts.length)
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Posts fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session in post creation:", session)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please sign in to post" }, { status: 401 })
    }

    const { content, category } = await request.json()
    console.log("Post data:", { content, category })

    if (!content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's badges
    const db = await getDatabase()
    const userProgress = await db.collection("userProgress").findOne({
      userId: session.user.id,
    })

    const postData = {
      userId: session.user.id,
      author: session.user.name || "Anonymous",
      avatar: session.user.image || "",
      content,
      category,
      likes: [],
      comments: [],
      badges: userProgress?.badges || ["🌱 First Step"],
      createdAt: new Date(),
    }

    const result = await db.collection("communityPosts").insertOne(postData)
    console.log("Post created:", result.insertedId)

    return NextResponse.json({
      ...postData,
      _id: result.insertedId,
    })
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
