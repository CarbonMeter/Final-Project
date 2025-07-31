"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    setIsSeeding(true)
    setError(null)
    setSeedResult(null)

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok) {
        setSeedResult(result)
      } else {
        setError(result.error || "Failed to seed database")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Database Setup</h1>
          <p className="text-xl text-gray-600">Initialize your CarbonMeter database with sample data</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-6 h-6" />
              <span>Seed Database</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-gray-600">
              <p className="mb-4">This will populate your database with:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Sample environmental challenges</li>
                <li>Community posts and interactions</li>
                <li>User progress examples</li>
                <li>Learning articles metadata</li>
              </ul>
            </div>

            <Button
              onClick={handleSeed}
              disabled={isSeeding}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Seed Database
                </>
              )}
            </Button>

            {seedResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Success!</span>
                </div>
                <p className="text-green-700 mb-2">{seedResult.message}</p>
                {seedResult.data && (
                  <div className="text-sm text-green-600">
                    <p>• {seedResult.data.challenges} challenges created</p>
                    <p>• {seedResult.data.posts} community posts added</p>
                    <p>• {seedResult.data.userProgress} user progress records</p>
                    <p>• {seedResult.data.articles} articles added</p>
                  </div>
                )}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-800">Error</span>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
              </motion.div>
            )}

            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold mb-1">Note:</p>
              <p>
                If the database is already seeded, this operation will skip adding duplicate data. You can run this
                safely multiple times.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
