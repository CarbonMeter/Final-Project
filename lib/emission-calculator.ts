// Emission calculation helper functions with Indian context
export interface EmissionData {
  transportation: {
    carMiles: number
    carType: "petrol" | "diesel" | "electric" | "hybrid"
    publicTransport: number
    flights: number
    twoWheeler: number
  }
  energy: {
    electricity: number // kWh per month
    gas: number // kg per month
    renewable: boolean
    homeSize: "small" | "medium" | "large"
  }
  food: {
    meatFrequency: number // meals per week
    localFood: boolean
    organicFood: boolean
    foodWaste: number // kg per week
  }
  lifestyle: {
    shopping: number // INR per month
    recycling: boolean
    wasteReduction: number // percentage
  }
}

export interface EmissionResult {
  totalDaily: number
  totalMonthly: number
  totalYearly: number
  breakdown: {
    transportation: number
    energy: number
    food: number
    lifestyle: number
  }
  comparison: {
    indianAverage: number
    globalAverage: number
    percentile: number
  }
}

// Emission factors (kg CO2 per unit) - Indian context
const EMISSION_FACTORS = {
  transportation: {
    petrol: 2.31, // kg CO2 per liter
    diesel: 2.68,
    electric: 0.82, // kg CO2 per kWh (Indian grid)
    hybrid: 1.85,
    publicTransport: 0.089, // kg CO2 per km
    flights: 0.255, // kg CO2 per km
    twoWheeler: 1.2, // kg CO2 per liter
  },
  energy: {
    electricity: 0.82, // kg CO2 per kWh (Indian grid mix)
    gas: 2.75, // kg CO2 per kg LPG
    homeSize: {
      small: 1.0,
      medium: 1.3,
      large: 1.8,
    },
  },
  food: {
    meat: 6.61, // kg CO2 per meal
    vegetarian: 1.5, // kg CO2 per meal
    local: 0.8, // reduction factor
    organic: 0.9, // reduction factor
    waste: 3.3, // kg CO2 per kg food waste
  },
  lifestyle: {
    shopping: 0.0005, // kg CO2 per INR spent
    recycling: 0.7, // reduction factor
  },
}

export function calculateEmissions(data: EmissionData): EmissionResult {
  // Transportation emissions
  const carEmissions = calculateCarEmissions(data.transportation)
  const publicTransportEmissions =
    data.transportation.publicTransport * EMISSION_FACTORS.transportation.publicTransport * 30
  const flightEmissions = data.transportation.flights * EMISSION_FACTORS.transportation.flights
  const twoWheelerEmissions = calculateTwoWheelerEmissions(data.transportation.twoWheeler)

  const transportationTotal = carEmissions + publicTransportEmissions + flightEmissions + twoWheelerEmissions

  // Energy emissions
  const electricityEmissions = data.energy.electricity * EMISSION_FACTORS.energy.electricity
  const gasEmissions = data.energy.gas * EMISSION_FACTORS.energy.gas
  const homeSizeMultiplier = EMISSION_FACTORS.energy.homeSize[data.energy.homeSize]
  const renewableReduction = data.energy.renewable ? 0.3 : 1.0

  const energyTotal = (electricityEmissions + gasEmissions) * homeSizeMultiplier * renewableReduction

  // Food emissions
  const meatEmissions = data.food.meatFrequency * EMISSION_FACTORS.food.meat * 4.33 // weeks per month
  const vegetarianMeals = (21 - data.food.meatFrequency) * 4.33 // remaining meals
  const vegetarianEmissions = vegetarianMeals * EMISSION_FACTORS.food.vegetarian

  let foodEmissions = meatEmissions + vegetarianEmissions
  if (data.food.localFood) foodEmissions *= EMISSION_FACTORS.food.local
  if (data.food.organicFood) foodEmissions *= EMISSION_FACTORS.food.organic

  const wasteEmissions = data.food.foodWaste * EMISSION_FACTORS.food.waste * 4.33
  const foodTotal = foodEmissions + wasteEmissions

  // Lifestyle emissions
  const shoppingEmissions = data.lifestyle.shopping * EMISSION_FACTORS.lifestyle.shopping
  const recyclingReduction = data.lifestyle.recycling ? EMISSION_FACTORS.lifestyle.recycling : 1.0
  const wasteReduction = 1 - data.lifestyle.wasteReduction / 100

  const lifestyleTotal = shoppingEmissions * recyclingReduction * wasteReduction

  // Calculate totals
  const totalMonthly = transportationTotal + energyTotal + foodTotal + lifestyleTotal
  const totalDaily = totalMonthly / 30
  const totalYearly = totalMonthly * 12

  // Indian and global averages (kg CO2 per month)
  const indianAverage = 150 // kg CO2 per month
  const globalAverage = 400 // kg CO2 per month

  // Calculate percentile (lower is better)
  const percentile = Math.min(95, Math.max(5, (totalMonthly / indianAverage) * 50))

  return {
    totalDaily: Math.round(totalDaily * 100) / 100,
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    totalYearly: Math.round(totalYearly * 100) / 100,
    breakdown: {
      transportation: Math.round(transportationTotal * 100) / 100,
      energy: Math.round(energyTotal * 100) / 100,
      food: Math.round(foodTotal * 100) / 100,
      lifestyle: Math.round(lifestyleTotal * 100) / 100,
    },
    comparison: {
      indianAverage,
      globalAverage,
      percentile: Math.round(percentile),
    },
  }
}

