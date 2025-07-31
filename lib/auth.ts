import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getDatabase } from "./mongodb"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          console.log("Attempting to authenticate user:", credentials.email)

          const db = await getDatabase()
          const user = await db.collection("users").findOne({
            email: credentials.email.toLowerCase(),
          })

          if (!user) {
            console.log("User not found:", credentials.email)
            return null
          }

          if (!user.password) {
            console.log("User has no password (OAuth user):", credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.email)
            return null
          }

          console.log("Authentication successful for:", credentials.email)

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image || null,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }

      // Handle Google OAuth users
      if (account?.provider === "google" && user) {
        try {
          const db = await getDatabase()

          // Check if user exists
          const existingUser = await db.collection("users").findOne({
            email: user.email?.toLowerCase(),
          })

          if (!existingUser) {
            // Create new user for Google OAuth
            const result = await db.collection("users").insertOne({
              name: user.name,
              email: user.email?.toLowerCase(),
              image: user.image,
              provider: "google",
              createdAt: new Date(),
              updatedAt: new Date(),
            })

            // Initialize user progress
            await db.collection("userProgress").insertOne({
              userId: result.insertedId.toString(),
              currentStreak: 0,
              totalSavings: 0,
              completedChallenges: [],
              badges: ["🌱 First Step"],
              lastCalculation: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            })

            token.id = result.insertedId.toString()
          } else {
            token.id = existingUser._id.toString()
          }
        } catch (error) {
          console.error("Google OAuth user creation error:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
  debug: process.env.NODE_ENV === "development",
}
