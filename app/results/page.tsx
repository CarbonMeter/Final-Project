"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Share2, Download, TrendingDown, Award, Lightbulb, User, Users, Building } from "lucide-react"
import Link from "next/link"

interface ResultsData {
  totalEmissions: number
  breakdown: {
    transportation: number
    energy: number
    food: number
    lifestyle: number
  }
  calculatorType: "individual" | "family" | "company"
  multiplier: number
  formData: any
  timestamp: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<ResultsData | null>(null)
  const [aiTips, setAiTips] = useState<string[]>([])
  const [badges, setBadges] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const savedResults = localStorage.getItem("carbonResults")
    if (savedResults) {
      const data = JSON.parse(savedResults)
      setResults(data)
      generateAITips(data)
      generateBadges(data)
    }
  }, [])

  const generateAITips = (data: ResultsData) => {
    const tips = []
    const { calculatorType } = data

    if (data.breakdown.transportation > 2000) {
      if (calculatorType === "company") {
        tips.push(
          "Consider implementing a remote work policy or carpooling programs to reduce employee commuting emissions by 25-40%",
        )
      } else {
        tips.push(
          "Consider carpooling or using public transport 2-3 times per week to reduce transportation emissions by 30%",
        )
      }
    }

    if (data.breakdown.energy > 1500) {
      if (calculatorType === "company") {
        tips.push(
          "Upgrade to LED lighting and smart building systems - this could reduce your energy footprint by 20-30%",
        )
      } else {
        tips.push(
          "Switch to LED bulbs and unplug devices when not in use - this could save 15% on your energy footprint",
        )
      }
    }

    if (data.breakdown.food > 1000) {
      if (calculatorType === "company") {
        tips.push("Offer more plant-based options in company cafeteria and reduce food waste through better planning")
      } else {
        tips.push(
          "Try 'Meatless Monday' - reducing meat consumption by just one day per week can cut food emissions by 14%",
        )
      }
    }

    if (calculatorType === "company") {
      tips.push(
        "Implement a comprehensive sustainability program - even small changes across all employees can save thousands of kg CO₂ annually",
      )
    } else {
      tips.push("Small changes add up! Even a 10% reduction in each category can save 500kg CO₂ annually")
    }

    setAiTips(tips)
  }

  const generateBadges = (data: ResultsData) => {
    const earnedBadges = []

    if (data.formData.energy?.renewable) {
      earnedBadges.push("🔌 Green Energy Champion")
    }

    if (data.formData.food?.localFood) {
      earnedBadges.push("🥗 Local Food Hero")
    }

    if (data.formData.lifestyle?.recycling) {
      earnedBadges.push("♻️ Recycling Pro")
    }

    if (data.totalEmissions < 3000) {
      earnedBadges.push("🌱 Eco Warrior")
    }

    if (data.formData.transportation?.carType === "electric") {
      earnedBadges.push("⚡ Electric Pioneer")
    }

    if (data.calculatorType === "company" && data.totalEmissions < 50000) {
      earnedBadges.push("🏢 Sustainable Business")
    }

    if (data.calculatorType === "family" && data.totalEmissions < 15000) {
      earnedBadges.push("👨‍👩‍👧‍👦 Eco Family")
    }

    setBadges(earnedBadges)
  }

  const generateDetailedReport = (data: ResultsData): string => {
    const date = new Date().toLocaleDateString()
    const calculatorTypeTitle = data.calculatorType.charAt(0).toUpperCase() + data.calculatorType.slice(1)

    return `
CARBON FOOTPRINT REPORT - ${calculatorTypeTitle.toUpperCase()}
Generated on: ${date}
Calculator Type: ${calculatorTypeTitle}
${data.calculatorType === "family" ? `Family Size: ${data.multiplier} members` : ""}
${data.calculatorType === "company" ? `Employee Count: ${data.multiplier} employees` : ""}

===========================================
CARBON FOOTPRINT SUMMARY
===========================================

Total Annual Emissions: ${data.totalEmissions.toLocaleString()} kg CO₂
${data.calculatorType !== "individual" ? `Per ${data.calculatorType === "family" ? "person" : "employee"}: ${Math.round(data.totalEmissions / data.multiplier).toLocaleString()} kg CO₂` : ""}

Breakdown by Category:
• Transportation: ${data.breakdown.transportation.toLocaleString()} kg CO₂ (${Math.round((data.breakdown.transportation / data.totalEmissions) * 100)}%)
• Energy Usage: ${data.breakdown.energy.toLocaleString()} kg CO₂ (${Math.round((data.breakdown.energy / data.totalEmissions) * 100)}%)
• Food & Diet: ${data.breakdown.food.toLocaleString()} kg CO₂ (${Math.round((data.breakdown.food / data.totalEmissions) * 100)}%)
• Lifestyle: ${data.breakdown.lifestyle.toLocaleString()} kg CO₂ (${Math.round((data.breakdown.lifestyle / data.totalEmissions) * 100)}%)

===========================================
COMPARISON WITH AVERAGES
===========================================

Your Footprint: ${data.totalEmissions.toLocaleString()} kg CO₂/year
${
  data.calculatorType === "individual"
    ? `
Global Average (Individual): 4,800 kg CO₂/year
US Average (Individual): 16,000 kg CO₂/year
`
    : data.calculatorType === "family"
      ? `
Average Family (4 people): 19,200 kg CO₂/year
US Average Family: 64,000 kg CO₂/year
`
      : `
Average Small Business: 100,000 kg CO₂/year
Average Medium Business: 500,000 kg CO₂/year
`
}

${
  data.calculatorType === "individual" && data.totalEmissions < 4800
    ? `🎉 Congratulations! You're ${Math.round(((4800 - data.totalEmissions) / 4800) * 100)}% below the global average!`
    : data.calculatorType === "family" && data.totalEmissions < 19200
      ? `🎉 Great job! Your family is ${Math.round(((19200 - data.totalEmissions) / 19200) * 100)}% below the average family footprint!`
      : data.calculatorType === "company" && data.totalEmissions < 100000
        ? `🎉 Excellent! Your company is performing better than average businesses!`
        : `💪 There's room for improvement! Focus on the recommendations below.`
}

