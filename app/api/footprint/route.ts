import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session in footprint POST:", session)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Footprint data received:", data)

    const { transportation, energy, food, lifestyle } = data

    // Calculate emissions with improved formulas
    const transportEmissions =
      transportation.carMiles * 0.4 + transportation.flights * 200 + transportation.publicTransport * 0.1
    const energyEmissions = energy.electricity * 0.0005 + energy.gas * 0.002 - (energy.renewable ? 500 : 0)
    const foodEmissions =
      food.meatFrequency * 10 + food.foodWaste * 0.1 - (food.localFood ? 200 : 0) - (food.organicFood ? 100 : 0)
    const lifestyleEmissions =
      lifestyle.shopping * 0.01 - (lifestyle.recycling ? 300 : 0) - lifestyle.wasteReduction * 2

    const breakdown = {
      transportation: Math.max(0, Math.round((transportEmissions * 365) / 1000)),
      energy: Math.max(0, Math.round((energyEmissions * 365) / 1000)),
      food: Math.max(0, Math.round((foodEmissions * 365) / 1000)),
      lifestyle: Math.max(0, Math.round((lifestyleEmissions * 365) / 1000)),
    }

    const totalEmissions = breakdown.transportation + breakdown.energy + breakdown.food + breakdown.lifestyle

    const footprintData = {
      userId: session.user.id,
      transportation,
      energy,
      food,
      lifestyle,
      totalEmissions,
      breakdown,
      createdAt: new Date(),
    }

    const db = await getDatabase()
    const result = await db.collection("carbonFootprints").insertOne(footprintData)
    console.log("Footprint saved:", result.insertedId)

    // Update user progress
    const userProgress = await db.collection("userProgress").findOne({
      userId: session.user.id,
    })

    if (userProgress) {
      const lastCalculation = new Date(userProgress.lastCalculation)
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - lastCalculation.getTime()) / (1000 * 60 * 60 * 24))

      let newStreak = userProgress.currentStreak
      if (daysDiff === 1) {
        newStreak += 1
      } else if (daysDiff > 1) {
        newStreak = 1
      }

      // Calculate savings compared to average
      const averageEmissions = 4800 // Global average
      const savings = Math.max(0, averageEmissions - totalEmissions)

      // Award badges based on footprint
      const newBadges = [...(userProgress.badges || [])]
      if (totalEmissions < 3000 && !newBadges.includes("🌱 Eco Warrior")) {
        newBadges.push("🌱 Eco Warrior")
      }
      if (energy.renewable && !newBadges.includes("🔌 Green Energy Champion")) {
        newBadges.push("🔌 Green Energy Champion")
      }
      if (food.localFood && !newBadges.includes("🥗 Local Food Hero")) {
        newBadges.push("🥗 Local Food Hero")
      }
      if (lifestyle.recycling && !newBadges.includes("♻️ Recycling Pro")) {
        newBadges.push("♻️ Recycling Pro")
      }
      if (transportation.carType === "electric" && !newBadges.includes("⚡ Electric Pioneer")) {
        newBadges.push("⚡ Electric Pioneer")
      }

      await db.collection("userProgress").updateOne(
        { userId: session.user.id },
        {
          $set: {
            currentStreak: newStreak,
            totalSavings: (userProgress.totalSavings || 0) + savings,
            badges: newBadges,
            lastCalculation: new Date(),
            updatedAt: new Date(),
          },
        },
      )
      console.log("User progress updated")
    }

    return NextResponse.json({
      ...footprintData,
      _id: result.insertedId,
    })
  } catch (error) {
    console.error("Footprint calculation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const footprints = await db
      .collection("carbonFootprints")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(12)
      .toArray()

    return NextResponse.json(footprints)
  } catch (error) {
    console.error("Footprint fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
