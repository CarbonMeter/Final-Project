import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const { results, data } = await req.json()

      if (!results) {
        return NextResponse.json({ error: "Emission results are required" }, { status: 400 })
      }

      // Check if OpenAI API key is available
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        return NextResponse.json({
          success: true,
          summary: generateFallbackSummary(results),
          tips: generateFallbackTips(results),
        })
      }

      try {
        // Generate AI summary using OpenAI
        const aiSummary = await generateAISummary(results, data)

        return NextResponse.json({
          success: true,
          summary: aiSummary.summary,
          tips: aiSummary.tips,
        })
      } catch (aiError) {
        console.error("OpenAI API error:", aiError)

        // Fallback to manual summary
        return NextResponse.json({
          success: true,
          summary: generateFallbackSummary(results),
          tips: generateFallbackTips(results),
        })
      }
    } catch (error) {
      console.error("Summary API error:", error)
      return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
    }
  })
}

async function generateAISummary(results: any, data: any) {
  const prompt = `
You are EcoBuddy, a friendly and encouraging environmental assistant for Indian users. 

Analyze this carbon footprint calculation:
- Total Monthly Emissions: ${results.totalMonthly} kg CO₂
- Transportation: ${results.breakdown.transportation} kg CO₂
- Energy: ${results.breakdown.energy} kg CO₂  
- Food: ${results.breakdown.food} kg CO₂
- Lifestyle: ${results.breakdown.lifestyle} kg CO₂
- Percentile: ${results.comparison.percentile}% (compared to Indian average)

User's habits:
- Car usage: ${data?.transportation?.carMiles || 0} miles/day
- Home size: ${data?.energy?.homeSize || "medium"}
- Meat meals: ${data?.food?.meatFrequency || 0}/week
- Monthly shopping: ₹${data?.lifestyle?.shopping || 0}

Generate:
1. A friendly, encouraging summary (2-3 sentences) in Indian context
2. Exactly 3 specific, actionable tips for improvement

Keep it positive, use Indian examples (like using local trains, buying from local markets), and mention potential savings in both CO₂ and money (INR).

Format as JSON:
{
  "summary": "Your encouraging summary here",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}
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
          content:
            "You are EcoBuddy, a helpful environmental assistant for Indian users. Always be encouraging and provide practical advice with Indian context.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const aiResponse = await response.json()
  const content = aiResponse.choices[0]?.message?.content

  try {
    return JSON.parse(content)
  } catch (parseError) {
    // If JSON parsing fails, create a structured response
    return {
      summary:
        content ||
        "Great job on calculating your carbon footprint! Every step towards awareness is a step towards a greener future.",
      tips: [
        "Try using public transport for 2 days a week",
        "Switch to LED bulbs to save energy and money",
        "Reduce meat consumption by 1 meal per week",
      ],
    }
  }
}

function generateFallbackSummary(results: any): string {
  const { totalMonthly, comparison } = results

  if (totalMonthly < comparison.indianAverage * 0.8) {
    return `Excellent work! Your carbon footprint of ${totalMonthly} kg CO₂/month is 20% below the Indian average. You're already making a significant positive impact on the environment! 🌟`
  } else if (totalMonthly > comparison.indianAverage * 1.2) {
    return `Your current footprint is ${totalMonthly} kg CO₂/month, which is above the Indian average. Don't worry - with a few simple changes, you can make a big difference! Every small step counts towards a greener future. 🌱`
  } else {
    return `Your carbon footprint of ${totalMonthly} kg CO₂/month is close to the Indian average. You're on the right track! With some targeted improvements, you can become an eco-champion in your community. 📊`
  }
}

function generateFallbackTips(results: any): string[] {
  const { breakdown } = results
  const tips = []

  // Find the highest emission category and provide specific tips
  const categories = Object.entries(breakdown) as [string, number][]
  const sortedCategories = categories.sort((a, b) => b[1] - a[1])

  const [highestCategory] = sortedCategories

  switch (highestCategory) {
    case "transportation":
      tips.push(
        "🚌 Use public transport like buses or metro for 2-3 days per week - save ₹500+ monthly on fuel!",
        "🚲 Try cycling or walking for trips under 3 km - great exercise and zero emissions!",
        "🚗 Carpool with colleagues or use ride-sharing apps to split costs and emissions",
      )
      break
    case "energy":
      tips.push(
        "💡 Replace all bulbs with LEDs - save ₹200+ monthly on electricity bills",
        "🌡️ Set AC temperature to 24°C instead of 18°C - reduce bills by 30%",
        "☀️ Use solar water heater or cook with solar cooker during sunny days",
      )
      break
    case "food":
      tips.push(
        "🥗 Try 'Meatless Monday' - reduce meat by 1 meal per week saves 25 kg CO₂ annually",
        "🛒 Buy from local farmers markets - fresher food, lower emissions, support local economy",
        "🍽️ Plan meals to reduce food waste - save ₹1000+ monthly on groceries",
      )
      break
    default:
      tips.push(
        "🛍️ Buy only what you need - reduce impulse purchases by 20%",
        "♻️ Segregate waste properly and compost kitchen scraps at home",
        "🌱 Choose products with minimal packaging or buy in bulk",
      )
  }

  return tips
}
