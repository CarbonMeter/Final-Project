import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const postId = new ObjectId(params.id)
    const userId = session.user.id

    const post = await db.collection("communityPosts").findOne({ _id: postId })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const likes = post.likes || []
    const isLiked = likes.includes(userId)

    let updateOperation
    if (isLiked) {
      // Unlike
      updateOperation = { $pull: { likes: userId } }
    } else {
      // Like
      updateOperation = { $addToSet: { likes: userId } }
    }

    await db.collection("communityPosts").updateOne({ _id: postId }, updateOperation)

    return NextResponse.json({
      liked: !isLiked,
      likesCount: isLiked ? likes.length - 1 : likes.length + 1,
    })
  } catch (error) {
    console.error("Like toggle error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
