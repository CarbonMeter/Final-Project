import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export const dynamic = "force-dynamic"
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    const hasOpenAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY

    if (hasOpenAIKey) {
      // Use real OpenAI API
      try {
        const result = streamText({
          model: openai("gpt-3.5-turbo"),
          messages: [
            {
              role: "system",
              content: `You are CarbonMeter AI, a helpful assistant focused on sustainability and carbon footprint reduction. 
              
              Your expertise includes:
              - Carbon footprint calculation and analysis
              - Sustainable living tips and advice
              - Environmental impact of daily activities
              - Climate change education
              - Green technology and renewable energy
              - Sustainable transportation options
              - Eco-friendly lifestyle changes
              
              Always provide:
              - Practical, actionable advice
              - Specific numbers when possible (CO₂ savings, costs, etc.)
              - Encouraging and positive tone
              - Links to relevant resources when helpful
              
              Keep responses concise but informative, and always relate back to environmental impact.`,
            },
            ...messages,
          ],
          temperature: 0.7,
          maxTokens: 500,
        })

        return result.toDataStreamResponse()
      } catch (error) {
        console.error("OpenAI API error:", error)
        // Fall back to mock response if OpenAI fails
        return generateMockResponse(messages)
      }
    } else {
      // Use enhanced mock responses
      return generateMockResponse(messages)
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateMockResponse(messages: any[]) {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""

  let response = "I'm here to help you with your sustainability journey! "

  // Enhanced responses based on keywords
  if (lastMessage.includes("transport") || lastMessage.includes("car") || lastMessage.includes("travel")) {
    response = `🚗 Great question about transportation! Here are some effective ways to reduce your transport emissions:

• **Walk or bike** for trips under 3 miles - saves ~2.6 kg CO₂ per 10km vs driving
• **Use public transport** - can reduce emissions by 45-80% per person
• **Carpool or rideshare** - cuts your transport footprint in half
• **Work from home** 1-2 days per week if possible
• **Combine errands** into one trip to maximize efficiency
• **Consider electric vehicles** - 60-70% lower lifetime emissions

**Quick tip:** Even reducing one car trip per week can save 500+ kg CO₂ annually! What's your current transportation situation?`
  } else if (lastMessage.includes("food") || lastMessage.includes("eat") || lastMessage.includes("diet")) {
    response = `🥗 Food choices have a huge impact! Here's how to eat more sustainably:

• **Try Meatless Monday** - livestock produces 14.5% of global emissions
• **Choose local & seasonal** produce when possible
• **Reduce food waste** - plan meals and use leftovers creatively
• **Eat more plants** - beans and lentils are protein powerhouses!
• **Buy organic** when budget allows
• **Grow herbs** on your windowsill

**Impact:** Reducing meat by just 1-2 meals per week can save 300kg CO₂ annually! What's your favorite plant-based meal?`
  } else if (lastMessage.includes("energy") || lastMessage.includes("home") || lastMessage.includes("electric")) {
    response = `⚡ Making your home energy-efficient helps the planet AND your wallet:

• **Switch to LED bulbs** - use 75% less energy, last 25x longer
• **Unplug devices** when not in use (phantom loads add 10% to bills!)
• **Use programmable thermostat** - save 10% by adjusting 7-10°F
• **Seal air leaks** around windows and doors
• **Wash clothes in cold water** - 90% of energy goes to heating
• **Air dry when possible** instead of using the dryer

**Savings:** These changes can save $100+ annually and reduce CO₂ by 1-2 tons! 🏠`
  } else if (lastMessage.includes("waste") || lastMessage.includes("recycle") || lastMessage.includes("plastic")) {
    response = `♻️ Reducing waste is like a superpower for the environment:

• **Follow the 5 R's**: Refuse, Reduce, Reuse, Recycle, Rot (compost)
• **Bring reusable bags** everywhere
• **Use refillable water bottle** - saves money and plastic!
• **Compost food scraps** - even apartment dwellers can try worm bins
• **Buy in bulk** to reduce packaging
• **Repurpose containers** creatively

**Challenge:** Try going one day without creating trash - it's eye-opening! 🌍`
  } else if (lastMessage.includes("calculate") || lastMessage.includes("footprint") || lastMessage.includes("carbon")) {
    response = `📊 Ready to calculate your carbon footprint? Here's what to track:

**Transportation:** Miles driven, flights taken, public transport use
**Energy:** Electricity, gas, heating/cooling usage
**Food:** Diet type, local vs imported, food waste
**Consumption:** Shopping habits, clothing, electronics

**Average footprints:**
• US: ~16 tons CO₂/year
• Global: ~4 tons CO₂/year
• Target: ~2 tons CO₂/year by 2030

Use our calculator to get your personalized footprint and action plan! 🎯`
  } else if (lastMessage.includes("help") || lastMessage.includes("start") || lastMessage.includes("begin")) {
    response = `🌱 Welcome to your sustainability journey! Here's how to start:

**Week 1:** Measure your current footprint
**Week 2:** Pick ONE easy change (LED bulbs, reusable bags)
**Week 3:** Try a plant-based meal
**Week 4:** Optimize one transport habit

**Remember:** Progress over perfection! Small consistent changes create big impact over time.

What area interests you most: 🚗 Transport, 🏠 Energy, 🥗 Food, or ♻️ Waste?`
  }

  // Create a streaming response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const words = response.split(" ")
      let index = 0

      const interval = setInterval(() => {
        if (index < words.length) {
          const chunk = words[index] + " "
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                choices: [
                  {
                    delta: { content: chunk },
                    index: 0,
                    finish_reason: null,
                  },
                ],
              })}\n\n`,
            ),
          )
          index++
        } else {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                choices: [
                  {
                    delta: {},
                    index: 0,
                    finish_reason: "stop",
                  },
                ],
              })}\n\n`,
            ),
          )
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
          clearInterval(interval)
        }
      }, 50)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
