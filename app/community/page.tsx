"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Trophy, Users, MessageCircle, Heart, Share2, Award, TrendingUp, Leaf } from "lucide-react"
import { useSession } from "next-auth/react"

interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  points: number
  rank: number
  badges: string[]
  totalSavings: number
  currentStreak: number
}

interface CommunityPost {
  _id: string
  author: string
  avatar: string
  content: string
  createdAt: string
  likes: string[]
  comments: any[]
  badges: string[]
  category: string
}

// Mock data for when database is not available
const mockLeaderboard: LeaderboardUser[] = [
  {
    id: "1",
    name: "Sarah Green",
    avatar: "/placeholder.svg?height=40&width=40&text=SG",
    points: 2450,
    rank: 1,
    badges: ["🌱 Eco Warrior", "🚲 Bike Champion", "♻️ Recycling Pro"],
    totalSavings: 1250,
    currentStreak: 45,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    points: 2180,
    rank: 2,
    badges: ["⚡ Energy Saver", "🌱 Plant Parent"],
    totalSavings: 980,
    currentStreak: 32,
  },
  {
    id: "3",
    name: "Emma Davis",
    avatar: "/placeholder.svg?height=40&width=40&text=ED",
    points: 1890,
    rank: 3,
    badges: ["🥗 Plant-Based", "🚗 Car-Free"],
    totalSavings: 756,
    currentStreak: 28,
  },
  {
    id: "4",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=AJ",
    points: 1650,
    rank: 4,
    badges: ["🏠 Green Home", "💡 Smart Living"],
    totalSavings: 623,
    currentStreak: 21,
  },
  {
    id: "5",
    name: "Lisa Wang",
    avatar: "/placeholder.svg?height=40&width=40&text=LW",
    points: 1420,
    rank: 5,
    badges: ["🌊 Water Saver", "📱 Digital Minimalist"],
    totalSavings: 534,
    currentStreak: 19,
  },
]

const mockPosts: CommunityPost[] = [
  {
    _id: "1",
    author: "Sarah Green",
    avatar: "/placeholder.svg?height=40&width=40&text=SG",
    content:
      "Just completed my first month of biking to work every day! 🚲 Saved 45kg of CO₂ and feeling amazing. The morning rides have become my favorite part of the day. Who else is part of the bike-to-work movement?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: ["2", "3", "4"],
    comments: [],
    badges: ["🌱 Eco Warrior", "🚲 Bike Champion"],
    category: "achievement",
  },
  {
    _id: "2",
    author: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    content:
      "💡 Pro tip: Switching to LED bulbs throughout my house reduced my electricity bill by 30%! The upfront cost pays for itself in just 6 months. Plus, they last 10x longer than traditional bulbs. Small changes, big impact! ⚡",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: ["1", "3", "5"],
    comments: [],
    badges: ["⚡ Energy Saver"],
    category: "tip",
  },
  {
    _id: "3",
    author: "Emma Davis",
    avatar: "/placeholder.svg?height=40&width=40&text=ED",
    content:
      "Started my plant-based journey 3 months ago and the results are incredible! 🌱 Not only do I feel healthier, but I've reduced my food-related carbon footprint by 40%. Sharing my favorite recipes in the comments below!",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: ["1", "2", "4", "5"],
    comments: [],
    badges: ["🥗 Plant-Based"],
    category: "story",
  },
  {
    _id: "4",
    author: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=AJ",
    content:
      "Question for the community: What's the most effective way to reduce water usage at home? I've already installed low-flow showerheads and fixed all leaks. Looking for more ideas! 💧",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: ["2", "3"],
    comments: [],
    badges: ["🏠 Green Home"],
    category: "question",
  },
]

