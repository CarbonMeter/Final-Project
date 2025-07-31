import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Get all user progress with user details
    const userProgressList = await db.collection("userProgress").find({}).toArray()
    const leaderboard = []

    for (const progress of userProgressList) {
      try {
        const user = await db.collection("users").findOne({ _id: new ObjectId(progress.userId) })
        if (user) {
          const points =
            (progress.totalSavings || 0) * 0.1 +
            (progress.currentStreak || 0) * 10 +
            (progress.badges?.length || 0) * 50

          leaderboard.push({
            id: progress.userId,
            name: user.name,
            email: user.email,
            totalSavings: progress.totalSavings || 0,
            currentStreak: progress.currentStreak || 0,
            badges: progress.badges || [],
            points: Math.round(points),
            avatar: `/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`,
          })
        }
      } catch (err) {
        console.error("Error processing user:", progress.userId, err)
      }
    }

    // Sort by points and add rank
    leaderboard.sort((a, b) => b.points - a.points)
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }))

    console.log("Leaderboard generated:", rankedLeaderboard.length, "users")
    return NextResponse.json(rankedLeaderboard.slice(0, 10))
  } catch (error) {
    console.error("Leaderboard fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
