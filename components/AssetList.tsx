"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, TrendingDown, TrendingUp, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAssets = assets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle>Asset Prices</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4">
            <div className="grid grid-cols-1 gap-2">
              {filteredAssets.map((asset) => (
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
                      className={`text-xs flex items-center ${
                        asset.dayChange >= 0 ? "text-green-500" : "text-red-500"
                      }`}
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

