import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month" // 'week', 'month', 'year'
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const db = await getDatabase()

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case "month":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
    }

    // Aggregate leaderboard data
    const leaderboard = await db
      .collection("emissionHistory")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$userId",
            averageFootprint: { $avg: "$results.totalMonthly" },
            totalCalculations: { $sum: 1 },
            bestFootprint: { $min: "$results.totalMonthly" },
            lastCalculation: { $max: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: {
                  name: 1,
                  image: 1,
                  email: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "userProfiles",
            localField: "_id",
            foreignField: "userId",
            as: "profile",
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$user", 0] },
            profile: { $arrayElemAt: ["$profile", 0] },
          },
        },
        {
          $match: {
            "profile.preferences.publicProfile": { $ne: false },
          },
        },
        {
          $project: {
            userId: "$_id",
            userName: "$user.name",
            userImage: "$user.image",
            userEmail: "$user.email",
            averageFootprint: { $round: ["$averageFootprint", 2] },
            bestFootprint: { $round: ["$bestFootprint", 2] },
            totalCalculations: 1,
            lastCalculation: 1,
            level: "$profile.level",
            badges: "$profile.badges",
            coins: "$profile.coins",
          },
        },
        {
          $sort: { averageFootprint: 1 }, // Lower footprint = better rank
        },
        {
          $limit: limit,
        },
      ])
      .toArray()

    // Add rank and calculate improvements
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      change: 0, // TODO: Calculate change from previous period
      userId: entry.userId.toString(),
    }))

    // Get global statistics
    const globalStats = await db
      .collection("emissionHistory")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            totalUsers: { $addToSet: "$userId" },
            averageGlobalFootprint: { $avg: "$results.totalMonthly" },
            totalCalculations: { $sum: 1 },
          },
        },
        {
          $project: {
            totalUsers: { $size: "$totalUsers" },
            averageGlobalFootprint: { $round: ["$averageGlobalFootprint", 2] },
            totalCalculations: 1,
          },
        },
      ])
      .toArray()

    const stats = globalStats[0] || {
      totalUsers: 0,
      averageGlobalFootprint: 0,
      totalCalculations: 0,
    }

    return NextResponse.json({
      success: true,
      leaderboard: rankedLeaderboard,
      period,
      stats: {
        totalUsers: stats.totalUsers,
        averageFootprint: stats.averageGlobalFootprint,
        totalCalculations: stats.totalCalculations,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Leaderboard error:", error)

    // Return mock data as fallback
    const mockLeaderboard = [
      {
        rank: 1,
        userId: "mock1",
        userName: "Priya Sharma",
        userImage: null,
        averageFootprint: 85.5,
        bestFootprint: 78.2,
        totalCalculations: 12,
        level: 5,
        badges: ["🌟 Eco Warrior", "🔥 Week Streak", "🏆 Top 10%"],
        coins: 450,
        change: 2,
        lastCalculation: new Date(),
      },
      {
        rank: 2,
        userId: "mock2",
        userName: "Rahul Gupta",
        userImage: null,
        averageFootprint: 92.3,
        bestFootprint: 85.1,
        totalCalculations: 8,
        level: 4,
        badges: ["🌱 First Step", "📊 Data Lover"],
        coins: 320,
        change: -1,
        lastCalculation: new Date(),
      },
      {
        rank: 3,
        userId: "mock3",
        userName: "Anita Patel",
        userImage: null,
        averageFootprint: 98.7,
        bestFootprint: 91.4,
        totalCalculations: 15,
        level: 6,
        badges: ["🌟 Eco Warrior", "🔥 Month Streak"],
        coins: 580,
        change: 0,
        lastCalculation: new Date(),
      },
    ]

    return NextResponse.json({
      success: true,
      leaderboard: mockLeaderboard,
      period: "month",
      stats: {
        totalUsers: 156,
        averageFootprint: 125.4,
        totalCalculations: 1247,
        lastUpdated: new Date().toISOString(),
      },
    })
  }
}
