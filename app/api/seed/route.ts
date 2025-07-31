import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const db = await getDatabase()

    // Check if data already exists
    const existingChallenges = await db.collection("challenges").countDocuments()
    if (existingChallenges > 0) {
      return NextResponse.json({ message: "Database already seeded" }, { status: 200 })
    }

    // Seed challenges
    const challenges = [
      {
        title: "Meatless Monday",
        description: "Skip meat every Monday for a month",
        category: "food",
        duration: 30,
        reward: "🥗 Plant-Based Hero",
        participants: [],
        createdAt: new Date(),
      },
      {
        title: "Public Transport Week",
        description: "Use public transport for 7 consecutive days",
        category: "transportation",
        duration: 7,
        reward: "🚌 Transit Champion",
        participants: [],
        createdAt: new Date(),
      },
      {
        title: "Zero Waste Weekend",
        description: "Produce minimal waste for 2 days",
        category: "lifestyle",
        duration: 2,
        reward: "♻️ Waste Warrior",
        participants: [],
        createdAt: new Date(),
      },
      {
        title: "Energy Saver Challenge",
        description: "Reduce home energy usage by 20% this month",
        category: "energy",
        duration: 30,
        reward: "⚡ Energy Master",
        participants: [],
        createdAt: new Date(),
      },
      {
        title: "Bike to Work Week",
        description: "Cycle to work for 5 consecutive days",
        category: "transportation",
        duration: 7,
        reward: "🚴‍♀️ Cycling Champion",
        participants: [],
        createdAt: new Date(),
      },
      {
        title: "Plastic-Free Week",
        description: "Avoid single-use plastics for 7 days",
        category: "lifestyle",
        duration: 7,
        reward: "🌊 Plastic-Free Pioneer",
        participants: [],
        createdAt: new Date(),
      },
    ]

    await db.collection("challenges").insertMany(challenges)

    // Seed sample community posts
    const posts = [
      {
        userId: "sample-user-1",
        author: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40&text=SC",
        content:
          "Just hit my 45-day streak! 🎉 Started with simple changes like bringing reusable bags and now I'm composting, biking to work, and loving my plant-based meals. Small steps really do add up! What's your favorite eco-habit?",
        category: "achievement",
        likes: ["user-2", "user-3", "user-4"],
        comments: [
          {
            userId: "user-2",
            author: "Mike Rodriguez",
            content: "That's amazing! I'm inspired to start my own streak 💪",
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          },
        ],
        badges: ["🌱 Eco Warrior", "🔥 Streak Master"],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        userId: "sample-user-2",
        author: "Mike Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40&text=MR",
        content:
          "Pro tip: I switched to cold water for laundry and my energy bill dropped by 15%! 💡 Plus my clothes last longer. Anyone else have energy-saving wins to share?",
        category: "tip",
        likes: ["user-1", "user-3"],
        comments: [
          {
            userId: "user-3",
            author: "Emma Thompson",
            content: "Great tip! I also started air-drying my clothes and it's made a huge difference.",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
        ],
        badges: ["⚡ Energy Saver"],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        userId: "sample-user-3",
        author: "Emma Thompson",
        avatar: "/placeholder.svg?height=40&width=40&text=ET",
        content:
          "Organized a clothing swap with neighbors today! 👗 Found 3 'new' pieces and gave away 5 items that weren't getting worn. It's like shopping but better for the planet AND my wallet! Who else loves clothing swaps?",
        category: "story",
        likes: ["user-1", "user-2", "user-4", "user-5"],
        comments: [
          {
            userId: "user-1",
            author: "Sarah Chen",
            content: "Love this idea! How did you organize it?",
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
          {
            userId: "user-4",
            author: "Alex Green",
            content: "I want to organize one in my neighborhood too!",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
        ],
        badges: ["🌿 Local Hero", "♻️ Recycling Pro"],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        userId: "sample-user-4",
        author: "Alex Green",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
        content:
          "My rooftop garden is thriving! 🌱 Growing my own herbs and vegetables has been so rewarding. Not only am I reducing food miles, but there's something magical about eating what you've grown. Any fellow urban gardeners here?",
        category: "story",
        likes: ["user-1", "user-2", "user-3"],
        comments: [
          {
            userId: "user-2",
            author: "Mike Rodriguez",
            content: "That's awesome! What vegetables are you growing?",
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
        ],
        badges: ["🌱 Garden Guru", "🥗 Local Food Hero"],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
      {
        userId: "sample-user-5",
        author: "Jordan Kim",
        avatar: "/placeholder.svg?height=40&width=40&text=JK",
        content:
          "Question for the community: What's the best app for finding carpool partners? I want to reduce my commute emissions but haven't found a reliable platform yet. Thanks in advance! 🚗",
        category: "question",
        likes: ["user-1", "user-3"],
        comments: [
          {
            userId: "user-1",
            author: "Sarah Chen",
            content: "I use BlaBlaCar for longer trips and it's been great!",
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          },
          {
            userId: "user-3",
            author: "Emma Thompson",
            content: "Check if your workplace has a carpool program too!",
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          },
        ],
        badges: ["🚗 Commuter"],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ]

    await db.collection("communityPosts").insertMany(posts)

    // Seed sample user progress data
    const sampleProgress = [
      {
        userId: "sample-user-1",
        currentStreak: 45,
        totalSavings: 1200,
        completedChallenges: ["challenge-1", "challenge-2"],
        badges: ["🌱 Eco Warrior", "🔥 Streak Master", "🥗 Plant-Based Hero", "🚌 Transit Champion"],
        lastCalculation: new Date(),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        userId: "sample-user-2",
        currentStreak: 32,
        totalSavings: 980,
        completedChallenges: ["challenge-3"],
        badges: ["⚡ Energy Saver", "💡 Smart Home Pro"],
        lastCalculation: new Date(),
        createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        userId: "sample-user-3",
        currentStreak: 28,
        totalSavings: 850,
        completedChallenges: ["challenge-4"],
        badges: ["🌿 Local Hero", "♻️ Recycling Pro", "👗 Fashion Conscious"],
        lastCalculation: new Date(),
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ]

    await db.collection("userProgress").insertMany(sampleProgress)

    // Seed learning articles metadata
    const articles = [
      {
        title: "Plant-Based Eating for Beginners",
        category: "food",
        readTime: 5,
        difficulty: "Beginner",
        rating: 4.8,
        summary:
          "Discover how to reduce your carbon footprint through simple dietary changes. Learn about plant-based proteins, meal planning, and delicious recipes.",
        quickTips: [
          "Start with one meatless day per week",
          "Try plant-based milk alternatives",
          "Experiment with legumes and beans",
          "Focus on whole foods over processed",
        ],
        views: 1250,
        likes: 89,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Sustainable Transportation Guide",
        category: "travel",
        readTime: 8,
        difficulty: "Intermediate",
        rating: 4.6,
        summary:
          "Explore eco-friendly transportation options from electric vehicles to public transit. Calculate your transport emissions and find alternatives.",
        quickTips: [
          "Walk or bike for trips under 3 miles",
          "Use public transport when available",
          "Consider carpooling for longer trips",
          "Plan efficient routes to combine errands",
        ],
        views: 980,
        likes: 67,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Energy-Efficient Home Makeover",
        category: "home",
        readTime: 12,
        difficulty: "Advanced",
        rating: 4.9,
        summary:
          "Transform your home into an energy-efficient haven. From smart thermostats to solar panels, learn what works best for your situation.",
        quickTips: [
          "Switch to LED bulbs throughout your home",
          "Seal air leaks around windows and doors",
          "Use programmable thermostats",
          "Unplug electronics when not in use",
        ],
        views: 1450,
        likes: 112,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ]

    await db.collection("articles").insertMany(articles)

    return NextResponse.json({
      message: "Database seeded successfully!",
      data: {
        challenges: challenges.length,
        posts: posts.length,
        userProgress: sampleProgress.length,
        articles: articles.length,
      },
    })
  } catch (error) {
    console.error("Database seeding error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
