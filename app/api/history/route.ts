import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { getDatabase } from "@/lib/mongodb"

// GET - Fetch user's emission history
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const { searchParams } = new URL(req.url)
      const limit = Number.parseInt(searchParams.get("limit") || "10")
      const offset = Number.parseInt(searchParams.get("offset") || "0")
      const type = searchParams.get("type") // 'individual', 'family', 'company'

      const db = await getDatabase()

      // Build query
      const query: any = { userId }
      if (type) {
        query.calculationType = type
      }

      // Fetch history with pagination
      const history = await db
        .collection("emissionHistory")
        .find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray()

      // Get total count for pagination
      const totalCount = await db.collection("emissionHistory").countDocuments(query)

      // Calculate statistics
      const stats = await calculateUserStats(userId, db)

      return NextResponse.json({
        success: true,
        history: history.map((entry) => ({
          ...entry,
          _id: entry._id.toString(),
        })),
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
        stats,
      })
    } catch (error) {
      console.error("History GET error:", error)
      return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }
  })
}

// POST - Save new calculation (handled by calculate API, but keeping for completeness)
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const body = await req.json()
      const { data, results, calculationType = "individual" } = body

      if (!data || !results) {
        return NextResponse.json({ error: "Data and results are required" }, { status: 400 })
      }

      const db = await getDatabase()
      const historyEntry = {
        userId,
        calculationType,
        data,
        results,
        insights: [],
        createdAt: new Date(),
      }

      const insertResult = await db.collection("emissionHistory").insertOne(historyEntry)

      return NextResponse.json({
        success: true,
        id: insertResult.insertedId.toString(),
        message: "History entry saved successfully",
      })
    } catch (error) {
      console.error("History POST error:", error)
      return NextResponse.json({ error: "Failed to save history entry" }, { status: 500 })
    }
  })
}

async function calculateUserStats(userId: string, db: any) {
  try {
    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalCalculations: { $sum: 1 },
          averageFootprint: { $avg: "$results.totalMonthly" },
          lowestFootprint: { $min: "$results.totalMonthly" },
          highestFootprint: { $max: "$results.totalMonthly" },
          totalReduction: {
            $sum: {
              $subtract: [{ $first: "$results.totalMonthly" }, { $last: "$results.totalMonthly" }],
            },
          },
        },
      },
    ]

    const [stats] = await db.collection("emissionHistory").aggregate(pipeline).toArray()

    // Get monthly trend (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyTrend = await db
      .collection("emissionHistory")
      .aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            averageFootprint: { $avg: "$results.totalMonthly" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      .toArray()

    return {
      totalCalculations: stats?.totalCalculations || 0,
      averageFootprint: Math.round((stats?.averageFootprint || 0) * 100) / 100,
      lowestFootprint: Math.round((stats?.lowestFootprint || 0) * 100) / 100,
      highestFootprint: Math.round((stats?.highestFootprint || 0) * 100) / 100,
      totalReduction: Math.round((stats?.totalReduction || 0) * 100) / 100,
      monthlyTrend: monthlyTrend.map((month) => ({
        month: `${month._id.year}-${month._id.month.toString().padStart(2, "0")}`,
        footprint: Math.round(month.averageFootprint * 100) / 100,
        calculations: month.count,
      })),
    }
  } catch (error) {
    console.error("Error calculating user stats:", error)
    return {
      totalCalculations: 0,
      averageFootprint: 0,
      lowestFootprint: 0,
      highestFootprint: 0,
      totalReduction: 0,
      monthlyTrend: [],
    }
  }
}
