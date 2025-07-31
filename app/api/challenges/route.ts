import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const challenges = await db.collection("challenges").find({}).sort({ createdAt: -1 }).toArray()

    console.log("Fetched challenges:", challenges.length)
    return NextResponse.json(challenges)
  } catch (error) {
    console.error("Challenges fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const challengeData = await request.json()

    const db = await getDatabase()
    const result = await db.collection("challenges").insertOne({
      ...challengeData,
      participants: [],
      createdAt: new Date(),
    })

    return NextResponse.json({
      ...challengeData,
      _id: result.insertedId,
      participants: [],
    })
  } catch (error) {
    console.error("Challenge creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