===========================================
YOUR ECO ACHIEVEMENTS
===========================================

Badges Earned: ${badges.length}
${badges.map((badge) => `• ${badge}`).join("\n")}

===========================================
DETAILED INPUT DATA
===========================================

TRANSPORTATION:
• ${data.calculatorType === "individual" ? "Weekly car miles" : data.calculatorType === "family" ? "Family weekly car miles" : "Average employee weekly car miles"}: ${data.formData.transportation.carMiles}
• Vehicle type: ${data.formData.transportation.carType}
• Flights per year: ${data.formData.transportation.flights}
${data.calculatorType === "family" ? `• Number of cars: ${data.formData.transportation.carCount || 2}` : ""}
${data.calculatorType === "company" ? `• Fleet size: ${data.formData.transportation.fleetSize || 10}` : ""}

ENERGY USAGE:
• Monthly electricity (kWh): ${data.formData.energy.electricity.toLocaleString()}
• ${data.calculatorType === "company" ? "Building" : "Home"} size: ${data.formData.energy.homeSize}
• Uses renewable energy: ${data.formData.energy.renewable ? "Yes" : "No"}
${data.calculatorType === "company" ? `• Number of facilities: ${data.formData.energy.facilities || 1}` : ""}

FOOD & DIET:
• Meat meals per week: ${data.formData.food.meatFrequency}
• Food waste percentage: ${data.formData.food.foodWaste}%
• Buys local food: ${data.formData.food.localFood ? "Yes" : "No"}
${data.calculatorType === "company" ? `• Has cafeteria: ${data.formData.food.cafeteria ? "Yes" : "No"}` : ""}

