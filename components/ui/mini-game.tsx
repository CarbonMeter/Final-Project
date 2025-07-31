"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Droplets, Recycle, Car, Trophy, Star, Timer, Target } from "lucide-react"

interface MiniGameProps {
  gameType: "energy-saver" | "water-warrior" | "transport-hero" | "recycle-master"
  onComplete: (score: number, coinsEarned: number) => void
}

export function MiniGame({ gameType, onComplete }: MiniGameProps) {
  const [gameState, setGameState] = useState<"menu" | "playing" | "completed">("menu")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const games = {
    "energy-saver": {
      title: "Energy Saver Challenge",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      description: "Save energy and earn coins!",
      questions: [
        {
          question: "How much energy can LED bulbs save compared to incandescent?",
          options: ["25%", "50%", "75%", "90%"],
          correct: 2,
          explanation: "LED bulbs use 75% less energy than incandescent bulbs!",
        },
        {
          question: "What's the best temperature for AC to save energy?",
          options: ["18°C", "22°C", "24°C", "26°C"],
          correct: 2,
          explanation: "24°C is the optimal temperature for energy efficiency!",
        },
        {
          question: "How much can unplugging devices save on electricity?",
          options: ["2%", "5%", "10%", "15%"],
          correct: 2,
          explanation: "Unplugging devices can save up to 10% on your electricity bill!",
        },
      ],
    },
    "water-warrior": {
      title: "Water Warrior Quest",
      icon: Droplets,
      color: "from-blue-400 to-cyan-500",
      description: "Conserve water like a hero!",
      questions: [
        {
          question: "How much water does a 5-minute shower use?",
          options: ["25 liters", "50 liters", "75 liters", "100 liters"],
          correct: 2,
          explanation: "A 5-minute shower uses about 75 liters of water!",
        },
        {
          question: "What's the best way to water plants?",
          options: ["Morning", "Afternoon", "Evening", "Night"],
          correct: 0,
          explanation: "Morning watering reduces evaporation and saves water!",
        },
        {
          question: "How much water can a dripping tap waste per day?",
          options: ["1 liter", "5 liters", "15 liters", "30 liters"],
          correct: 2,
          explanation: "A dripping tap can waste up to 15 liters per day!",
        },
      ],
    },
    "transport-hero": {
      title: "Transport Hero Adventure",
      icon: Car,
      color: "from-green-400 to-emerald-500",
      description: "Choose eco-friendly transport!",
      questions: [
        {
          question: "Which transport mode has the lowest carbon footprint?",
          options: ["Car", "Bus", "Train", "Bicycle"],
          correct: 3,
          explanation: "Bicycles have zero emissions and are the most eco-friendly!",
        },
        {
          question: "How much CO₂ can carpooling save per year?",
          options: ["500kg", "1000kg", "1500kg", "2000kg"],
          correct: 2,
          explanation: "Carpooling can save up to 1500kg of CO₂ per year!",
        },
        {
          question: "What's the eco-friendly speed for driving?",
          options: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"],
          correct: 1,
          explanation: "60 km/h is the most fuel-efficient speed for most vehicles!",
        },
      ],
    },
    "recycle-master": {
      title: "Recycle Master Challenge",
      icon: Recycle,
      color: "from-emerald-400 to-green-500",
      description: "Master the art of recycling!",
      questions: [
        {
          question: "How long does plastic take to decompose?",
          options: ["50 years", "100 years", "500 years", "1000 years"],
          correct: 2,
          explanation: "Plastic can take up to 500 years to decompose!",
        },
        {
          question: "What percentage of paper can be recycled?",
          options: ["50%", "70%", "85%", "95%"],
          correct: 2,
          explanation: "Up to 85% of paper can be recycled into new products!",
        },
        {
          question: "Which item should NOT go in recycling?",
          options: ["Glass bottle", "Pizza box", "Aluminum can", "Newspaper"],
          correct: 1,
          explanation: "Greasy pizza boxes contaminate other recyclables!",
        },
      ],
    },
  }

  const currentGame = games[gameType]

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0) {
      handleGameComplete()
    }
    return () => clearTimeout(timer)
  }, [gameState, timeLeft])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setTimeLeft(30)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === currentGame.questions[currentQuestion].correct) {
      setScore(score + 100)
    }

    setTimeout(() => {
      if (currentQuestion < currentGame.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        handleGameComplete()
      }
    }, 2000)
  }

  const handleGameComplete = () => {
    setGameState("completed")
    const coinsEarned = Math.floor(score / 10)
    onComplete(score, coinsEarned)
  }

  if (gameState === "menu") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentGame.color} flex items-center justify-center mx-auto mb-4`}
          >
            <currentGame.icon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-center">{currentGame.title}</CardTitle>
          <p className="text-center text-gray-600">{currentGame.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Game Rules:</span>
              <Badge variant="secondary">30 seconds</Badge>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Answer eco-friendly questions</li>
              <li>• Earn 100 points per correct answer</li>
              <li>• Win coins based on your score</li>
            </ul>
          </div>
          <Button onClick={startGame} className={`w-full bg-gradient-to-r ${currentGame.color} text-white`}>
            Start Game
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "playing") {
    const question = currentGame.questions[currentQuestion]

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Question {currentQuestion + 1}/{currentGame.questions.length}
            </Badge>
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4" />
              <span className="font-mono">{timeLeft}s</span>
            </div>
          </div>
          <Progress value={(timeLeft / 30) * 100} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">Score: {score}</div>
            <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          </div>

          <div className="space-y-2">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start ${
                  showResult
                    ? index === question.correct
                      ? "bg-green-500 text-white"
                      : selectedAnswer === index
                        ? "bg-red-500 text-white"
                        : ""
                    : ""
                }`}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
              >
                {option}
              </Button>
            ))}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${selectedAnswer === question.correct ? "bg-green-100" : "bg-red-100"}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {selectedAnswer === question.correct ? (
                    <Star className="w-5 h-5 text-green-600" />
                  ) : (
                    <Target className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {selectedAnswer === question.correct ? "Correct!" : "Incorrect!"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "completed") {
    const coinsEarned = Math.floor(score / 10)

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentGame.color} flex items-center justify-center mx-auto mb-4`}
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <CardTitle>Game Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-800">Score: {score}</div>
            <div className="text-lg text-green-600">+{coinsEarned} Eco Coins Earned!</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">Environmental Impact:</div>
            <div className="text-sm text-gray-600">
              You've learned valuable eco-friendly tips that can save up to{" "}
              <span className="font-semibold text-green-600">₹{coinsEarned * 10}</span> annually!
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setGameState("menu")} className="flex-1">
              Play Again
            </Button>
            <Button onClick={() => onComplete(score, coinsEarned)} className="flex-1">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
