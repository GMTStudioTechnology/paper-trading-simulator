"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WatchlistItem {
  symbol: string
  addedAt: Date
}

interface Asset {
  symbol: string
  price: number
  dayChangePercentage: number
}

interface WatchlistProps {
  watchlist: WatchlistItem[]
  marketData: Asset[]
  onRemoveFromWatchlist: (symbol: string) => void
}

export function Watchlist({ watchlist, marketData, onRemoveFromWatchlist }: WatchlistProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4">
            <ul className="space-y-2">
              {watchlist.map((item) => {
                const asset = marketData.find((a) => a.symbol === item.symbol)
                return asset ? (
                  <li key={item.symbol} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{asset.symbol}</span>
                      <span className="ml-2">${asset.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`mr-2 ${asset.dayChangePercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {asset.dayChangePercentage >= 0 ? "+" : ""}
                        {asset.dayChangePercentage.toFixed(2)}%
                      </span>
                      <Button size="icon" variant="ghost" onClick={() => onRemoveFromWatchlist(item.symbol)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ) : null
              })}
            </ul>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

