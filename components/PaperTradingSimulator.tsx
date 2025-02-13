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
import { AccountManagement } from "./AccountManagement"
import { MarketOverview } from "./MarketOverview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"

export function PaperTradingSimulator() {
  const { marketData, marketEvents, resetMarketData } = useMarketSimulation()
  const { portfolio, placeOrder, cancelOrder, addToWatchlist, removeFromWatchlist, resetPortfolio } = usePortfolio(
    1000000,
    marketData,
  )
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

  const handleDeleteAccount = () => {
    resetPortfolio()
    resetMarketData()
    localStorage.clear()
  }

  const handleRestartGame = () => {
    resetPortfolio()
    resetMarketData()
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Paper Trading Simulator</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <MarketOverview marketData={marketData} />
          <Card>
            <CardHeader>
              <CardTitle>Trading Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <TabsTrigger value="watchlist" className="flex-1">
                    Watchlist
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
                <TabsContent value="watchlist">
                  <Watchlist
                    watchlist={portfolio.watchlist}
                    marketData={marketData}
                    onRemoveFromWatchlist={removeFromWatchlist}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          {selectedAsset && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedAsset} Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PriceChart asset={marketData.find((a) => a.symbol === selectedAsset)!} />
                <TradeForm
                  asset={marketData.find((a) => a.symbol === selectedAsset)!}
                  onPlaceOrder={placeOrder}
                  availableCash={portfolio.cash}
                  holdings={portfolio.holdings}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Events</CardTitle>
            </CardHeader>
            <CardContent>
              <MarketEvents events={marketEvents} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>News</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsPanel events={marketEvents} />
            </CardContent>
          </Card>
          {selectedAsset && (
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <AIAssistant portfolio={portfolio} marketData={marketData} selectedAsset={selectedAsset} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionHistory transactions={portfolio.transactions} />
        </CardContent>
      </Card>
      <AccountManagement onDeleteAccount={handleDeleteAccount} onRestartGame={handleRestartGame} />
    </div>
  )
}

