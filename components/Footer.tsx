"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Send,
  CheckCircle,
} from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const footerLinks = {
    product: [
      { name: "Carbon Calculator", href: "/calculate" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Eco Games", href: "/games" },
      { name: "AI Assistant", href: "/chatbot" },
    ],
    community: [
      { name: "Community Hub", href: "/community" },
      { name: "Challenges", href: "/challenges" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Success Stories", href: "/stories" },
    ],
    resources: [
      { name: "Learn", href: "/learn" },
      { name: "Blog", href: "/blog" },
      { name: "Help Center", href: "/help" },
      { name: "API Docs", href: "/docs" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-700" },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">Stay Updated on Your Eco Journey 🌱</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Get weekly tips, challenges, and insights to reduce your carbon footprint. Join 10,000+ eco-warriors
                making a difference!
              </p>

              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex space-x-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    {isSubscribed ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-green-400 text-sm"
                  >
                    ✅ Successfully subscribed! Welcome to the eco community!
                  </motion.div>
                )}
              </form>

              <div className="flex justify-center items-center space-x-4 mt-6">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  🎯 Weekly Challenges
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  💡 Eco Tips
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  🏆 Achievements
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">CarbonMeter</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm">
              Empowering individuals and organizations to measure, understand, and reduce their carbon footprint through
              gamified experiences and AI-powered insights.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@carbonmeter.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4 capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-300">
              <span>© 2024 CarbonMeter. Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for the planet.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-colors duration-200`}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            {/* Environmental Impact */}
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-300">
                <div className="font-semibold text-green-400">🌍 Impact So Far</div>
                <div>50,000+ tons CO₂ saved</div>
                <div>25,000+ eco warriors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
