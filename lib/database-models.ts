import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password?: string
  image?: string
  provider: "credentials" | "google"
  createdAt: Date
  updatedAt: Date
}

export interface EmissionHistory {
  _id?: ObjectId
  userId: string
  calculationType: "individual" | "family" | "company"
  data: {
    transportation: any
    energy: any
    food: any
    lifestyle: any
  }
  results: {
    totalDaily: number
    totalMonthly: number
    totalYearly: number
    breakdown: {
      transportation: number
      energy: number
      food: number
      lifestyle: number
    }
    comparison: {
      indianAverage: number
      globalAverage: number
      percentile: number
    }
  }
  aiSummary?: string
  insights: string[]
  createdAt: Date
}

export interface UserProfile {
  _id?: ObjectId
  userId: string
  totalCalculations: number
  averageFootprint: number
  bestFootprint: number
  currentStreak: number
  longestStreak: number
  badges: string[]
  level: number
  coins: number
  monthlyGoal?: number
  preferences: {
    units: "metric" | "imperial"
    notifications: boolean
    publicProfile: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface ChatLog {
  _id?: ObjectId
  userId: string
  message: string
  response: string
  context?: any
  timestamp: Date
}

export interface Badge {
  _id?: ObjectId
  name: string
  description: string
  icon: string
  criteria: {
    type: "footprint" | "streak" | "calculations" | "improvement"
    value: number
    comparison: "less_than" | "greater_than" | "equal_to"
  }
  rarity: "common" | "rare" | "epic" | "legendary"
  coins: number
}

export interface LeaderboardEntry {
  _id?: ObjectId
  userId: string
  userName: string
  userImage?: string
  footprint: number
  rank: number
  change: number // position change from last month
  badges: string[]
  level: number
  month: string // YYYY-MM format
  createdAt: Date
}
