"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calculator, MessageCircle, Plus, X, Gamepad2, Trophy } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    icon: Calculator,
    label: "Calculate Footprint",
    href: "/calculate",
    color: "bg-green-500 hover:bg-green-600",
    description: "Quick carbon calculation",
  },
  {
    icon: Gamepad2,
    label: "Play Eco Games",
    href: "/games",
    color: "bg-purple-500 hover:bg-purple-600",
    description: "Fun sustainability games",
  },
  {
    icon: MessageCircle,
    label: "AI Assistant",
    href: "/chatbot",
    color: "bg-blue-500 hover:bg-blue-600",
    description: "Get eco-friendly tips",
  },
  {
    icon: Trophy,
    label: "Challenges",
    href: "/challenges",
    color: "bg-yellow-500 hover:bg-yellow-600",
    description: "Daily eco challenges",
  },
]

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border">
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
                <Link href={action.href}>
                  <Button
                    size="sm"
                    className={`${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 w-12 h-12 rounded-full`}
                    onClick={() => setIsOpen(false)}
                  >
                    <action.icon className="w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </Button>
    </div>
  )
}
