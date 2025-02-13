"use client"

import { useRef, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Asset {
  symbol: string
  price: number
  dayChangePercentage: number
}

interface StockTickerProps {
  marketData: Asset[]
}

export function StockTicker({ marketData }: StockTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      const animateScroll = () => {
        if (scrollElement.scrollLeft >= scrollElement.scrollWidth / 2) {
          scrollElement.scrollLeft = 0
        } else {
          scrollElement.scrollLeft += 1
        }
      }
      const animation = setInterval(animateScroll, 30)
      return () => clearInterval(animation)
    }
  }, [])

  return (
    <div className="bg-secondary overflow-hidden whitespace-nowrap py-2">
      <div ref={scrollRef} className="inline-block animate-marquee">
        {[...marketData, ...marketData].map((asset, index) => (
          <span key={index} className="inline-flex items-center mx-4">
            <span className="font-semibold">{asset.symbol}</span>
            <span className="ml-2">${asset.price.toFixed(2)}</span>
            <span
              className={`ml-2 flex items-center ${asset.dayChangePercentage >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {asset.dayChangePercentage >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {asset.dayChangePercentage.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

