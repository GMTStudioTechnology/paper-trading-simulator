"use client"

import { useState, useEffect } from "react"
import { Portfolio } from "./Portfolio"
import { AssetList } from "./AssetList"
import { TradeForm } from "./TradeForm"
import { MarketEvents } from "./MarketEvents"
import { TransactionHistory } from "./TransactionHistory"
import { PriceChart } from "./PriceChart"
import { Watchlist } from "./Watchlist"
import { OrderBook } from "./OrderBook"
import { NewsPanel } from "./NewsPanel"
import { AIAssistant } from "./AIAssistant"
import { useMarketSimulation } from "../hooks/useMarketSimulation"
import { usePortfolio } from "../hooks/usePortfolio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PaperTradingSimulator() {
  const { marketData, marketEvents } = useMarketSimulation()
  const { portfolio, placeOrder, cancelOrder, addToWatchlist, removeFromWatchlist } = usePortfolio(1000000, marketData)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (marketData.length > 0 && !selectedAsset) {
      setSelectedAsset(marketData[0].symbol)
      setIsLoading(false)
    }
  }, [marketData, selectedAsset])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Paper Trading Simulator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="market" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="market" className="flex-1">
                Market
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex-1">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1">
                Orders
              </TabsTrigger>
            </TabsList>
            <TabsContent value="market">
              <AssetList
                assets={marketData}
                onSelectAsset={setSelectedAsset}
                selectedAsset={selectedAsset!}
                onAddToWatchlist={addToWatchlist}
              />
            </TabsContent>
            <TabsContent value="portfolio">
              <Portfolio portfolio={portfolio} marketData={marketData} />
            </TabsContent>
            <TabsContent value="orders">
              <OrderBook orders={portfolio.orders} onCancelOrder={cancelOrder} />
            </TabsContent>
          </Tabs>
          {selectedAsset && (
            <>
              <PriceChart asset={marketData.find((a) => a.symbol === selectedAsset)!} />
              <TradeForm
                asset={marketData.find((a) => a.symbol === selectedAsset)!}
                onPlaceOrder={placeOrder}
                availableCash={portfolio.cash}
                holdings={portfolio.holdings}
              />
            </>
          )}
        </div>
        <div className="space-y-4">
          <Watchlist
            watchlist={portfolio.watchlist}
            marketData={marketData}
            onRemoveFromWatchlist={removeFromWatchlist}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <MarketEvents events={marketEvents} />
            <NewsPanel events={marketEvents} />
          </div>
          {selectedAsset && <AIAssistant portfolio={portfolio} marketData={marketData} selectedAsset={selectedAsset} />}
        </div>
      </div>
      <TransactionHistory transactions={portfolio.transactions} />
    </div>
  )
}

