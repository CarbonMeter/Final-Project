"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  Leaf,
  Calculator,
  BarChart3,
  Users,
  MessageCircle,
  BookOpen,
  User,
  LogOut,
  Coins,
  Trophy,
  Gamepad2,
} from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userStats, setUserStats] = useState({ coins: 0, level: 1 })
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (userData && isLoggedIn === "true") {
      setUser(JSON.parse(userData))
      loadUserStats()
    }
  }, [])

  const loadUserStats = () => {
    const gameStats = localStorage.getItem("gameStats")
    const calculationStats = localStorage.getItem("calculationStats")

    let totalCoins = 0
    let level = 1

    if (gameStats) {
      const stats = JSON.parse(gameStats)
      totalCoins += stats.totalCoins || 0
    }

    if (calculationStats) {
      const stats = JSON.parse(calculationStats)
      totalCoins += stats.coinsEarned || 0
    }

    level = Math.floor(totalCoins / 500) + 1

    setUserStats({ coins: totalCoins, level })
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    setUser(null)
    window.location.href = "/"
  }

  const navItems = [
    { name: "Calculate", href: "/calculate", icon: Calculator },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Community", href: "/community", icon: Users },
    { name: "AI Chat", href: "/chatbot", icon: MessageCircle },
    { name: "Learn", href: "/learn", icon: BookOpen },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              CarbonMeter
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      isActive ? "bg-gradient-to-r from-green-500 to-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Stats */}
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">{userStats.coins}</span>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    <Trophy className="w-3 h-3 mr-1" />
                    Level {userStats.level}
                  </Badge>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {user && (
                <div className="pb-4 border-b border-gray-200 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">{userStats.coins}</span>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <Trophy className="w-3 h-3 mr-1" />
                      Level {userStats.level}
                    </Badge>
                  </div>
                </div>
              )}

              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive ? "bg-gradient-to-r from-green-500 to-blue-500 text-white" : ""
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}

              {!user && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {user && (
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