LIFESTYLE:
• Monthly ${data.calculatorType === "company" ? "office supplies" : "shopping"} budget: $${data.formData.lifestyle.shopping.toLocaleString()}
• Actively recycles: ${data.formData.lifestyle.recycling ? "Yes" : "No"}
${data.calculatorType === "company" ? `• Annual business travel budget: $${(data.formData.lifestyle.businessTravel || 50000).toLocaleString()}` : ""}

===========================================
PERSONALIZED RECOMMENDATIONS
===========================================

${aiTips.map((tip) => `• ${tip}`).join("\n\n")}

===========================================
NEXT STEPS
===========================================

${
  data.calculatorType === "individual"
    ? `
1. Set a goal to reduce your footprint by 10-20% over the next 6 months
2. Track your progress monthly using CarbonMeter
3. Join our community to share tips and stay motivated
4. Focus on 1-2 high-impact changes rather than trying to change everything at once
`
    : data.calculatorType === "family"
      ? `
1. Set family goals and involve everyone in eco-friendly practices
2. Track your household progress monthly
3. Consider family challenges like "Car-free Sundays" or "Meatless Mondays"
4. Educate children about environmental responsibility
`
      : `
1. Develop a comprehensive sustainability policy for your organization
2. Set company-wide emission reduction targets (aim for 20-30% reduction)
3. Engage employees with sustainability training and incentives
4. Consider carbon offset programs for unavoidable emissions
5. Report progress to stakeholders and customers
`
}

Remember: Every action counts! ${data.calculatorType === "company" ? "Your business leadership in sustainability can inspire others and create positive change." : "You're already taking a positive step by measuring and understanding your impact."}

For more tips and support, visit: https://carbonmeter.com

