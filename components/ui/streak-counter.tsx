"use client"

import { motion } from "framer-motion"
import { Flame, Calendar, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
  streakType: "daily" | "weekly" | "monthly"
  lastActivity?: Date
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  streakType = "daily",
  lastActivity,
}: StreakCounterProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600 bg-purple-100"
    if (streak >= 14) return "text-orange-600 bg-orange-100"
    if (streak >= 7) return "text-red-600 bg-red-100"
    if (streak >= 3) return "text-yellow-600 bg-yellow-100"
    return "text-green-600 bg-green-100"
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥"
    if (streak >= 14) return "⚡"
    if (streak >= 7) return "🌟"
    if (streak >= 3) return "✨"
    return "🌱"
  }

  const streakColor = getStreakColor(currentStreak)
  const streakEmoji = getStreakEmoji(currentStreak)

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-gray-800 capitalize">{streakType} Streak</span>
          </div>
          <Badge className={streakColor}>{streakEmoji} Active</Badge>
        </div>

        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-4xl font-bold text-orange-600 mb-2"
          >
            {currentStreak}
          </motion.div>
          <div className="text-sm text-gray-600">
            {streakType === "daily" ? "days" : streakType === "weekly" ? "weeks" : "months"} in a row
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Trophy className="w-4 h-4" />
            <span>Best: {longestStreak}</span>
          </div>
          {lastActivity && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Last: {lastActivity.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Streak Milestones */}
        <div className="mt-4 space-y-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Next Milestone:</div>
          <div className="flex space-x-1">
            {[3, 7, 14, 30, 60, 100].map((milestone) => (
              <div
                key={milestone}
                className={`flex-1 h-2 rounded-full ${
                  currentStreak >= milestone ? "bg-gradient-to-r from-orange-400 to-red-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>3</span>
            <span>7</span>
            <span>14</span>
            <span>30</span>
            <span>60</span>
            <span>100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
