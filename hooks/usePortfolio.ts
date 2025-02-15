"use client"

import { useState, useEffect } from "react"

interface Asset {
  symbol: string
  price: number
}

interface Holdings {
  [key: string]: {
    quantity: number
    averagePrice: number
  }
}

interface Order {
  id: string
  asset: string
  type: "market" | "limit" | "stop" | "stop-limit"
  action: "buy" | "sell"
  quantity: number
  price: number
  stopPrice: number
  status: "pending" | "executed" | "cancelled"
  timestamp: Date
}

interface Transaction {
  orderId: string
  asset: string
  type: "buy" | "sell"
  quantity: number
  price: number
  timestamp: Date
}

interface WatchlistItem {
  symbol: string
  addedAt: Date
}

interface Portfolio {
  cash: number
  holdings: Holdings
  orders: Order[]
  transactions: Transaction[]
  watchlist: WatchlistItem[]
}

const PORTFOLIO_STORAGE_KEY = "paperTradingSimulatorPortfolio"

export function usePortfolio(initialCash: number, marketData: Asset[]) {
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    if (typeof window !== "undefined") {
      const savedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY)
      if (savedPortfolio) {
        return JSON.parse(savedPortfolio)
      }
    }
    return {
      cash: initialCash,
      holdings: {},
      orders: [],
      transactions: [],
      watchlist: [],
    }
  })

  useEffect(() => {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio))
  }, [portfolio])

  const placeOrder = (
    asset: string,
    type: "market" | "limit" | "stop" | "stop-limit",
    action: "buy" | "sell",
    quantity: number,
    price?: number,
    stopPrice?: number,
  ) => {
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      asset,
      type,
      action,
      quantity,
      price: price || 0,
      stopPrice: stopPrice || 0,
      status: type === "market" ? "executed" : "pending",
      timestamp: new Date(),
    }

    setPortfolio((prevPortfolio) => ({
      ...prevPortfolio,
      orders: [...prevPortfolio.orders, order],
    }))

    if (type === "market") {
      executeOrder(order)
    }
  }

  const executeOrder = (order: Order) => {
    const assetData = marketData.find((a) => a.symbol === order.asset)
    if (!assetData) return

    const executionPrice = order.type === "market" ? assetData.price : order.price
    const totalCost = executionPrice * order.quantity

    setPortfolio((prevPortfolio) => {
      if (order.action === "buy" && prevPortfolio.cash < totalCost) {
        return prevPortfolio // Insufficient funds
      }

      if (
        order.action === "sell" &&
        (!prevPortfolio.holdings[order.asset] || prevPortfolio.holdings[order.asset].quantity < order.quantity)
      ) {
        return prevPortfolio // Insufficient holdings
      }

      const newCash = order.action === "buy" ? prevPortfolio.cash - totalCost : prevPortfolio.cash + totalCost

      const newHoldings = { ...prevPortfolio.holdings }
      if (order.action === "buy") {
        if (!newHoldings[order.asset]) {
          newHoldings[order.asset] = { quantity: 0, averagePrice: 0 }
        }
        const totalValue = newHoldings[order.asset].quantity * newHoldings[order.asset].averagePrice + totalCost
        newHoldings[order.asset].quantity += order.quantity
        newHoldings[order.asset].averagePrice = totalValue / newHoldings[order.asset].quantity
      } else {
        newHoldings[order.asset].quantity -= order.quantity
        if (newHoldings[order.asset].quantity === 0) {
          delete newHoldings[order.asset]
        }
      }

      const newTransaction: Transaction = {
        orderId: order.id,
        asset: order.asset,
        type: order.action,
        quantity: order.quantity,
        price: executionPrice,
        timestamp: new Date(),
      }

      return {
        ...prevPortfolio,
        cash: Number(newCash.toFixed(2)),
        holdings: newHoldings,
        transactions: [newTransaction, ...prevPortfolio.transactions],
        orders: prevPortfolio.orders.map((o) => (o.id === order.id ? { ...o, status: "executed" } : o)),
      }
    })
  }

  const cancelOrder = (orderId: string) => {
    setPortfolio((prevPortfolio) => ({
      ...prevPortfolio,
      orders: prevPortfolio.orders.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
    }))
  }

  const addToWatchlist = (symbol: string) => {
    setPortfolio((prevPortfolio) => ({
      ...prevPortfolio,
      watchlist: [...prevPortfolio.watchlist, { symbol, addedAt: new Date() }],
    }))
  }

  const removeFromWatchlist = (symbol: string) => {
    setPortfolio((prevPortfolio) => ({
      ...prevPortfolio,
      watchlist: prevPortfolio.watchlist.filter((item) => item.symbol !== symbol),
    }))
  }

  useEffect(() => {
    // Check and execute pending limit and stop orders
    portfolio.orders.forEach((order) => {
      if (order.status === "pending") {
        const assetData = marketData.find((a) => a.symbol === order.asset)
        if (assetData) {
          if (
            (order.type === "limit" && order.action === "buy" && assetData.price <= order.price) ||
            (order.type === "limit" && order.action === "sell" && assetData.price >= order.price) ||
            (order.type === "stop" && order.action === "sell" && assetData.price <= order.price) ||
            (order.type === "stop" && order.action === "buy" && assetData.price >= order.price) ||
            (order.type === "stop-limit" &&
              order.action === "buy" &&
              assetData.price >= order.stopPrice &&
              assetData.price <= order.price) ||
            (order.type === "stop-limit" &&
              order.action === "sell" &&
              assetData.price <= order.stopPrice &&
              assetData.price >= order.price)
          ) {
            executeOrder(order)
          }
        }
      }
    })
  }, [marketData, portfolio.orders, executeOrder]) // Added executeOrder to dependencies

  const resetPortfolio = () => {
    setPortfolio({
      cash: initialCash,
      holdings: {},
      orders: [],
      transactions: [],
      watchlist: [],
    })
  }

  return {
    portfolio,
    placeOrder,
    cancelOrder,
    addToWatchlist,
    removeFromWatchlist,
    resetPortfolio,
  }
}

