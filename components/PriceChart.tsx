"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Asset {
  symbol: string
  price: number
}

interface PriceChartProps {
  asset: Asset
}

interface ChartData {
  time: string
  price: number
  sma: number | null
  upperBollingerBand: number | null
  lowerBollingerBand: number | null
}

export function PriceChart({ asset }: PriceChartProps) {
  const [priceHistory, setPriceHistory] = useState<ChartData[]>([])
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M">("1D")
  const [indicator, setIndicator] = useState<"none" | "sma" | "bollinger">("none")

  useEffect(() => {
    const updatePriceHistory = () => {
      setPriceHistory((prev) => {
        const newPoint: ChartData = {
          time: new Date().toLocaleTimeString(),
          price: asset.price,
          sma: null,
          upperBollingerBand: null,
          lowerBollingerBand: null,
        }
        const newHistory = [...prev, newPoint].slice(-20) // Keep last 20 points

        // Calculate SMA
        if (indicator === "sma" || indicator === "bollinger") {
          const sma = newHistory.slice(-10).reduce((sum, point) => sum + point.price, 0) / 10
          newPoint.sma = Number(sma.toFixed(2))
        }

        // Calculate Bollinger Bands
        if (indicator === "bollinger") {
          const sma = newPoint.sma!
          const standardDeviation = Math.sqrt(
            newHistory.slice(-10).reduce((sum, point) => sum + Math.pow(point.price - sma, 2), 0) / 10,
          )
          newPoint.upperBollingerBand = Number((sma + standardDeviation * 2).toFixed(2))
          newPoint.lowerBollingerBand = Number((sma - standardDeviation * 2).toFixed(2))
        }

        return newHistory
      })
    }

    updatePriceHistory() // Initial update
    const intervalId = setInterval(updatePriceHistory, 3000)

    return () => clearInterval(intervalId)
  }, [asset.price, indicator])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{asset.symbol} Price Chart</span>
          <div className="flex space-x-2">
            <Select onValueChange={(value) => setTimeframe(value as "1D" | "1W" | "1M")}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setIndicator(value as "none" | "sma" | "bollinger")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Indicator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sma">SMA</SelectItem>
                <SelectItem value="bollinger">Bollinger Bands</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
            {indicator === "sma" && <Line type="monotone" dataKey="sma" stroke="#82ca9d" dot={false} />}
            {indicator === "bollinger" && (
              <>
                <Line type="monotone" dataKey="sma" stroke="#82ca9d" dot={false} />
                <Line type="monotone" dataKey="upperBollingerBand" stroke="#ffc658" dot={false} />
                <Line type="monotone" dataKey="lowerBollingerBand" stroke="#ff7300" dot={false} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

