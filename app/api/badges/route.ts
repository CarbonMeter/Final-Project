import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { getDatabase } from "@/lib/mongodb"

// GET - Fetch available badges and user's earned badges
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const db = await getDatabase()

      // Get user's current badges
      const userProfile = await db.collection("userProfiles").findOne({ userId })
      const earnedBadges = userProfile?.badges || []

      // Define all available badges
      const allBadges = [
        {
          id: "first-step",
          name: "🌱 First Step",
          description: "Complete your first carbon footprint calculation",
          rarity: "common",
          coins: 10,
          criteria: { type: "calculations", value: 1, comparison: "greater_than_equal" },
        },
        {
          id: "eco-warrior",
          name: "🌟 Eco Warrior",
          description: "Achieve a footprint below 100 kg CO₂/month",
          rarity: "rare",
          coins: 50,
          criteria: { type: "footprint", value: 100, comparison: "less_than" },
        },
        {
          id: "week-streak",
          name: "🔥 Week Streak",
          description: "Calculate your footprint for 7 consecutive days",
          rarity: "rare",
          coins: 30,
          criteria: { type: "streak", value: 7, comparison: "greater_than_equal" },
        },
        {
          id: "month-streak",
          name: "🔥 Month Streak",
          description: "Calculate your footprint for 30 consecutive days",
          rarity: "epic",
          coins: 100,
          criteria: { type: "streak", value: 30, comparison: "greater_than_equal" },
        },
        {
          id: "data-lover",
          name: "📊 Data Lover",
          description: "Complete 10 carbon footprint calculations",
          rarity: "common",
          coins: 25,
          criteria: { type: "calculations", value: 10, comparison: "greater_than_equal" },
        },
        {
          id: "top-25",
          name: "🏆 Top 25%",
          description: "Rank in the top 25% of users",
          rarity: "epic",
          coins: 75,
          criteria: { type: "percentile", value: 25, comparison: "less_than_equal" },
        },
        {
          id: "top-10",
          name: "🏆 Top 10%",
          description: "Rank in the top 10% of users",
          rarity: "legendary",
          coins: 150,
          criteria: { type: "percentile", value: 10, comparison: "less_than_equal" },
        },
        {
          id: "improvement-master",
          name: "📈 Improvement Master",
          description: "Reduce your footprint by 20% from your first calculation",
          rarity: "epic",
          coins: 100,
          criteria: { type: "improvement", value: 20, comparison: "greater_than_equal" },
        },
        {
          id: "green-champion",
          name: "🌿 Green Champion",
          description: "Maintain a footprint below 80 kg CO₂/month for 3 months",
          rarity: "legendary",
          coins: 200,
          criteria: { type: "sustained_footprint", value: 80, comparison: "less_than" },
        },
        {
          id: "community-helper",
          name: "🤝 Community Helper",
          description: "Help others by sharing tips in the community",
          rarity: "rare",
          coins: 40,
          criteria: { type: "community_posts", value: 5, comparison: "greater_than_equal" },
        },
      ]

      // Check which badges the user can earn
      const eligibleBadges = await checkEligibleBadges(userId, allBadges, userProfile, db)

      return NextResponse.json({
        success: true,
        earnedBadges: earnedBadges,
        availableBadges: allBadges.map((badge) => ({
          ...badge,
          earned: earnedBadges.includes(badge.name),
          eligible: eligibleBadges.includes(badge.id),
        })),
        totalCoins: userProfile?.coins || 0,
        level: userProfile?.level || 1,
      })
    } catch (error) {
      console.error("Badges GET error:", error)
      return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
    }
  })
}

async function checkEligibleBadges(userId: string, allBadges: any[], userProfile: any, db: any): Promise<string[]> {
  const eligible: string[] = []

  if (!userProfile) return eligible

  try {
    // Get user's calculation history
    const calculations = await db.collection("emissionHistory").find({ userId }).sort({ createdAt: 1 }).toArray()

    for (const badge of allBadges) {
      if (userProfile.badges?.includes(badge.name)) continue // Already earned

      const { criteria } = badge
      let isEligible = false

      switch (criteria.type) {
        case "calculations":
          isEligible = userProfile.totalCalculations >= criteria.value
          break

        case "footprint":
          isEligible = userProfile.bestFootprint > 0 && userProfile.bestFootprint < criteria.value
          break

        case "streak":
          isEligible = userProfile.currentStreak >= criteria.value
          break

        case "percentile":
          // This would require leaderboard calculation - simplified for now
          isEligible = userProfile.bestFootprint < 90 // Rough estimate
          break

        case "improvement":
          if (calculations.length >= 2) {
            const first = calculations[0].results.totalMonthly
            const best = userProfile.bestFootprint
            const improvement = ((first - best) / first) * 100
            isEligible = improvement >= criteria.value
          }
          break

        case "sustained_footprint":
          // Check if user maintained low footprint for required period
          const recentCalculations = calculations.slice(-10) // Last 10 calculations
          const sustainedCount = recentCalculations.filter((calc) => calc.results.totalMonthly < criteria.value).length
          isEligible = sustainedCount >= 5 // Simplified check
          break
      }

      if (isEligible) {
        eligible.push(badge.id)
      }
    }
  } catch (error) {
    console.error("Error checking eligible badges:", error)
  }

  return eligible
}
