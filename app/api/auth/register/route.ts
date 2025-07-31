import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    console.log("Registration attempt for:", email)

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 400 })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const userResult = await db.collection("users").insertOne({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: "credentials",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("User created with ID:", userResult.insertedId)

    // Initialize user progress
    await db.collection("userProgress").insertOne({
      userId: userResult.insertedId.toString(),
      currentStreak: 0,
      totalSavings: 0,
      completedChallenges: [],
      badges: ["🌱 First Step"],
      lastCalculation: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("User progress initialized")

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully!",
        userId: userResult.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Failed to create account. Please try again." }, { status: 500 })
  }
}
