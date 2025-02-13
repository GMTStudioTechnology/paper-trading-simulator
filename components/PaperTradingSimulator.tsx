"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Portfolio } from "./Portfolio"
import { AssetList } from "./AssetList"
import { TradeForm } from "./TradeForm"
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
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Sun, Moon } from "lucide-react"
import { StockTicker } from "./StockTicker"
import { Sidebar } from "./Sidebar"
import { PerformanceChart } from "./PerformanceChart"
import { RiskManagement } from "./RiskManagement"
import { SocialTrading } from "./SocialTrading"

export function PaperTradingSimulator() {
  const { marketData, marketEvents, resetMarketData } = useMarketSimulation()
  const { portfolio, placeOrder, cancelOrder, addToWatchlist, removeFromWatchlist, resetPortfolio } = usePortfolio(
    1000000,
    marketData,
  )
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("dashboard")

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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <MarketOverview marketData={marketData} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <Tabs defaultValue="chart" className="w-full">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="chart">Chart</TabsTrigger>
                      <TabsTrigger value="trade">Trade</TabsTrigger>
                      <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                      <TabsTrigger value="news">News</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chart">
                      {selectedAsset && <PriceChart asset={marketData.find((a) => a.symbol === selectedAsset)!} />}
                    </TabsContent>
                    <TabsContent value="trade">
                      {selectedAsset && (
                        <TradeForm
                          asset={marketData.find((a) => a.symbol === selectedAsset)!}
                          onPlaceOrder={placeOrder}
                          availableCash={portfolio.cash}
                          holdings={portfolio.holdings}
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="orderbook">
                      <OrderBook orders={portfolio.orders} onCancelOrder={cancelOrder} />
                    </TabsContent>
                    <TabsContent value="news">
                      <NewsPanel events={marketEvents} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <AssetList
                  assets={marketData}
                  onSelectAsset={setSelectedAsset}
                  selectedAsset={selectedAsset!}
                  onAddToWatchlist={addToWatchlist}
                />
                <Watchlist
                  watchlist={portfolio.watchlist}
                  marketData={marketData}
                  onRemoveFromWatchlist={removeFromWatchlist}
                />
                <AIAssistant portfolio={portfolio} marketData={marketData} selectedAsset={selectedAsset!} />
              </div>
            </div>
          </>
        )
      case "portfolio":
        return <Portfolio portfolio={portfolio} marketData={marketData} />
      case "performance":
        return <PerformanceChart portfolio={portfolio} marketData={marketData} />
      case "risk":
        return <RiskManagement portfolio={portfolio} marketData={marketData} />
      case "social":
        return <SocialTrading />
      case "transactions":
        return <TransactionHistory transactions={portfolio.transactions} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar portfolio={portfolio} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card shadow-md z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Paper Trading Simulator</h1>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <StockTicker marketData={marketData} />
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">{renderContent()}</div>
        </main>
        <AccountManagement onDeleteAccount={handleDeleteAccount} onRestartGame={handleRestartGame} />
      </div>
    </div>
  )
}

