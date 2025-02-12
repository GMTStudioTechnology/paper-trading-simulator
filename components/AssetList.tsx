"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, TrendingDown, TrendingUp } from "lucide-react"

interface Asset {
  symbol: string
  name: string
  price: number
  previousPrice: number
  dayChange: number
  dayChangePercentage: number
}

interface AssetListProps {
  assets: Asset[]
  onSelectAsset: (symbol: string) => void
  selectedAsset: string
  onAddToWatchlist: (symbol: string) => void
}

export function AssetList({ assets, onSelectAsset, selectedAsset, onAddToWatchlist }: AssetListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {assets.map((asset) => (
            <div
              key={asset.symbol}
              onClick={() => onSelectAsset(asset.symbol)}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                asset.symbol === selectedAsset ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{asset.symbol}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">{asset.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-medium">${asset.price.toFixed(2)}</span>
                <span
                  className={`text-xs flex items-center ${asset.dayChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {asset.dayChange >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {asset.dayChangePercentage.toFixed(2)}%
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToWatchlist(asset.symbol)
                }}
                className="ml-2"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

