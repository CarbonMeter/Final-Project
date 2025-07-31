import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    // Test the connection by pinging the database
    await db.admin().ping()

    // Get collection counts
    const collections = await db.listCollections().toArray()
    const stats = await Promise.all(
      collections.map(async (collection) => ({
        name: collection.name,
        count: await db.collection(collection.name).countDocuments(),
      })),
    )

    return NextResponse.json({
      status: "Connected successfully!",
      database: "carbonmeter",
      collections: stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "Connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
