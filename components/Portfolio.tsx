"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Holdings {
  [key: string]: {
    quantity: number
    averagePrice: number
  }
}

interface Asset {
  symbol: string
  price: number
}

interface PortfolioProps {
  portfolio: {
    cash: number
    holdings: Holdings
  }
  marketData: Asset[]
}

export function Portfolio({ portfolio, marketData }: PortfolioProps) {
  const totalValue = Object.entries(portfolio.holdings).reduce((total, [symbol, holding]) => {
    const asset = marketData.find((a) => a.symbol === symbol)
    return total + (asset ? asset.price * holding.quantity : 0)
  }, portfolio.cash)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-2xl font-bold">Total Value: ${totalValue.toFixed(2)}</p>
          <p className="text-xl">Cash: ${portfolio.cash.toFixed(2)}</p>
          <h3 className="text-xl font-semibold mt-4">Holdings:</h3>
          <ul className="space-y-2">
            {Object.entries(portfolio.holdings).map(([symbol, holding]) => {
              const asset = marketData.find((a) => a.symbol === symbol)
              const currentValue = asset ? asset.price * holding.quantity : 0
              const profitLoss = currentValue - holding.averagePrice * holding.quantity
              const profitLossPercentage = (profitLoss / (holding.averagePrice * holding.quantity)) * 100

              return (
                <li key={symbol} className="flex justify-between items-center">
                  <span>
                    {symbol}: {holding.quantity} shares
                  </span>
                  <span className={`${profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                    ${profitLoss.toFixed(2)} ({profitLossPercentage.toFixed(2)}%)
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

