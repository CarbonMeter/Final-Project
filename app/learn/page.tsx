"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Clock, Star, Utensils, Car, Home, Shirt, Smartphone, Recycle } from "lucide-react"

interface Article {
  id: string
  title: string
  category: string
  readTime: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  rating: number
  summary: string
  quickTips: string[]
  icon: React.ReactNode
}

export default function LearnPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const articles: Article[] = [
    {
      id: "1",
      title: "Plant-Based Eating for Beginners",
      category: "food",
      readTime: 5,
      difficulty: "Beginner",
      rating: 4.8,
      summary:
        "Discover how to reduce your carbon footprint through simple dietary changes. Learn about plant-based proteins, meal planning, and delicious recipes.",
      quickTips: [
        "Start with one meatless day per week",
        "Try plant-based milk alternatives",
        "Experiment with legumes and beans",
        "Focus on whole foods over processed",
      ],
      icon: <Utensils className="w-6 h-6" />,
    },
    {
      id: "2",
      title: "Sustainable Transportation Guide",
      category: "travel",
      readTime: 8,
      difficulty: "Intermediate",
      rating: 4.6,
      summary:
        "Explore eco-friendly transportation options from electric vehicles to public transit. Calculate your transport emissions and find alternatives.",
      quickTips: [
        "Walk or bike for trips under 3 miles",
        "Use public transport when available",
        "Consider carpooling for longer trips",
        "Plan efficient routes to combine errands",
      ],
      icon: <Car className="w-6 h-6" />,
    },
    {
      id: "3",
      title: "Energy-Efficient Home Makeover",
      category: "home",
      readTime: 12,
      difficulty: "Advanced",
      rating: 4.9,
      summary:
        "Transform your home into an energy-efficient haven. From smart thermostats to solar panels, learn what works best for your situation.",
      quickTips: [
        "Switch to LED bulbs throughout your home",
        "Seal air leaks around windows and doors",
        "Use programmable thermostats",
        "Unplug electronics when not in use",
      ],
      icon: <Home className="w-6 h-6" />,
    },
    {
      id: "4",
      title: "Sustainable Fashion Revolution",
      category: "lifestyle",
      readTime: 7,
      difficulty: "Beginner",
      rating: 4.5,
      summary:
        "Break free from fast fashion! Learn about sustainable brands, clothing care, and building a capsule wardrobe that lasts.",
      quickTips: [
        "Buy quality pieces that last longer",
        "Shop secondhand and vintage stores",
        "Learn basic clothing repair skills",
        "Organize clothing swaps with friends",
      ],
      icon: <Shirt className="w-6 h-6" />,
    },
    {
      id: "5",
      title: "Green Technology Choices",
      category: "tech",
      readTime: 6,
      difficulty: "Intermediate",
      rating: 4.4,
      summary:
        "Make smarter tech choices that reduce your digital carbon footprint. From device longevity to cloud storage alternatives.",
      quickTips: [
        "Keep devices longer and buy refurbished",
        "Use power strips to eliminate phantom loads",
        "Choose energy-efficient electronics",
        "Properly recycle old electronics",
      ],
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      id: "6",
      title: "Zero Waste Living Essentials",
      category: "lifestyle",
      readTime: 10,
      difficulty: "Advanced",
      rating: 4.7,
      summary:
        "Master the art of zero waste living. From composting to plastic-free alternatives, create a waste-free lifestyle step by step.",
      quickTips: [
        "Start composting organic waste",
        "Bring reusable bags and containers",
        "Buy in bulk to reduce packaging",
        "Repurpose items before discarding",
      ],
      icon: <Recycle className="w-6 h-6" />,
    },
  ]

  const categories = [
    { id: "all", name: "All Topics", icon: <BookOpen className="w-4 h-4" /> },
    { id: "food", name: "Food & Diet", icon: <Utensils className="w-4 h-4" /> },
    { id: "travel", name: "Transportation", icon: <Car className="w-4 h-4" /> },
    { id: "home", name: "Home & Energy", icon: <Home className="w-4 h-4" /> },
    { id: "lifestyle", name: "Lifestyle", icon: <Shirt className="w-4 h-4" /> },
    { id: "tech", name: "Technology", icon: <Smartphone className="w-4 h-4" /> },
  ]

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Learning Hub 📚</h1>
          <p className="text-xl text-gray-600">Expand your knowledge and become a sustainability expert</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-1">
                    {category.icon}
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      {article.icon}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{article.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                    {article.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} min read</span>
                    <Badge className={getDifficultyColor(article.difficulty)}>{article.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{article.summary}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-800 mb-2">Quick Tips:</h4>
                    <ul className="space-y-1">
                      {article.quickTips.slice(0, 2).map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:bg-green-700 transition-colors">
                    Read Full Article
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse different categories</p>
          </motion.div>
        )}

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Want to Contribute?</h2>
              <p className="text-xl mb-6 opacity-90">
                Share your sustainability knowledge with the community! Write articles, share tips, and help others on
                their eco journey.
              </p>
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                Submit Your Article
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
