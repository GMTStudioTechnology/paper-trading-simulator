"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface TradeFormProps {
  asset: Asset
  onPlaceOrder: (
    asset: string,
    type: "market" | "limit" | "stop",
    action: "buy" | "sell",
    quantity: number,
    price?: number,
  ) => void
  availableCash: number
  holdings: Holdings
}

export function TradeForm({ asset, onPlaceOrder, availableCash, holdings }: TradeFormProps) {
  const [quantity, setQuantity] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market")
  const [limitPrice, setLimitPrice] = useState("")

  const handleTrade = (action: "buy" | "sell") => {
    const quantityNum = Number(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert("Please enter a valid quantity")
      return
    }

    if (orderType !== "market" && (isNaN(Number(limitPrice)) || Number(limitPrice) <= 0)) {
      alert("Please enter a valid limit price")
      return
    }

    onPlaceOrder(asset.symbol, orderType, action, quantityNum, orderType !== "market" ? Number(limitPrice) : undefined)
    setQuantity("")
    setLimitPrice("")
  }

  const maxBuyQuantity = Math.floor(availableCash / asset.price)
  const maxSellQuantity = holdings[asset.symbol]?.quantity || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade {asset.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              min="1"
            />
            <Select onValueChange={(value) => setOrderType(value as "market" | "limit" | "stop")}>
              <SelectTrigger>
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {orderType !== "market" && (
            <Input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder={`${orderType.charAt(0).toUpperCase() + orderType.slice(1)} Price`}
              min="0.01"
              step="0.01"
            />
          )}
          <div className="flex justify-between">
            <Button onClick={() => handleTrade("buy")} disabled={Number(quantity) > maxBuyQuantity}>
              Buy
            </Button>
            <Button
              onClick={() => handleTrade("sell")}
              variant="secondary"
              disabled={Number(quantity) > maxSellQuantity}
            >
              Sell
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Max Buy: {maxBuyQuantity} | Max Sell: {maxSellQuantity}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

