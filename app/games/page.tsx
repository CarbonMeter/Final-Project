"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MiniGame } from "@/components/ui/mini-game"
import { StreakCounter } from "@/components/ui/streak-counter"
import { Gamepad2, Trophy, Coins, Zap, Droplets, Car, Recycle, Gift, Crown, Target } from "lucide-react"

export default function GamesPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [userStats, setUserStats] = useState({
    totalCoins: 1250,
    gamesPlayed: 23,
    currentStreak: 7,
    longestStreak: 12,
    totalScore: 18500,
    level: 5,
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (userData && isLoggedIn === "true") {
      setUser(JSON.parse(userData))
      loadUserStats()
    }
  }, [])

  const loadUserStats = () => {
    const savedStats = localStorage.getItem("gameStats")
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }

  const saveUserStats = (newStats: any) => {
    setUserStats(newStats)
    localStorage.setItem("gameStats", JSON.stringify(newStats))
  }

  const handleGameComplete = (score: number, coinsEarned: number) => {
    const newStats = {
      ...userStats,
      totalCoins: userStats.totalCoins + coinsEarned,
      gamesPlayed: userStats.gamesPlayed + 1,
      totalScore: userStats.totalScore + score,
      currentStreak: userStats.currentStreak + 1,
      longestStreak: Math.max(userStats.longestStreak, userStats.currentStreak + 1),
    }

    // Level up logic
    if (newStats.totalScore > userStats.level * 5000) {
      newStats.level = Math.floor(newStats.totalScore / 5000)
    }

    saveUserStats(newStats)
    setSelectedGame(null)
  }

  const games = [
    {
      id: "energy-saver",
      title: "Energy Saver Challenge",
      description: "Learn to save electricity and reduce your carbon footprint",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      difficulty: "Easy",
      reward: "50-150 coins",
      estimatedTime: "2 min",
    },
    {
      id: "water-warrior",
      title: "Water Warrior Quest",
      description: "Master water conservation techniques",
      icon: Droplets,
      color: "from-blue-400 to-cyan-500",
      difficulty: "Medium",
      reward: "75-200 coins",
      estimatedTime: "3 min",
    },
    {
      id: "transport-hero",
      title: "Transport Hero Adventure",
      description: "Choose eco-friendly transportation options",
      icon: Car,
      color: "from-green-400 to-emerald-500",
      difficulty: "Medium",
      reward: "100-250 coins",
      estimatedTime: "3 min",
    },
    {
      id: "recycle-master",
      title: "Recycle Master Challenge",
      description: "Become a recycling expert and reduce waste",
      icon: Recycle,
      color: "from-emerald-400 to-green-500",
      difficulty: "Hard",
      reward: "150-300 coins",
      estimatedTime: "4 min",
    },
  ]

  const achievements = [
    {
      name: "First Game",
      description: "Complete your first mini-game",
      icon: "🎮",
      unlocked: userStats.gamesPlayed >= 1,
    },
    {
      name: "Streak Master",
      description: "Maintain a 7-day gaming streak",
      icon: "🔥",
      unlocked: userStats.currentStreak >= 7,
    },
    { name: "Coin Collector", description: "Earn 1000 eco coins", icon: "💰", unlocked: userStats.totalCoins >= 1000 },
    {
      name: "High Scorer",
      description: "Score 15,000+ total points",
      icon: "⭐",
      unlocked: userStats.totalScore >= 15000,
    },
    { name: "Level Up", description: "Reach level 5", icon: "👑", unlocked: userStats.level >= 5 },
    { name: "Game Master", description: "Play 20+ games", icon: "🏆", unlocked: userStats.gamesPlayed >= 20 },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <Gamepad2 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to Play Games</h2>
                <p className="text-gray-600 mb-6">
                  Join the fun and earn eco coins while learning about sustainability!
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">Sign In to Continue</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => setSelectedGame(null)}>
              ← Back to Games
            </Button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{userStats.totalCoins}</span>
              </div>
              <Badge variant="secondary">Level {userStats.level}</Badge>
            </div>
          </div>

          <MiniGame gameType={selectedGame as any} onComplete={handleGameComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Eco Games Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600">Play fun games, learn sustainability, and earn eco coins!</p>
        </motion.div>

        {/* User Stats Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
              <CardContent className="p-6 text-center">
                <Coins className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.totalCoins.toLocaleString()}</div>
                <div className="text-sm opacity-90">Eco Coins</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6 text-center">
                <Crown className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">Level {userStats.level}</div>
                <div className="text-sm opacity-90">Current Level</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.totalScore.toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Score</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.gamesPlayed}</div>
                <div className="text-sm opacity-90">Games Played</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Games Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Games</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${game.color} text-white group-hover:scale-110 transition-transform`}
                        >
                          <game.icon className="w-6 h-6" />
                        </div>
                        <Badge variant="outline">{game.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                        {game.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{game.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Reward:</span>
                          <span className="font-semibold text-green-600">{game.reward}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-semibold">{game.estimatedTime}</span>
                        </div>
                        <Button
                          onClick={() => setSelectedGame(game.id)}
                          className={`w-full bg-gradient-to-r ${game.color} text-white hover:shadow-lg transition-all duration-300`}
                        >
                          Play Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streak Counter */}
            <StreakCounter
              currentStreak={userStats.currentStreak}
              longestStreak={userStats.longestStreak}
              streakType="daily"
              lastActivity={new Date()}
            />

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      achievement.unlocked
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{achievement.name}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                    </div>
                    {achievement.unlocked && <Badge className="bg-green-500 text-white">✓</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Daily Rewards */}
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  <span>Daily Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎁</div>
                  <div className="font-semibold text-gray-800 mb-2">Come back tomorrow!</div>
                  <div className="text-sm text-gray-600 mb-4">
                    Play daily to earn bonus coins and maintain your streak
                  </div>
                  <Badge className="bg-pink-500 text-white">Next reward: ₹{userStats.currentStreak * 10} coins</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
