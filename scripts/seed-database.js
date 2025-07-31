const { MongoClient, ServerApiVersion } = require("mongodb")

const uri = "mongodb+srv://Yash:Yash1407@cluster0.171f8wa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function seedDatabase() {
  try {
    await client.connect()
    console.log("Connected to MongoDB!")

    const db = client.db("carbonmeter")

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
    ]

    await db.collection("challenges").insertMany(challenges)
    console.log("Challenges seeded!")

    // Seed sample community posts
    const posts = [
      {
        userId: "sample-user-1",
        author: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40&text=SC",
        content:
          "Just hit my 45-day streak! 🎉 Started with simple changes like bringing reusable bags and now I'm composting, biking to work, and loving my plant-based meals. Small steps really do add up! What's your favorite eco-habit?",
        category: "achievement",
        likes: [],
        comments: [],
        badges: ["🌱 Eco Warrior"],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        userId: "sample-user-2",
        author: "Mike Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40&text=MR",
        content:
          "Pro tip: I switched to cold water for laundry and my energy bill dropped by 15%! 💡 Plus my clothes last longer. Anyone else have energy-saving wins to share?",
        category: "tip",
        likes: [],
        comments: [],
        badges: ["⚡ Energy Saver"],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        userId: "sample-user-3",
        author: "Emma Thompson",
        avatar: "/placeholder.svg?height=40&width=40&text=ET",
        content:
          "Organized a clothing swap with neighbors today! 👗 Found 3 'new' pieces and gave away 5 items that weren't getting worn. It's like shopping but better for the planet AND my wallet! Who else loves clothing swaps?",
        category: "story",
        likes: [],
        comments: [],
        badges: ["🌿 Local Food Hero"],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
    ]

    await db.collection("communityPosts").insertMany(posts)
    console.log("Community posts seeded!")

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