export default function CommunityPage() {
  const { data: session } = useSession()
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts)
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(mockLeaderboard)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCommunityData()
  }, [])

  const fetchCommunityData = async () => {
    setLoading(true)
    try {
      // Try to fetch real data, fall back to mock data
      const postsRes = await fetch("/api/community/posts")
      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData)
      }

      const leaderboardRes = await fetch("/api/community/leaderboard")
      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json()
        setLeaderboard(leaderboardData)
      }
    } catch (error) {
      console.error("Error fetching community data:", error)
      // Use mock data as fallback
      setPosts(mockPosts)
      setLeaderboard(mockLeaderboard)
    } finally {
      setLoading(false)
    }
  }

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return

    const newPostData: CommunityPost = {
      _id: Date.now().toString(),
      author: session?.user?.name || "Anonymous User",
      avatar: session?.user?.image || "/placeholder.svg?height=40&width=40&text=U",
      content: newPost,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      badges: ["🌱 First Step"],
      category: "story",
    }

    setPosts([newPostData, ...posts])
    setNewPost("")

    // Try to save to backend if available
    try {
      await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newPost,
          category: "story",
        }),
      })
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  const handleLike = async (postId: string) => {
    if (!session) return

    setPosts(
      posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: post.likes.includes(session.user.id || "")
                ? post.likes.filter((id) => id !== session.user.id)
                : [...post.likes, session.user.id || ""],
            }
          : post,
      ),
    )

    // Try to save to backend if available
    try {
      await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `#${rank}`
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "achievement":
        return "bg-yellow-100 text-yellow-800"
      case "tip":
        return "bg-blue-100 text-blue-800"
      case "story":
        return "bg-green-100 text-green-800"
      case "question":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading community...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Eco Community 🌍</h1>
          <p className="text-xl text-gray-600">
            Connect, share, and inspire each other on the journey to sustainability
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Share Your Eco Journey</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Share a tip, celebrate an achievement, or ask the community a question..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-4"
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">
                        💡 Tip
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        🎉 Achievement
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        📖 Story
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ❓ Question
                      </Badge>
                    </div>
                    <Button
                      onClick={handlePostSubmit}
                      disabled={!newPost.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Community Posts */}
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={post.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {post.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-800">{post.author}</h3>
                            {post.badges.map((badge, badgeIndex) => (
                              <Badge key={badgeIndex} className="text-xs bg-green-100 text-green-700">
                                {badge}
                              </Badge>
                            ))}
                            <Badge className={`text-xs ${getCategoryColor(post.category)}`}>{post.category}</Badge>
                          </div>
                          <p className="text-gray-700 mb-3">{post.content}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center space-x-4">
                              <button
                                className={`flex items-center space-x-1 transition-colors ${
                                  session && post.likes.includes(session.user?.id || "")
                                    ? "text-red-500"
                                    : "hover:text-red-500"
                                }`}
                                onClick={() => handleLike(post._id)}
                              >
                                <Heart className="w-4 h-4" />
                                <span>{post.likes.length}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.comments.length}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Community Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{leaderboard.length * 100 + 847}</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-600">
                        {leaderboard.reduce((sum, user) => sum + user.totalSavings, 0)}
                      </div>
                      <div className="text-xs text-gray-600">kg CO₂ Saved</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600">{posts.length}</div>
                      <div className="text-xs text-gray-600">Tips Shared</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Leaderboard */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>Top Contributors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.slice(0, 5).map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-3">
                        <div className="text-lg font-bold w-8 text-center">{getRankIcon(user.rank)}</div>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{user.name}</div>
                          <div className="text-xs text-gray-600">{Math.round(user.points)} points</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-green-600 font-medium">{user.totalSavings}kg saved</div>
                          <div className="text-xs text-gray-500">{user.currentStreak} day streak</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trending Topics */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Trending Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { topic: "#PlantBasedChallenge", posts: 234 },
                      { topic: "#BikeToWork", posts: 189 },
                      { topic: "#ZeroWasteWeek", posts: 156 },
                      { topic: "#SolarPower", posts: 142 },
                      { topic: "#CompostLife", posts: 128 },
                    ].map((trend, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-600">{trend.topic}</span>
                        <span className="text-xs text-gray-500">{trend.posts} posts</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Challenge */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Weekly Challenge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h3 className="font-semibold">Plastic-Free Week</h3>
                    <p className="text-sm opacity-90">
                      Avoid single-use plastics for 7 days. Share your alternatives and tips!
                    </p>
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-4 h-4" />
                      <span className="text-sm">1,247 participants</span>
                    </div>
                    <Button className="w-full bg-white text-green-600 hover:bg-green-50">Join Challenge</Button>
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