function calculateCarEmissions(transport: EmissionData["transportation"]): number {
  if (transport.carMiles === 0) return 0

  const kmPerMonth = transport.carMiles * 1.60934 * 30 // convert miles to km per month
  const fuelEfficiency = {
    petrol: 15, // km per liter
    diesel: 18,
    electric: 5, // km per kWh
    hybrid: 20,
  }

  const efficiency = fuelEfficiency[transport.carType]
  const fuelConsumed = kmPerMonth / efficiency

  return fuelConsumed * EMISSION_FACTORS.transportation[transport.carType]
}

function calculateTwoWheelerEmissions(kmPerDay: number): number {
  if (kmPerDay === 0) return 0

  const kmPerMonth = kmPerDay * 30
  const fuelEfficiency = 40 // km per liter for average Indian two-wheeler
  const fuelConsumed = kmPerMonth / fuelEfficiency

  return fuelConsumed * EMISSION_FACTORS.transportation.twoWheeler
}

export function generateInsights(result: EmissionResult): string[] {
  const insights = []
  const { breakdown, comparison } = result

  // Identify highest emission category
  const categories = Object.entries(breakdown)
  const highest = categories.reduce((max, current) => (current[1] > max[1] ? current : max))

  if (highest[0] === "transportation") {
    insights.push("🚗 Transportation is your biggest emission source. Consider using public transport or carpooling.")
  } else if (highest[0] === "energy") {
    insights.push("⚡ Energy consumption is your main concern. Switch to LED bulbs and energy-efficient appliances.")
  } else if (highest[0] === "food") {
    insights.push(
      "🥗 Food choices significantly impact your footprint. Try reducing meat consumption by 1-2 meals per week.",
    )
  } else {
    insights.push(
      "🛍️ Lifestyle choices are your main emission driver. Consider buying less and choosing sustainable products.",
    )
  }

  // Comparison insights
  if (result.totalMonthly < comparison.indianAverage * 0.8) {
    insights.push("🌟 Excellent! Your footprint is 20% below the Indian average. You're making a real difference!")
  } else if (result.totalMonthly > comparison.indianAverage * 1.2) {
    insights.push("📈 Your footprint is above the Indian average. Small changes can make a big impact!")
  } else {
    insights.push("📊 You're close to the Indian average. A few tweaks can help you do even better!")
  }

  // Specific actionable tip
  if (breakdown.transportation > 50) {
    insights.push("🚌 Try using public transport for 2 days a week - it could save 20kg CO₂ monthly!")
  } else if (breakdown.energy > 40) {
    insights.push("💡 Switching to solar water heating could reduce your emissions by 15kg CO₂ monthly!")
  } else {
    insights.push("🌱 Small daily actions like using a reusable water bottle can save 5kg CO₂ monthly!")
  }

  return insights
}
