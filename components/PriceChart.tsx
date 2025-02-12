"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Asset {
  symbol: string
  price: number
}

interface PriceChartProps {
  asset: Asset
}

export function PriceChart({ asset }: PriceChartProps) {
  const [priceHistory, setPriceHistory] = useState<{ time: string; price: number }[]>([])

  useEffect(() => {
    const updatePriceHistory = () => {
      setPriceHistory((prev) => {
        const newPoint = { time: new Date().toLocaleTimeString(), price: asset.price }
        const newHistory = [...prev, newPoint].slice(-20) // Keep last 20 points
        return newHistory
      })
    }

    updatePriceHistory() // Initial update
    const intervalId = setInterval(updatePriceHistory, 3000)

    return () => clearInterval(intervalId)
  }, [asset.price])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{asset.symbol} Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                border: "none",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

