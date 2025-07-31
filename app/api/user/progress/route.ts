import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Mock user progress data since we don't have database connection
    const mockProgress = {
      userId: "mock-user-id",
      currentStreak: 15,
      totalSavings: 450,
      completedChallenges: ["meatless-monday", "bike-to-work", "energy-saver"],
      badges: ["🌱 First Step", "🚲 Bike Champion", "⚡ Energy Saver"],
      lastCalculation: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(mockProgress)
  } catch (error) {
    console.error("Progress fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
