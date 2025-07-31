import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { getDatabase } from "@/lib/mongodb"

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const db = await getDatabase()

      // Get user profile
      const profile = await db.collection("userProfiles").findOne({ userId })

      if (!profile) {
        // Create default profile if it doesn't exist
        const defaultProfile = {
          userId,
          totalCalculations: 0,
          averageFootprint: 0,
          bestFootprint: 0,
          currentStreak: 0,
          longestStreak: 0,
          badges: ["🌱 First Step"],
          level: 1,
          coins: 0,
          preferences: {
            units: "metric",
            notifications: true,
            publicProfile: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        await db.collection("userProfiles").insertOne(defaultProfile)

        return NextResponse.json({
          success: true,
          profile: {
            ...defaultProfile,
            _id: defaultProfile._id?.toString(),
          },
        })
      }

      return NextResponse.json({
        success: true,
        profile: {
          ...profile,
          _id: profile._id.toString(),
        },
      })
    } catch (error) {
      console.error("Profile GET error:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
  })
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const body = await req.json()
      const { preferences, monthlyGoal } = body

      const db = await getDatabase()

      const updateData: any = {
        updatedAt: new Date(),
      }

      if (preferences) {
        updateData.preferences = preferences
      }

      if (monthlyGoal !== undefined) {
        updateData.monthlyGoal = monthlyGoal
      }

      const result = await db.collection("userProfiles").updateOne({ userId }, { $set: updateData }, { upsert: true })

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        modified: result.modifiedCount > 0,
      })
    } catch (error) {
      console.error("Profile PUT error:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
  })
}
