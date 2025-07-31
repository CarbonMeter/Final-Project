"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"

interface ConnectionStatus {
  status: string
  database?: string
  collections?: Array<{ name: string; count: number }>
  error?: string
  timestamp: string
}

export default function AdminPage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-connection")
      const result = await response.json()
      setConnectionStatus(result)
    } catch (error) {
      setConnectionStatus({
        status: "Connection failed",
        error: "Network error",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your CarbonMeter application</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Database Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-6 h-6" />
                  <span>Database Status</span>
                </div>
                <Button variant="outline" size="sm" onClick={testConnection} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connectionStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    {connectionStatus.status.includes("success") ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={connectionStatus.status.includes("success") ? "text-green-700" : "text-red-700"}>
                      {connectionStatus.status}
                    </span>
                  </div>

                  {connectionStatus.database && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Database: {connectionStatus.database}</p>
                    </div>
                  )}

                  {connectionStatus.collections && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Collections:</p>
                      <div className="space-y-1">
                        {connectionStatus.collections.map((collection) => (
                          <div key={collection.name} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{collection.name}</span>
                            <Badge variant="outline">{collection.count} documents</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {connectionStatus.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{connectionStatus.error}</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Last checked: {new Date(connectionStatus.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Database Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-6 h-6" />
                <span>Database Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Initialize your database with sample data to get started quickly.</p>

              <div className="space-y-3">
                <Link href="/admin/seed">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Database className="w-4 h-4 mr-2" />
                    Seed Database
                  </Button>
                </Link>

                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold mb-1">What gets seeded:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Environmental challenges</li>
                    <li>Sample community posts</li>
                    <li>User progress examples</li>
                    <li>Learning articles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">MONGODB_URI</span>
                  <Badge variant={process.env.MONGODB_URI ? "default" : "destructive"}>
                    {process.env.MONGODB_URI ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">GOOGLE_CLIENT_ID</span>
                  <Badge variant={process.env.GOOGLE_CLIENT_ID ? "default" : "secondary"}>
                    {process.env.GOOGLE_CLIENT_ID ? "Set" : "Optional"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NEXTAUTH_URL</span>
                  <Badge variant="default">Set</Badge>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  Only MONGODB_URI is required. Google OAuth is optional for social login.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/calculate">
                <Button variant="outline" className="w-full bg-transparent">
                  Test Calculator
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" className="w-full bg-transparent">
                  View Community
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full bg-transparent">
                  Test Dashboard
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full bg-transparent">
                  Test Authentication
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
