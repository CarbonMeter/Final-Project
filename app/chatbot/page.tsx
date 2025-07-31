"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  Bot,
  User,
  Mic,
  Paperclip,
  Sparkles,
  Lightbulb,
  TrendingDown,
  Zap,
  Globe,
  Heart,
  MessageCircle,
  RotateCcw,
  Volume2,
} from "lucide-react"
import { useSession } from "next-auth/react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
  type?: "text" | "calculation" | "tip" | "achievement"
}

const quickQuestions = [
  { icon: "🚗", text: "How can I reduce transport emissions?", category: "Transport" },
  { icon: "⚡", text: "Best ways to save energy at home?", category: "Energy" },
  { icon: "🥗", text: "Sustainable food choices?", category: "Food" },
  { icon: "♻️", text: "Effective recycling tips?", category: "Lifestyle" },
  { icon: "🏠", text: "Make my home more eco-friendly?", category: "Home" },
  { icon: "💡", text: "Latest sustainability trends?", category: "Trends" },
]

const dailyTips = [
  "💡 Unplug devices when not in use to save 10% on electricity",
  "🚲 Bike to work once a week to reduce 52kg CO₂ annually",
  "🌱 Plant-based meals 2x/week can cut food emissions by 30%",
  "💧 Fix leaky faucets - they waste 3,000 gallons per year",
  "📱 Use digital receipts to save paper and reduce waste",
]

export default function ChatbotPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    // Initial greeting
    const greeting: Message = {
      id: "greeting",
      content: session
        ? `Hi ${session.user?.name}! 👋 I'm your AI sustainability assistant. I can help you reduce your carbon footprint, answer eco questions, and provide personalized recommendations. What would you like to know?`
        : "Welcome to CarbonMeter AI! 🌱 I'm here to help you on your sustainability journey. Ask me anything about reducing your carbon footprint, eco-friendly tips, or environmental impact!",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Calculate my carbon footprint",
        "Give me energy saving tips",
        "How to eat more sustainably",
        "Best eco-friendly products",
      ],
      type: "text",
    }
    setMessages([greeting])

    // Rotate daily tips
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % dailyTips.length)
    }, 5000)

    return () => clearInterval(tipInterval)
  }, [session])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      setTimeout(
        () => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            sender: "bot",
            timestamp: new Date(),
            suggestions: data.suggestions,
            type: data.type || "text",
          }

          setMessages((prev) => [...prev, botMessage])
          setIsTyping(false)
        },
        1000 + Math.random() * 1000,
      ) // Simulate realistic response time
    } catch (error) {
      console.error("Chat error:", error)
      setIsTyping(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // Voice recognition would be implemented here
  }

  const clearChat = () => {
    setMessages([])
    // Re-add greeting
    const greeting: Message = {
      id: "greeting-new",
      content: "Chat cleared! How can I help you with your sustainability goals today? 🌱",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Calculate my carbon footprint",
        "Give me energy saving tips",
        "How to eat more sustainably",
        "Best eco-friendly products",
      ],
    }
    setMessages([greeting])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              AI Sustainability Assistant
            </h1>
          </div>
          <p className="text-xl text-gray-600">Get personalized eco-friendly advice powered by advanced AI</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader className="border-b bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="border-2 border-white">
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=AI" />
                      <AvatarFallback className="bg-white text-green-600">AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">EcoBot Assistant</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-green-100">
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                        <span>Online & Ready to Help</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={clearChat} className="text-white hover:bg-white/20">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <Avatar className="flex-shrink-0">
                          {message.sender === "user" ? (
                            <>
                              <AvatarImage src={session?.user?.image || "/placeholder.svg?height=32&width=32&text=U"} />
                              <AvatarFallback>
                                <User className="w-4 h-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" />
                              <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>

                        <div
                          className={`rounded-2xl p-4 ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>

                          {message.suggestions && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestion(suggestion)}
                                  className="text-xs bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}

                          <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              <div className="border-t p-4 bg-gray-50/50">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <div className="flex-1 relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about sustainability..."
                      className="resize-none pr-12 min-h-[44px] max-h-32"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleListening}
                    className={`flex-shrink-0 ${isListening ? "bg-red-100 text-red-600" : ""}`}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="flex-shrink-0 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span>Quick Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question.text)}
                    className="w-full justify-start text-left h-auto p-3 hover:bg-green-50 hover:border-green-200"
                  >
                    <span className="mr-2 text-lg">{question.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{question.text}</div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {question.category}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Daily Tip */}
            <Card className="bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Daily Eco Tip</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTip}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-sm leading-relaxed"
                  >
                    {dailyTips[currentTip]}
                  </motion.p>
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>AI Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Carbon Footprint Analysis</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Energy Optimization</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Global Impact Tracking</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50">
                  <Heart className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Personalized Recommendations</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">127</div>
                  <div className="text-sm text-gray-600">Questions Asked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">89%</div>
                  <div className="text-sm text-gray-600">Tips Implemented</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2.3kg</div>
                  <div className="text-sm text-gray-600">CO₂ Saved This Week</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
