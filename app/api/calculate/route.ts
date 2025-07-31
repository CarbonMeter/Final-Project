import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { getDatabase } from "@/lib/mongodb"
import { calculateEmissions, generateInsights, type EmissionData } from "@/lib/emission-calculator"

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const body = await req.json()
      const { data, calculationType = "individual" } = body

      // Validate input data
      if (!data || !data.transportation || !data.energy || !data.food || !data.lifestyle) {
        return NextResponse.json({ error: "Invalid input data. All categories are required." }, { status: 400 })
      }

      // Calculate emissions
      const results = calculateEmissions(data as EmissionData)
      const insights = generateInsights(results)

      // Save to database
      const db = await getDatabase()
      const historyEntry = {
        userId,
        calculationType,
        data,
        results,
        insights,
        createdAt: new Date(),
      }

      const insertResult = await db.collection("emissionHistory").insertOne(historyEntry)

      // Update user profile stats
      await updateUserProfile(userId, results, db)

      // Award badges if applicable
      await checkAndAwardBadges(userId, results, db)

      return NextResponse.json({
        success: true,
        id: insertResult.insertedId.toString(),
        results,
        insights,
        message: "Calculation completed successfully!",
      })
    } catch (error) {
      console.error("Calculate API error:", error)
      return NextResponse.json({ error: "Failed to calculate emissions" }, { status: 500 })
    }
  })
}

async function updateUserProfile(userId: string, results: any, db: any) {
  try {
    const profile = await db.collection("userProfiles").findOne({ userId })

    if (!profile) {
      // Create new profile
      await db.collection("userProfiles").insertOne({
        userId,
        totalCalculations: 1,
        averageFootprint: results.totalMonthly,
        bestFootprint: results.totalMonthly,
        currentStreak: 1,
        longestStreak: 1,
        badges: ["🌱 First Step"],
        level: 1,
        coins: 10,
        preferences: {
          units: "metric",
          notifications: true,
          publicProfile: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } else {
      // Update existing profile
      const totalCalcs = profile.totalCalculations + 1
      const newAverage = (profile.averageFootprint * profile.totalCalculations + results.totalMonthly) / totalCalcs
      const newBest = Math.min(profile.bestFootprint, results.totalMonthly)

      // Calculate streak
      const lastCalculation = await db
        .collection("emissionHistory")
        .findOne({ userId, _id: { $ne: profile._id } }, { sort: { createdAt: -1 } })

      const daysSinceLastCalc = lastCalculation
        ? Math.floor((new Date().getTime() - lastCalculation.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        : 0

      const currentStreak = daysSinceLastCalc <= 7 ? profile.currentStreak + 1 : 1
      const longestStreak = Math.max(profile.longestStreak, currentStreak)

      // Award coins based on improvement
      let coinsEarned = 5 // base coins
      if (results.totalMonthly < profile.bestFootprint) coinsEarned += 15 // new personal best
      if (currentStreak > profile.currentStreak) coinsEarned += currentStreak * 2 // streak bonus

      // Calculate level (every 100 coins = 1 level)
      const newCoins = profile.coins + coinsEarned
      const newLevel = Math.floor(newCoins / 100) + 1

      await db.collection("userProfiles").updateOne(
        { userId },
        {
          $set: {
            totalCalculations: totalCalcs,
            averageFootprint: Math.round(newAverage * 100) / 100,
            bestFootprint: newBest,
            currentStreak,
            longestStreak,
            level: newLevel,
            coins: newCoins,
            updatedAt: new Date(),
          },
        },
      )
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
  }
}

async function checkAndAwardBadges(userId: string, results: any, db: any) {
  try {
    const profile = await db.collection("userProfiles").findOne({ userId })
    if (!profile) return

    const newBadges = []

    // Check various badge criteria
    if (results.totalMonthly < 100 && !profile.badges.includes("🌟 Eco Warrior")) {
      newBadges.push("🌟 Eco Warrior")
    }

    if (profile.currentStreak >= 7 && !profile.badges.includes("🔥 Week Streak")) {
      newBadges.push("🔥 Week Streak")
    }

    if (profile.totalCalculations >= 10 && !profile.badges.includes("📊 Data Lover")) {
      newBadges.push("📊 Data Lover")
    }

    if (results.comparison.percentile <= 25 && !profile.badges.includes("🏆 Top 25%")) {
      newBadges.push("🏆 Top 25%")
    }

    if (newBadges.length > 0) {
      await db.collection("userProfiles").updateOne(
        { userId },
        {
          $addToSet: { badges: { $each: newBadges } },
          $inc: { coins: newBadges.length * 20 }, // 20 coins per badge
        },
      )
    }
  } catch (error) {
    console.error("Error checking badges:", error)
  }
}
