"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
    type: "market" | "limit" | "stop" | "stop-limit",
    action: "buy" | "sell",
    quantity: number,
    price?: number,
    stopPrice?: number,
  ) => void
  availableCash: number
  holdings: Holdings
}

export function TradeForm({ asset, onPlaceOrder, availableCash, holdings }: TradeFormProps) {
  const [quantity, setQuantity] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop" | "stop-limit">("market")
  const [action, setAction] = useState<"buy" | "sell">("buy")
  const [limitPrice, setLimitPrice] = useState("")
  const [stopPrice, setStopPrice] = useState("")
  const [isAdvancedOrder, setIsAdvancedOrder] = useState(false)

  const handleTrade = () => {
    const quantityNum = Number(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert("Please enter a valid quantity")
      return
    }

    if (orderType !== "market" && (isNaN(Number(limitPrice)) || Number(limitPrice) <= 0)) {
      alert("Please enter a valid limit price")
      return
    }

    if ((orderType === "stop" || orderType === "stop-limit") && (isNaN(Number(stopPrice)) || Number(stopPrice) <= 0)) {
      alert("Please enter a valid stop price")
      return
    }

    onPlaceOrder(
      asset.symbol,
      orderType,
      action,
      quantityNum,
      orderType !== "market" ? Number(limitPrice) : undefined,
      orderType === "stop" || orderType === "stop-limit" ? Number(stopPrice) : undefined,
    )
    setQuantity("")
    setLimitPrice("")
    setStopPrice("")
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
            <Select onValueChange={(value) => setOrderType(value as "market" | "limit" | "stop" | "stop-limit")}>
              <SelectTrigger>
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
                <SelectItem value="stop-limit">Stop Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {orderType !== "market" && (
            <Input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="Limit Price"
              min="0.01"
              step="0.01"
            />
          )}
          {(orderType === "stop" || orderType === "stop-limit") && (
            <Input
              type="number"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              placeholder="Stop Price"
              min="0.01"
              step="0.01"
            />
          )}
          <div className="flex items-center space-x-2">
            <Switch id="advanced-order" checked={isAdvancedOrder} onCheckedChange={setIsAdvancedOrder} />
            <Label htmlFor="advanced-order">Advanced Order Options</Label>
          </div>
          {isAdvancedOrder && (
            <div className="space-y-2">
              <Select onValueChange={(value) => setAction(value as "buy" | "sell")}>
                <SelectTrigger>
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex justify-between">
            <Button
              onClick={handleTrade}
              disabled={Number(quantity) > (action === "buy" ? maxBuyQuantity : maxSellQuantity)}
            >
              Place Order
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

