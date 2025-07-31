"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  TrendingDown,
  Users,
  ArrowRight,
  Leaf,
  Target,
  Globe,
  Gamepad2,
  Trophy,
  Star,
  CheckCircle,
  Play,
} from "lucide-react"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 25000,
    co2Saved: 50000,
    calculationsCompleted: 150000,
    gamesPlayed: 75000,
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (userData && isLoggedIn === "true") {
      setUser(JSON.parse(userData))
    }
  }, [])

  const features = [
    {
      icon: Calculator,
      title: "Smart Carbon Calculator",
      description:
        "Calculate your personal, family, or company carbon footprint with our advanced AI-powered calculator.",
      color: "from-green-500 to-emerald-600",
      href: "/calculate",
      badge: "Most Popular",
    },
    {
      icon: Gamepad2,
      title: "Eco Games & Challenges",
      description: "Learn sustainability through fun mini-games and daily challenges. Earn coins and level up!",
      color: "from-purple-500 to-pink-600",
      href: "/games",
      badge: "New",
    },
    {
      icon: TrendingDown,
      title: "Progress Tracking",
      description: "Monitor your environmental impact over time with detailed analytics and personalized insights.",
      color: "from-blue-500 to-cyan-600",
      href: "/dashboard",
      badge: "AI Powered",
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with eco-warriors worldwide, share tips, and participate in group challenges.",
      color: "from-orange-500 to-red-600",
      href: "/community",
      badge: "25K+ Members",
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Environmental Enthusiast",
      content:
        "CarbonMeter helped me reduce my carbon footprint by 40% in just 6 months! The games make it so engaging.",
      avatar: "PS",
      rating: 5,
      location: "Mumbai, India",
    },
    {
      name: "Rajesh Kumar",
      role: "Tech Professional",
      content:
        "The AI insights are incredible. I never knew my daily commute had such a big impact. Now I carpool 3 days a week!",
      avatar: "RK",
      rating: 5,
      location: "Bangalore, India",
    },
    {
      name: "Anita Patel",
      role: "Small Business Owner",
      content: "We used CarbonMeter for our company and saved ₹2 lakhs annually while becoming carbon neutral!",
      avatar: "AP",
      rating: 5,
      location: "Ahmedabad, India",
    },
  ]

  const achievements = [
    { icon: Globe, label: "50,000+ tons CO₂ saved", color: "text-green-600" },
    { icon: Users, label: "25,000+ eco warriors", color: "text-blue-600" },
    { icon: Calculator, label: "150,000+ calculations", color: "text-purple-600" },
    { icon: Trophy, label: "75,000+ games played", color: "text-orange-600" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
                🌱 Join 25,000+ Eco Warriors
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Track Your{" "}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Carbon Footprint
                </span>
                <br />
                Save the Planet 🌍
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Calculate, track, and reduce your environmental impact with our gamified platform. Earn coins, play
                eco-games, and join a community of changemakers making a real difference.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link href={user ? "/calculate" : "/login"}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Start Calculating
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/games">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 bg-transparent">
                    <Play className="w-5 h-5 mr-2" />
                    Play Eco Games
                  </Button>
                </Link>
              </div>

              {/* Achievement Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`inline-flex p-3 rounded-full bg-white shadow-lg mb-2`}>
                      <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    </div>
                    <div className="text-sm font-semibold text-gray-700">{achievement.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Go Green</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our comprehensive platform makes sustainability fun, engaging, and rewarding
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform`}
                      >
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <Link href={feature.href}>
                      <Button
                        variant="outline"
                        className="group-hover:bg-green-50 group-hover:border-green-200 transition-colors bg-transparent"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How CarbonMeter Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Simple steps to start your eco-friendly journey</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Calculate Your Footprint",
                description:
                  "Use our smart calculator to measure your carbon emissions from transport, energy, food, and lifestyle.",
                icon: Calculator,
                color: "from-green-500 to-emerald-600",
              },
              {
                step: "02",
                title: "Play & Learn",
                description:
                  "Engage with eco-games, complete challenges, and earn coins while learning sustainable practices.",
                icon: Gamepad2,
                color: "from-purple-500 to-pink-600",
              },
              {
                step: "03",
                title: "Track Progress",
                description:
                  "Monitor your improvements, maintain streaks, and celebrate milestones with our community.",
                icon: Target,
                color: "from-blue-500 to-cyan-600",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg mb-4`}
                  >
                    {step.step}
                  </div>
                  <div
                    className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white -mt-10 mb-4`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Eco Warriors Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real stories from people making a difference</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                        <div className="text-xs text-gray-500">{testimonial.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of eco-warriors who are already reducing their carbon footprint and earning rewards for
              sustainable choices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={user ? "/calculate" : "/login"}>
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Leaf className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/learn">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex justify-center items-center space-x-6 text-green-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Instant results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
