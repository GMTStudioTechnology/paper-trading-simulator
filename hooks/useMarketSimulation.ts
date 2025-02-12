"use client"

import { useState, useEffect } from "react"

const SECTORS = {
  TECH: ["AAPL", "GOOGL", "MSFT", "AMZN", "NVDA"],
  FINANCE: ["JPM", "BAC", "GS", "V", "MA"],
  HEALTHCARE: ["JNJ", "PFE", "UNH", "ABBV", "MRK"],
  ENERGY: ["XOM", "CVX", "COP", "SLB", "EOG"],
  CONSUMER: ["PG", "KO", "PEP", "WMT", "COST"],
}

const INITIAL_PRICES = {
  AAPL: 150,
  GOOGL: 100,
  MSFT: 100,
  AMZN: 100,
  NVDA: 70,
  JPM: 50,
  BAC: 40,
  GS: 50,
  V: 30,
  MA: 50,
  JNJ: 70,
  PFE: 40,
  UNH: 50,
  ABBV: 110,
  MRK: 80,
  XOM: 60,
  CVX: 10,
  COP: 60,
  SLB: 35,
  EOG: 85,
  PG: 40,
  KO: 55,
  PEP: 50,
  WMT: 40,
  COST: 50,
}

const EVENT_CATEGORIES = {
  TECH: [
    "Product launches",
    "Cybersecurity incidents",
    "Regulatory changes",
    "Innovation breakthroughs",
    "Market disruptions",
  ],
  FINANCE: [
    "Interest rate changes",
    "Regulatory reforms",
    "Merger and acquisitions",
    "Economic indicators",
    "Geopolitical events",
  ],
  HEALTHCARE: [
    "Drug trials",
    "FDA approvals",
    "Healthcare policy changes",
    "Medical breakthroughs",
    "Public health crises",
  ],
  ENERGY: [
    "Oil price fluctuations",
    "Renewable energy advancements",
    "Geopolitical tensions",
    "Environmental regulations",
    "Natural disasters",
  ],
  CONSUMER: [
    "Consumer spending trends",
    "Supply chain disruptions",
    "Brand reputation changes",
    "Product recalls",
    "Shifts in consumer preferences",
  ],
}

interface Asset {
  symbol: string
  name: string
  sector: string
  price: number
  previousPrice: number
  dayChange: number
  dayChangePercentage: number
}

interface MarketEvent {
  sector: string
  category: string
  description: string
  impact: "minor" | "moderate" | "major"
  affectedStocks: string[]
  timestamp: Date
}

function generateStockName(symbol: string): string {
  const words = symbol.split("").map((char) => {
    const names = {
      A: "Advanced",
      B: "Blue",
      C: "Cyber",
      D: "Data",
      E: "Eco",
      F: "Future",
      G: "Global",
      H: "Hyper",
      I: "Innovative",
      J: "Jumbo",
      K: "Kinetic",
      L: "Lunar",
      M: "Mega",
      N: "Nano",
      O: "Omni",
      P: "Precision",
      Q: "Quantum",
      R: "Rapid",
      S: "Smart",
      T: "Tech",
      U: "Ultra",
      V: "Velocity",
      W: "World",
      X: "X-treme",
      Y: "Yield",
      Z: "Zenith",
    }
    return names[char as keyof typeof names] || char
  })
  return words.join(" ") + " Inc."
}

const LOCAL_STORAGE_KEY = "paperTradingSimulator"

const sectorVolatility: Record<keyof typeof SECTORS, number> = {
  TECH: 0.03,
  FINANCE: 0.02,
  HEALTHCARE: 0.015,
  ENERGY: 0.025,
  CONSUMER: 0.01,
}

export function useMarketSimulation() {
  const [marketData, setMarketData] = useState<Asset[]>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (savedData) {
        return JSON.parse(savedData)
      }
    }
    return Object.entries(INITIAL_PRICES).map(([symbol, price]) => ({
      symbol,
      name: generateStockName(symbol),
      sector: Object.entries(SECTORS).find(([, stocks]) => stocks.includes(symbol))![0],
      price,
      previousPrice: price,
      dayChange: 0,
      dayChangePercentage: 0,
    }))
  })
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMarketData((prevData) => {
        const newData = prevData.map((asset) => {
          const volatility = sectorVolatility[asset.sector as keyof typeof SECTORS] || 0.02
          const normalFluctuation = Math.random() * volatility * 2 - volatility
          let newPrice = asset.price * (1 + normalFluctuation)

          // 10% chance of a sector-wide event
          if (Math.random() < 0.1) {
            const eventImpact = Math.random() * 0.1 - 0.05 // -5% to +5%
            const affectedSector = asset.sector
            const category =
              EVENT_CATEGORIES[affectedSector as keyof typeof EVENT_CATEGORIES][Math.floor(Math.random() * 5)]
            const impact: MarketEvent["impact"] =
              Math.abs(eventImpact) < 0.02 ? "minor" : Math.abs(eventImpact) < 0.035 ? "moderate" : "major"

            setMarketEvents((prev) => [
              {
                sector: affectedSector,
                category,
                description: `${impact.charAt(0).toUpperCase() + impact.slice(1)} ${category.toLowerCase()} event in the ${affectedSector} sector`,
                impact,
                affectedStocks: SECTORS[affectedSector as keyof typeof SECTORS],
                timestamp: new Date(),
              },
              ...prev.slice(0, 9), // Keep only the latest 10 events
            ])

            if (SECTORS[affectedSector as keyof typeof SECTORS].includes(asset.symbol)) {
              newPrice *= 1 + eventImpact
            }
          }

          newPrice = Number(newPrice.toFixed(2))
          const dayChange = Number((newPrice - asset.previousPrice).toFixed(2))
          const dayChangePercentage = Number(((dayChange / asset.previousPrice) * 100).toFixed(2))

          return {
            ...asset,
            price: newPrice,
            dayChange,
            dayChangePercentage,
          }
        })

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData))
        return newData
      })
    }, 3000)

    return () => clearInterval(intervalId)
  }, [])

  const resetMarketData = () => {
    const initialData = Object.entries(INITIAL_PRICES).map(([symbol, price]) => ({
      symbol,
      name: generateStockName(symbol),
      sector: Object.entries(SECTORS).find(([, stocks]) => stocks.includes(symbol))![0],
      price,
      previousPrice: price,
      dayChange: 0,
      dayChangePercentage: 0,
    }))
    setMarketData(initialData)
    setMarketEvents([])
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData))
  }

  return { marketData, marketEvents, resetMarketData }
}

