"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { StreakCounter } from "@/components/ui/streak-counter"
import { Car, Home, Utensils, Trash2, ArrowLeft, ArrowRight, User, Users, Building, History, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

interface FormData {
  calculatorType: "individual" | "family" | "company"
  familySize?: number
  employeeCount?: number
  transportation: {
    carKm: number
    carType: string
    publicTransport: number
    flights: number
    carCount?: number
    fleetSize?: number
  }
  energy: {
    electricity: number
    gas: number
    renewable: boolean
    homeSize: string
    buildingSize?: string
    facilities?: number
  }
  food: {
    meatFrequency: number
    localFood: boolean
    organicFood: boolean
    foodWaste: number
    cafeteria?: boolean
  }
  lifestyle: {
    shopping: number
    recycling: boolean
    wasteReduction: number
    businessTravel?: number
    officeSupplies?: number
  }
}

export default function CalculatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [previousCalculations, setPreviousCalculations] = useState<any[]>([])
  const [userStats, setUserStats] = useState({
    calculationStreak: 3,
    longestStreak: 7,
    totalCalculations: 12,
    coinsEarned: 450,
  })
  const [formData, setFormData] = useState<FormData>({
    calculatorType: "individual",
    transportation: {
      carKm: 50,
      carType: "petrol",
      publicTransport: 10,
      flights: 2,
    },
    energy: {
      electricity: 300,
      gas: 15,
      renewable: false,
      homeSize: "medium",
    },
    food: {
      meatFrequency: 4,
      localFood: false,
      organicFood: false,
      foodWaste: 20,
    },
    lifestyle: {
      shopping: 5000,
      recycling: true,
      wasteReduction: 50,
    },
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (userData && isLoggedIn === "true") {
      setUser(JSON.parse(userData))
      loadPreviousCalculations()
      loadUserStats()
    }
  }, [])

  const loadUserStats = () => {
    const savedStats = localStorage.getItem("calculationStats")
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }

  const loadPreviousCalculations = () => {
    const saved = localStorage.getItem("carbonCalculations")
    if (saved) {
      setPreviousCalculations(JSON.parse(saved))
    }
  }

  const steps = [
    {
      title: "Calculator Type",
      icon: <User className="w-6 h-6" />,
      description: "Choose your calculation type",
    },
    {
      title: "Transportation",
      icon: <Car className="w-6 h-6" />,
      description: "How do you get around?",
    },
    {
      title: "Energy Usage",
      icon: <Home className="w-6 h-6" />,
      description: "Your energy consumption",
    },
    {
      title: "Food & Diet",
      icon: <Utensils className="w-6 h-6" />,
      description: "What and how you eat",
    },
    {
      title: "Lifestyle & Waste",
      icon: <Trash2 className="w-6 h-6" />,
      description: "Shopping and waste habits",
    },
  ]

  const calculateEmissions = (data: FormData) => {
    let multiplier = 1

    // Apply multipliers based on calculator type
    if (data.calculatorType === "family") {
      multiplier = data.familySize || 4
    } else if (data.calculatorType === "company") {
      multiplier = data.employeeCount || 50
    }

    // Base calculations (converted to metric system)
    const transportEmissions = (data.transportation.carKm * 0.15 + data.transportation.flights * 200) * multiplier
    const energyEmissions = (data.energy.electricity * 0.82 + data.energy.gas * 2.3) * multiplier // kWh to kg CO2
    const foodEmissions = (data.food.meatFrequency * 6.5 + data.food.foodWaste * 0.1) * multiplier
    let lifestyleEmissions = (data.lifestyle.shopping / 1000) * 2.5 * multiplier // Rupees to kg CO2

    // Add company-specific emissions
    if (data.calculatorType === "company") {
      lifestyleEmissions += ((data.lifestyle.businessTravel || 0) / 1000) * 0.5
      lifestyleEmissions += ((data.lifestyle.officeSupplies || 0) / 1000) * 0.02
    }

    const breakdown = {
      transportation: Math.round((transportEmissions * 365) / 1000),
      energy: Math.round((energyEmissions * 365) / 1000),
      food: Math.round((foodEmissions * 365) / 1000),
      lifestyle: Math.round((lifestyleEmissions * 365) / 1000),
    }

    const totalEmissions = breakdown.transportation + breakdown.energy + breakdown.food + breakdown.lifestyle

    // Calculate coins earned based on eco-friendly choices
    let coinsEarned = 50 // Base coins
    if (data.energy.renewable) coinsEarned += 25
    if (data.food.localFood) coinsEarned += 20
    if (data.lifestyle.recycling) coinsEarned += 15
    if (data.transportation.carType === "electric") coinsEarned += 30
    if (data.food.meatFrequency <= 3) coinsEarned += 20

    return {
      totalEmissions,
      breakdown,
      calculatorType: data.calculatorType,
      multiplier,
      formData: data,
      timestamp: new Date().toISOString(),
      coinsEarned,
      moneySaved: Math.round(totalEmissions * 2.5), // Estimated money saved in rupees
    }
  }

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsSubmitting(true)

      setTimeout(() => {
        const result = calculateEmissions(formData)

        // Update user stats
        const newStats = {
          ...userStats,
          calculationStreak: userStats.calculationStreak + 1,
          longestStreak: Math.max(userStats.longestStreak, userStats.calculationStreak + 1),
          totalCalculations: userStats.totalCalculations + 1,
          coinsEarned: userStats.coinsEarned + result.coinsEarned,
        }
        setUserStats(newStats)
        localStorage.setItem("calculationStats", JSON.stringify(newStats))

        // Save to localStorage
        const existingCalculations = JSON.parse(localStorage.getItem("carbonCalculations") || "[]")
        existingCalculations.unshift(result)
        localStorage.setItem("carbonCalculations", JSON.stringify(existingCalculations.slice(0, 10)))
        localStorage.setItem("carbonResults", JSON.stringify(result))

        router.push("/results")
      }, 2000)
    }
  }

  const loadPreviousCalculation = (calculation: any) => {
    setFormData(calculation.formData)
    setShowHistory(false)
  }

  const renderCalculatorTypeStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer transition-all ${formData.calculatorType === "individual" ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"}`}
          onClick={() => setFormData((prev) => ({ ...prev, calculatorType: "individual" }))}
        >
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">Individual</h3>
            <p className="text-sm text-gray-600">Calculate your personal carbon footprint</p>
            <Badge className="mt-2 bg-green-100 text-green-700">+50 coins</Badge>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${formData.calculatorType === "family" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"}`}
          onClick={() => setFormData((prev) => ({ ...prev, calculatorType: "family" }))}
        >
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Family</h3>
            <p className="text-sm text-gray-600">Calculate your household's footprint</p>
            <Badge className="mt-2 bg-blue-100 text-blue-700">+75 coins</Badge>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${formData.calculatorType === "company" ? "ring-2 ring-purple-500 bg-purple-50" : "hover:shadow-md"}`}
          onClick={() => setFormData((prev) => ({ ...prev, calculatorType: "company" }))}
        >
          <CardContent className="p-6 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-lg font-semibold mb-2">Company</h3>
            <p className="text-sm text-gray-600">Calculate your organization's footprint</p>
            <Badge className="mt-2 bg-purple-100 text-purple-700">+100 coins</Badge>
          </CardContent>
        </Card>
      </div>

      {formData.calculatorType === "family" && (
        <div>
          <Label className="text-base font-medium">Family Size</Label>
          <div className="mt-2">
            <Slider
              value={[formData.familySize || 4]}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, familySize: value[0] }))}
              max={10}
              min={2}
              step={1}
              className="w-full"
            />
            <div className="text-center mt-2 text-sm text-gray-600">{formData.familySize || 4} family members</div>
          </div>
        </div>
      )}

      {formData.calculatorType === "company" && (
        <div>
          <Label className="text-base font-medium">Number of Employees</Label>
          <div className="mt-2">
            <Slider
              value={[formData.employeeCount || 50]}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, employeeCount: value[0] }))}
              max={1000}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="text-center mt-2 text-sm text-gray-600">{formData.employeeCount || 50} employees</div>
          </div>
        </div>
      )}
    </div>
  )

  const renderTransportationStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">
          {formData.calculatorType === "individual"
            ? "Weekly car kilometers"
            : formData.calculatorType === "family"
              ? "Family weekly car kilometers"
              : "Average employee weekly car kilometers"}
        </Label>
        <div className="mt-2">
          <Slider
            value={[formData.transportation.carKm]}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                transportation: { ...prev.transportation, carKm: value[0] },
              }))
            }
            max={formData.calculatorType === "company" ? 200 : 300}
            step={5}
            className="w-full"
          />
          <div className="text-center mt-2 text-sm text-gray-600">{formData.transportation.carKm} km/week</div>
          <div className="text-center mt-1 text-xs text-green-600">
            Estimated fuel cost: ₹{Math.round(formData.transportation.carKm * 8)}/week
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Primary vehicle type</Label>
        <Select
          value={formData.transportation.carType}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              transportation: { ...prev.transportation, carType: value },
            }))
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electric">Electric ⚡ (+30 coins)</SelectItem>
            <SelectItem value="hybrid">Hybrid 🔋 (+20 coins)</SelectItem>
            <SelectItem value="cng">CNG 🌿 (+15 coins)</SelectItem>
            <SelectItem value="petrol">Petrol ⛽</SelectItem>
            <SelectItem value="diesel">Diesel 🛢️</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-medium">
          {formData.calculatorType === "company" ? "Business flights per year" : "Flights per year"}
        </Label>
        <Input
          type="number"
          value={formData.transportation.flights}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              transportation: { ...prev.transportation, flights: Number.parseInt(e.target.value) || 0 },
            }))
          }
          className="mt-2"
        />
        <div className="text-xs text-gray-500 mt-1">
          Estimated cost: ₹{(formData.transportation.flights * 15000).toLocaleString()}/year
        </div>
      </div>
    </div>
  )

  const renderEnergyStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Monthly electricity usage (kWh)</Label>
        <div className="mt-2">
          <Slider
            value={[formData.energy.electricity]}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                energy: { ...prev.energy, electricity: value[0] },
              }))
            }
            max={formData.calculatorType === "company" ? 50000 : 1000}
            step={formData.calculatorType === "company" ? 500 : 25}
            className="w-full"
          />
          <div className="text-center mt-2 text-sm text-gray-600">{formData.energy.electricity} kWh/month</div>
          <div className="text-center mt-1 text-xs text-green-600">
            Estimated bill: ₹{Math.round(formData.energy.electricity * 6)}/month
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Monthly LPG/PNG consumption (kg)</Label>
        <div className="mt-2">
          <Slider
            value={[formData.energy.gas]}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                energy: { ...prev.energy, gas: value[0] },
              }))
            }
            max={formData.calculatorType === "company" ? 500 : 50}
            step={1}
            className="w-full"
          />
          <div className="text-center mt-2 text-sm text-gray-600">{formData.energy.gas} kg/month</div>
          <div className="text-center mt-1 text-xs text-green-600">
            Estimated cost: ₹{Math.round(formData.energy.gas * 60)}/month
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.energy.renewable}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              energy: { ...prev.energy, renewable: checked },
            }))
          }
        />
        <Label>Uses renewable energy sources (+25 coins) 🌞</Label>
      </div>
    </div>
  )

  const renderFoodStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Meat meals per week</Label>
        <div className="mt-2">
          <Slider
            value={[formData.food.meatFrequency]}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                food: { ...prev.food, meatFrequency: value[0] },
              }))
            }
            max={21}
            step={1}
            className="w-full"
          />
          <div className="text-center mt-2 text-sm text-gray-600">{formData.food.meatFrequency} meals/week</div>
          <div className="text-center mt-1 text-xs text-green-600">
            {formData.food.meatFrequency <= 3 && "Low meat consumption! +20 coins 🌱"}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.food.localFood}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              food: { ...prev.food, localFood: checked },
            }))
          }
        />
        <Label>Buys local/seasonal food (+20 coins) 🥬</Label>
      </div>

      <div>
        <Label className="text-base font-medium">Food waste percentage</Label>
        <div className="mt-2">
          <Slider
            value={[formData.food.foodWaste]}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                food: { ...prev.food, foodWaste: value[0] },
              }))
            }
            max={50}
            step={5}
            className="w-full"
          />
          <div className="text-center mt-2 text-sm text-gray-600">{formData.food.foodWaste}% food waste</div>
          <div className="text-center mt-1 text-xs text-red-600">
            Wasted money: ₹{Math.round((formData.food.foodWaste / 100) * 3000)}/month
          </div>
        </div>
      </div>
    </div>
  )

  const renderLifestyleStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Monthly shopping budget (₹)</Label>
        <div className="mt-2">
          <Slider
            value={[formData.lifestyle.shopping]}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                lifestyle: { ...prev.lifestyle, shopping: value[0] },
              }))
            }
            max={formData.calculatorType === "company" ? 500000 : 25000}
            step={formData.calculatorType === "company" ? 5000 : 500}
            className="w-full"
          />
          <div className="text-center mt-2 text-sm text-gray-600">
            ₹{formData.lifestyle.shopping.toLocaleString()}/month
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.lifestyle.recycling}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              lifestyle: { ...prev.lifestyle, recycling: checked },
            }))
          }
        />
        <Label>Actively recycles (+15 coins) ♻️</Label>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderCalculatorTypeStep()
      case 1:
        return renderTransportationStep()
      case 2:
        return renderEnergyStep()
      case 3:
        return renderFoodStep()
      case 4:
        return renderLifestyleStep()
      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
                <p className="text-gray-600 mb-6">Please sign in to calculate and save your carbon footprint.</p>
                <Button onClick={() => router.push("/login")} className="bg-green-600 hover:bg-green-700">
                  Sign In to Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-800">Carbon Footprint Calculator</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{userStats.coinsEarned}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2"
              >
                <History className="w-4 h-4" />
                <span>Previous Calculations</span>
              </Button>
            </div>
          </div>
          <p className="text-xl text-gray-600">Let's measure your environmental impact together 🌱</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-3">
            {showHistory && previousCalculations.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Previous Calculations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {previousCalculations.slice(0, 5).map((calc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium capitalize">
                              {calc.calculatorType} - {calc.totalEmissions} kg CO₂
                            </div>
                            <div className="text-sm text-gray-600">{new Date(calc.timestamp).toLocaleDateString()}</div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => loadPreviousCalculation(calc)}>
                            Load
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 ${index <= currentStep ? "text-green-600" : "text-gray-400"}`}
                  >
                    <div className={`p-2 rounded-full ${index <= currentStep ? "bg-green-100" : "bg-gray-100"}`}>
                      {step.icon}
                    </div>
                    <span className="hidden md:block font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
              <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      {steps[currentStep].icon}
                      <div>
                        <h2 className="text-2xl">{steps[currentStep].title}</h2>
                        <p className="text-gray-600 font-normal">{steps[currentStep].description}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{renderStepContent()}</CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === steps.length - 1 ? "Calculate Results" : "Next"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streak Counter */}
            <StreakCounter
              currentStreak={userStats.calculationStreak}
              longestStreak={userStats.longestStreak}
              streakType="daily"
              lastActivity={new Date()}
            />

            {/* Coins & Stats */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span>Your Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{userStats.coinsEarned}</div>
                  <div className="text-sm text-gray-600">Eco Coins Earned</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-800">{userStats.totalCalculations}</div>
                    <div className="text-gray-600">Calculations</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800">{userStats.longestStreak}</div>
                    <div className="text-gray-600">Best Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eco Tips */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg">💡 Eco Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Using public transport just 2 days a week can save you ₹2,000+ annually and reduce CO₂ by 500kg!
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  🎮 Play Eco Games
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  🤖 Ask AI Assistant
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  🏆 View Challenges
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