Report generated by CarbonMeter - Your AI-powered carbon footprint companion
Calculator Type: ${calculatorTypeTitle}
Generated: ${new Date().toISOString()}
`
  }

  const handleDownloadReport = () => {
    if (!results) return

    setIsDownloading(true)

    setTimeout(() => {
      const reportContent = generateDetailedReport(results)
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `carbon-footprint-report-${results.calculatorType}-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setIsDownloading(false)
    }, 1000)
  }

  const getEmissionLevel = (emissions: number, type: string) => {
    if (type === "individual") {
      if (emissions < 2000) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" }
      if (emissions < 4000) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" }
      if (emissions < 6000) return { level: "Average", color: "text-yellow-600", bg: "bg-yellow-100" }
      return { level: "High", color: "text-red-600", bg: "bg-red-100" }
    } else if (type === "family") {
      if (emissions < 8000) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" }
      if (emissions < 15000) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" }
      if (emissions < 25000) return { level: "Average", color: "text-yellow-600", bg: "bg-yellow-100" }
      return { level: "High", color: "text-red-600", bg: "bg-red-100" }
    } else {
      if (emissions < 50000) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" }
      if (emissions < 100000) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" }
      if (emissions < 200000) return { level: "Average", color: "text-yellow-600", bg: "bg-yellow-100" }
      return { level: "High", color: "text-red-600", bg: "bg-red-100" }
    }
  }

  const getCalculatorIcon = (type: string) => {
    switch (type) {
      case "individual":
        return <User className="w-6 h-6" />
      case "family":
        return <Users className="w-6 h-6" />
      case "company":
        return <Building className="w-6 h-6" />
      default:
        return <User className="w-6 h-6" />
    }
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your results...</p>
          <p className="text-sm text-gray-500 mt-2">
            If this takes too long, try{" "}
            <Link href="/calculate" className="text-green-600 underline">
              calculating again
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const emissionLevel = getEmissionLevel(results.totalEmissions, results.calculatorType)
  const maxCategory = Math.max(...Object.values(results.breakdown))

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {getCalculatorIcon(results.calculatorType)}
            <h1 className="text-4xl font-bold text-gray-800">
              {results.calculatorType.charAt(0).toUpperCase() + results.calculatorType.slice(1)} Carbon Footprint
              Results
            </h1>
          </div>
          <p className="text-xl text-gray-600">Here's your environmental impact breakdown 📊</p>
          {results.calculatorType !== "individual" && (
            <p className="text-lg text-gray-500 mt-2">
              {results.calculatorType === "family"
                ? `Family of ${results.multiplier} members`
                : `Organization with ${results.multiplier} employees`}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Emissions Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Annual Carbon Footprint</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-6xl font-bold text-gray-800 mb-2">
                      {results.totalEmissions.toLocaleString()}
                    </div>
                    <div className="text-xl text-gray-600">kg CO₂ per year</div>
                    {results.calculatorType !== "individual" && (
                      <div className="text-lg text-gray-500 mt-2">
                        {Math.round(results.totalEmissions / results.multiplier).toLocaleString()} kg CO₂ per{" "}
                        {results.calculatorType === "family" ? "person" : "employee"}
                      </div>
                    )}
                    <Badge className={`mt-4 ${emissionLevel.bg} ${emissionLevel.color} text-lg px-4 py-2`}>
                      {emissionLevel.level} Level
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="font-semibold">Daily Impact</div>
                      <div>{Math.round(results.totalEmissions / 365)} kg CO₂</div>
                    </div>
                    <div>
                      <div className="font-semibold">Monthly Impact</div>
                      <div>{Math.round(results.totalEmissions / 12)} kg CO₂</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Breakdown Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingDown className="w-5 h-5" />
                    <span>Emissions Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results.breakdown).map(([category, value], index) => (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="capitalize font-medium">{category}</span>
                          <span className="font-semibold">{value.toLocaleString()} kg CO₂</span>
                        </div>
                        <Progress value={(value / maxCategory) * 100} className="h-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Tips */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>AI-Powered Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiTips.map((tip, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Your Eco Badges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {badges.length > 0 ? (
                      badges.map((badge, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <Badge className="w-full justify-center py-2 text-sm bg-gradient-to-r from-green-500 to-blue-500 text-white">
                            {badge}
                          </Badge>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-center py-4">
                        Complete more eco-friendly actions to earn badges!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Take Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={handleDownloadReport}
                    disabled={isDownloading}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloading ? "Generating Report..." : "Download Report"}
                  </Button>
                  <Link href="/dashboard">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Track Progress</Button>
                  </Link>
                  <Link href="/chatbot">
                    <Button className="w-full bg-transparent" variant="outline">
                      Ask EcoBuddy AI
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comparison */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle>How You Compare</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Your footprint:</span>
                      <span className="font-semibold">{results.totalEmissions.toLocaleString()} kg</span>
                    </div>
                    {results.calculatorType === "individual" && (
                      <>
                        <div className="flex justify-between">
                          <span>US Average:</span>
                          <span>16,000 kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Global Average:</span>
                          <span>4,800 kg</span>
                        </div>
                      </>
                    )}
                    {results.calculatorType === "family" && (
                      <>
                        <div className="flex justify-between">
                          <span>Average Family:</span>
                          <span>19,200 kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>US Average Family:</span>
                          <span>64,000 kg</span>
                        </div>
                      </>
                    )}
                    {results.calculatorType === "company" && (
                      <>
                        <div className="flex justify-between">
                          <span>Small Business Avg:</span>
                          <span>100,000 kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medium Business Avg:</span>
                          <span>500,000 kg</span>
                        </div>
                      </>
                    )}
                    <div className="pt-2 border-t">
                      <div
                        className={`text-center font-semibold ${
                          emissionLevel.level === "Excellent" || emissionLevel.level === "Good"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {emissionLevel.level === "Excellent" || emissionLevel.level === "Good"
                          ? "🎉 Great performance!"
                          : "💪 Room for improvement!"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
