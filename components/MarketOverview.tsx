"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Asset {
  symbol: string
  price: number
  dayChangePercentage: number
}

interface MarketOverviewProps {
  marketData: Asset[]
}

export function MarketOverview({ marketData }: MarketOverviewProps) {
  const marketIndex = marketData.reduce((sum, asset) => sum + asset.price, 0) / marketData.length
  const marketChangePercentage =
    marketData.reduce((sum, asset) => sum + asset.dayChangePercentage, 0) / marketData.length

  const topGainers = [...marketData].sort((a, b) => b.dayChangePercentage - a.dayChangePercentage).slice(0, 3)
  const topLosers = [...marketData].sort((a, b) => a.dayChangePercentage - b.dayChangePercentage).slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Market Index</h3>
            <p className="text-2xl font-bold">{marketIndex.toFixed(2)}</p>
            <p
              className={`flex items-center justify-center ${marketChangePercentage >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {marketChangePercentage >= 0 ? <TrendingUp className="mr-1" /> : <TrendingDown className="mr-1" />}
              {marketChangePercentage.toFixed(2)}%
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Top Gainers</h3>
            <ul>
              {topGainers.map((asset) => (
                <li key={asset.symbol} className="flex justify-between items-center">
                  <span>{asset.symbol}</span>
                  <span className="text-green-500">+{asset.dayChangePercentage.toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Top Losers</h3>
            <ul>
              {topLosers.map((asset) => (
                <li key={asset.symbol} className="flex justify-between items-center">
                  <span>{asset.symbol}</span>
                  <span className="text-red-500">{asset.dayChangePercentage.toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

