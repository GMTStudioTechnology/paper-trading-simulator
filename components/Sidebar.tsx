"use client"

import { Home, BarChart2, TrendingUp, AlertTriangle, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Portfolio {
  cash: number
}

interface SidebarProps {
  portfolio: Portfolio
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ portfolio, activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="bg-card w-64 h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Account Balance</h2>
        <p className="text-2xl font-semibold">${portfolio.cash.toFixed(2)}</p>
      </div>
      <nav className="space-y-2 flex-1">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("dashboard")}
        >
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === "portfolio" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("portfolio")}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Portfolio
        </Button>
        <Button
          variant={activeTab === "performance" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("performance")}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Performance
        </Button>
        <Button
          variant={activeTab === "risk" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("risk")}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Risk Management
        </Button>
        <Button
          variant={activeTab === "social" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("social")}
        >
          <Users className="mr-2 h-4 w-4" />
          Social Trading
        </Button>
        <Button
          variant={activeTab === "transactions" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("transactions")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Transactions
        </Button>
      </nav>
    </div>
  )
}

