"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingDown, Award, Target, Flame, Leaf, Lock, User, Users, Building, Calendar } from "lucide-react"
import Link from "next/link"

interface UserProgress {
  currentStreak: number
  totalSavings: number
  badges: string[]
  completedChallenges: string[]
}

interface FootprintData {
  totalEmissions: number
  calculatorType: string
  timestamp: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [footprintHistory, setFootprintHistory] = useState<FootprintData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (userData && isLoggedIn === "true") {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      loadUserData(parsedUser)
    } else {
      setLoading(false)
    }
  }, [])

  const loadUserData = (userData: any) => {
    // Load footprint history
    const calculations = JSON.parse(localStorage.getItem("carbonCalculations") || "[]")
    setFootprintHistory(calculations)

    // Generate user progress based on calculations
    const progress = generateUserProgress(calculations, userData)
    setUserProgress(progress)

    setLoading(false)
  }

  const generateUserProgress = (calculations: any[], userData: any) => {
    const daysSinceSignup = userData.signupTime
      ? Math.floor((Date.now() - new Date(userData.signupTime).getTime()) / (1000 * 60 * 60 * 24))
      : 1

    const badges = []
    let totalSavings = 0

    // Generate badges based on calculations
    calculations.forEach((calc) => {
      if (calc.formData?.energy?.renewable) {
        badges.push("🔌 Green Energy Champion")
      }
      if (calc.formData?.food?.localFood) {
        badges.push("🥗 Local Food Hero")
      }
      if (calc.formData?.lifestyle?.recycling) {
        badges.push("♻️ Recycling Pro")
      }
      if (calc.totalEmissions < 3000) {
        badges.push("🌱 Eco Warrior")
      }
      if (calc.calculatorType === "company") {
        badges.push("🏢 Business Leader")
      }
      if (calc.calculatorType === "family") {
        badges.push("👨‍👩‍👧‍👦 Family Champion")
      }

      // Calculate savings (assuming 10% improvement per calculation)
      totalSavings += Math.round(calc.totalEmissions * 0.1)
    })

    // Remove duplicates
    const uniqueBadges = [...new Set(badges)]

    return {
      currentStreak: Math.min(daysSinceSignup, calculations.length * 7), // Weekly streak
      totalSavings,
      badges: uniqueBadges,
      completedChallenges: calculations.map((_, index) => `challenge_${index}`),
    }
  }

  const mockChallenges = [
    {
      id: 1,
      title: "Meatless Monday",
      description: "Go meat-free for one day this week",
      duration: 7,
      reward: "50 kg CO₂ saved",
      participants: 234,
    },
    {
      id: 2,
      title: "Public Transport Week",
      description: "Use public transport for your daily commute",
      duration: 7,
      reward: "100 kg CO₂ saved",
      participants: 156,
    },
    {
      id: 3,
      title: "Energy Saver",
      description: "Reduce your electricity usage by 20%",
      duration: 30,
      reward: "200 kg CO₂ saved",
      participants: 89,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
                <p className="text-gray-600 mb-6">
                  Please sign in to access your personal dashboard and track your carbon footprint progress.
                </p>
                <Link href="/login">
                  <Button className="bg-green-600 hover:bg-green-700">Sign In to Continue</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentEmissions = footprintHistory[0]?.totalEmissions || 0
  const previousEmissions = footprintHistory[1]?.totalEmissions || currentEmissions
  const reductionPercent =
    previousEmissions > 0 ? Math.round(((previousEmissions - currentEmissions) / previousEmissions) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-xl text-gray-600">Track your progress and celebrate your eco-achievements</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingDown className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{currentEmissions.toLocaleString()}</div>
                <div className="text-sm text-gray-600">kg CO₂ latest</div>
                {reductionPercent > 0 && (
                  <Badge className="mt-2 bg-green-100 text-green-700">-{reductionPercent}% improvement</Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{userProgress?.currentStreak || 0}</div>
                <div className="text-sm text-gray-600">day streak</div>
                <div className="text-xs text-orange-600 mt-1">Keep it up! 🔥</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Leaf className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{userProgress?.totalSavings || 0}</div>
                <div className="text-sm text-gray-600">kg CO₂ saved</div>
                <div className="text-xs text-green-600 mt-1">Since joining</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{userProgress?.badges?.length || 0}</div>
                <div className="text-sm text-gray-600">badges earned</div>
                <div className="text-xs text-purple-600 mt-1">Eco champion! 🏆</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Footprint History */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5" />
                      <span>Your Footprint History</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {footprintHistory.length > 0 ? (
                      <div className="space-y-4">
                        {footprintHistory.slice(0, 6).map((data, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {data.calculatorType === "individual" && <User className="w-4 h-4" />}
                              {data.calculatorType === "family" && <Users className="w-4 h-4" />}
                              {data.calculatorType === "company" && <Building className="w-4 h-4" />}
                              <div className="w-20 text-sm font-medium">
                                {new Date(data.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex-1">
                              <Progress value={(data.totalEmissions / 50000) * 100} className="h-3" />
                            </div>
                            <div className="w-24 text-sm text-right">{data.totalEmissions.toLocaleString()} kg</div>
                            <Badge variant="outline" className="text-xs capitalize">
                              {data.calculatorType}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No footprint data yet</p>
                        <Link href="/calculate">
                          <Button className="bg-green-600 hover:bg-green-700">Calculate Your First Footprint</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href="/calculate">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Calculate New Footprint</Button>
                    </Link>
                    <Link href="/chatbot">
                      <Button variant="outline" className="w-full bg-transparent">
                        Ask EcoBuddy AI
                      </Button>
                    </Link>
                    <Link href="/community">
                      <Button variant="outline" className="w-full bg-transparent">
                        Join Community
                      </Button>
                    </Link>
                    <Link href="/learn">
                      <Button variant="outline" className="w-full bg-transparent">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Badge variant="outline" className="text-xs">
                          Reward: {challenge.reward}
                        </Badge>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Duration: {challenge.duration} days</span>
                        </div>
                        <div className="text-sm text-gray-600">Participants: {challenge.participants}</div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">Join Challenge</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Your Eco Badges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userProgress?.badges && userProgress.badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {userProgress.badges.map((badge, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="text-2xl mb-2">{badge.split(" ")[0]}</div>
                          <div className="text-sm font-medium text-gray-700">{badge.split(" ").slice(1).join(" ")}</div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No badges earned yet</p>
                      <Link href="/calculate">
                        <Button className="bg-green-600 hover:bg-green-700">Start Your Eco Journey</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
