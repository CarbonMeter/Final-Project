import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// DELETE - Remove a specific history entry
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, userId) => {
    try {
      const { id } = params

      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid history entry ID" }, { status: 400 })
      }

      const db = await getDatabase()

      // Verify the entry belongs to the user
      const entry = await db.collection("emissionHistory").findOne({
        _id: new ObjectId(id),
        userId,
      })

      if (!entry) {
        return NextResponse.json({ error: "History entry not found or access denied" }, { status: 404 })
      }

      // Delete the entry
      await db.collection("emissionHistory").deleteOne({
        _id: new ObjectId(id),
        userId,
      })

      return NextResponse.json({
        success: true,
        message: "History entry deleted successfully",
      })
    } catch (error) {
      console.error("History DELETE error:", error)
      return NextResponse.json({ error: "Failed to delete history entry" }, { status: 500 })
    }
  })
}

// GET - Fetch a specific history entry
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, userId) => {
    try {
      const { id } = params

      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid history entry ID" }, { status: 400 })
      }

      const db = await getDatabase()

      const entry = await db.collection("emissionHistory").findOne({
        _id: new ObjectId(id),
        userId,
      })

      if (!entry) {
        return NextResponse.json({ error: "History entry not found or access denied" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        entry: {
          ...entry,
          _id: entry._id.toString(),
        },
      })
    } catch (error) {
      console.error("History GET error:", error)
      return NextResponse.json({ error: "Failed to fetch history entry" }, { status: 500 })
    }
  })
}
