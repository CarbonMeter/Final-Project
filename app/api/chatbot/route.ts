import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let response: string

    // Check if OpenAI API key is available
    if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      try {
        response = await generateAIResponse(message, context, user)
      } catch (aiError) {
        console.error("OpenAI API error:", aiError)
        response = generateEnhancedBotResponse(message, user?.name)
      }
    } else {
      response = generateEnhancedBotResponse(message, user?.name)
    }

    // Save chat log if user is authenticated
    if (user) {
      try {
        const db = await getDatabase()
        await db.collection("chatLogs").insertOne({
          userId: user.id,
          message,
          response,
          context,
          timestamp: new Date(),
        })
      } catch (dbError) {
        console.error("Failed to save chat log:", dbError)
      }
    }

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chatbot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateAIResponse(message: string, context: any, user: any): Promise<string> {
  const systemPrompt = `
You are EcoBuddy, a friendly and knowledgeable environmental assistant specifically designed for Indian users. You help people reduce their carbon footprint and live more sustainably.

Key guidelines:
- Always be encouraging, positive, and supportive
- Provide practical advice relevant to Indian context (climate, culture, economy)
- Use Indian examples (local trains, rickshaws, local markets, Indian foods)
- Mention cost savings in Indian Rupees (₹) when relevant
- Keep responses conversational and not too long (2-3 paragraphs max)
- Use appropriate emojis to make responses engaging
- Focus on actionable tips that are realistic for Indian households

User context: ${user ? `Name: ${user.name}, Email: ${user.email}` : "Anonymous user"}
Additional context: ${context ? JSON.stringify(context) : "None"}
`

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const aiResponse = await response.json()
  return (
    aiResponse.choices[0]?.message?.content ||
    "I'm here to help you with your environmental questions! Could you please rephrase that?"
  )
}

function generateEnhancedBotResponse(message: string, userName?: string): string {
  const lowerMessage = message.toLowerCase()
  const greeting = userName ? `Hi ${userName}! ` : "Hi there! "

  // Transportation responses
  if (lowerMessage.includes("transport") || lowerMessage.includes("car") || lowerMessage.includes("travel")) {
    return `${greeting}🚗 Great question about transportation! Here are some effective ways to reduce your transport emissions:

• **Walk or bike** for short trips (under 3 miles) - it's free exercise too! 🚴‍♀️
• **Use public transport** - buses and trains can reduce emissions by 45-80% per person
• **Carpool or rideshare** when possible - apps like BlaBlaCar make it easy
• **Work from home** 1-2 days per week if possible
• **Combine errands** into one trip to maximize efficiency
• **Consider electric or hybrid** for your next vehicle - prices are dropping!

**Pro tip:** Even reducing one car trip per week can save 500+ kg CO₂ annually! 🌍 What's your current transportation situation?`
  }

  // Food and diet responses
  if (lowerMessage.includes("food") || lowerMessage.includes("eat") || lowerMessage.includes("diet")) {
    return `${greeting}🥗 Food choices have a huge impact on your carbon footprint! Here are some delicious ways to eat more sustainably:

• **Try Meatless Monday** (or any day!) - livestock produces 14.5% of global emissions 🐄
• **Choose local & seasonal** produce when possible - check out farmers markets!
• **Reduce food waste** - plan meals and use leftovers creatively
• **Eat more plants** - beans, lentils, and nuts are protein powerhouses! 🌱
• **Buy organic** when budget allows, especially for the 'Dirty Dozen'
• **Grow herbs** on your windowsill - fresh basil anyone? 🌿

**Fun fact:** If you reduce meat consumption by just 1-2 meals per week, you could save 300kg CO₂ annually! What's your favorite plant-based meal?`
  }

  // Energy and home responses
  if (lowerMessage.includes("energy") || lowerMessage.includes("home") || lowerMessage.includes("electric")) {
    return `${greeting}⚡ Making your home more energy-efficient is one of the best investments for the planet AND your wallet! Here's how:

• **Switch to LED bulbs** - they use 75% less energy and last 25x longer 💡
• **Unplug devices** when not in use (phantom loads can add 10% to your bill!)
• **Use a programmable thermostat** - save 10% by adjusting temp by 7-10°F
• **Seal air leaks** around windows and doors with weatherstripping
• **Wash clothes in cold water** - 90% of energy goes to heating water
• **Air dry when possible** instead of using the dryer
• **Consider renewable energy** - solar panels or green energy programs

**Money-saving tip:** Start with the easy wins like LEDs and unplugging - they can save ₹2000+ annually! 🏠`
  }

  // Default encouraging responses
  const defaultResponses = [
    `${greeting}🌱 That's a fantastic question! I'd love to help you with that. Could you be a bit more specific about what aspect you're most interested in? I can provide personalized tips based on your situation!`,

    `${greeting}🤔 Interesting topic! I have lots of ideas about that. What's your current situation, and what changes are you most willing to try first? I believe in starting with small, manageable steps!`,

    `${greeting}💚 I'm excited to help you on your sustainability journey! Can you tell me more about what you're hoping to achieve or what's been on your mind lately? Every question is a step toward positive change!`,

    `${greeting}🌍 Every small action makes a difference! What area of your life would you like to make more eco-friendly? I can suggest some easy wins to get started - transportation, energy, food, or lifestyle?`,
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}
