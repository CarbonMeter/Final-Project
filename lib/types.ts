export interface User {
  _id?: string
  name: string
  email: string
  password?: string
  createdAt: Date
  updatedAt: Date
}

export interface CarbonFootprint {
  _id?: string
  userId: string
  transportation: {
    carMiles: number
    carType: string
    publicTransport: number
    flights: number
  }
  energy: {
    electricity: number
    gas: number
    renewable: boolean
    homeSize: string
  }
  food: {
    meatFrequency: number
    localFood: boolean
    organicFood: boolean
    foodWaste: number
  }
  lifestyle: {
    shopping: number
    recycling: boolean
    wasteReduction: number
  }
  totalEmissions: number
  breakdown: {
    transportation: number
    energy: number
    food: number
    lifestyle: number
  }
  createdAt: Date
}

export interface CommunityPost {
  _id?: string
  userId: string
  author: string
  avatar?: string
  content: string
  category: "achievement" | "tip" | "story" | "question"
  likes: string[] // Array of user IDs who liked
  comments: Comment[]
  badges: string[]
  createdAt: Date
}

export interface Comment {
  _id?: string
  userId: string
  author: string
  content: string
  createdAt: Date
}

export interface Challenge {
  _id?: string
  title: string
  description: string
  category: string
  duration: number // days
  reward: string
  participants: string[] // Array of user IDs
  createdAt: Date
}

export interface UserProgress {
  _id?: string
  userId: string
  currentStreak: number
  totalSavings: number
  completedChallenges: string[]
  badges: string[]
  lastCalculation: Date
  createdAt: Date
  updatedAt: Date
}
