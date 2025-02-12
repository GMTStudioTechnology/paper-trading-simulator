"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

interface Portfolio {
  cash: number
  holdings: {
    [key: string]: {
      quantity: number
      averagePrice: number
    }
  }
}

interface Asset {
  symbol: string
  price: number
  dayChangePercentage: number
}

interface AIAssistantProps {
  portfolio: Portfolio
  marketData: Asset[]
  selectedAsset: string
}

export function AIAssistant({ portfolio, marketData, selectedAsset }: AIAssistantProps) {
  const [advice, setAdvice] = useState<string | null>(null)

  const generateAdvice = () => {
    const asset = marketData.find((a) => a.symbol === selectedAsset)
    if (!asset) return

    const holding = portfolio.holdings[selectedAsset]
    const averagePrice = holding?.averagePrice || 0
    const quantity = holding?.quantity || 0

    let newAdvice = ""

    if (asset.dayChangePercentage > 5) {
      newAdvice = `${asset.symbol} has seen a significant increase today. Consider taking some profits if you're holding.`
    } else if (asset.dayChangePercentage < -5) {
      newAdvice = `${asset.symbol} has dropped considerably. This might be a buying opportunity if you believe in the company's long-term prospects.`
    } else if (quantity > 0 && asset.price < averagePrice * 0.9) {
      newAdvice = `Your position in ${asset.symbol} is currently at a loss. Consider averaging down if you're still bullish on the stock.`
    } else if (quantity > 0 && asset.price > averagePrice * 1.2) {
      newAdvice = `Your position in ${asset.symbol} has gained over 20%. It might be a good time to reassess your position and potentially take some profits.`
    } else {
      newAdvice = `${asset.symbol} is relatively stable today. Keep monitoring the market for any significant changes.`
    }

    setAdvice(newAdvice)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={generateAdvice} className="w-full mb-4">
          Get Advice for {selectedAsset}
        </Button>
        {advice && (
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm">{advice}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

