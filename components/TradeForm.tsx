"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

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
  const [percentOfCash, setPercentOfCash] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (action === "buy") {
      const maxBuyQuantity = Math.floor(availableCash / asset.price)
      setQuantity(Math.floor((maxBuyQuantity * percentOfCash) / 100).toString())
    } else {
      const maxSellQuantity = holdings[asset.symbol]?.quantity || 0
      setQuantity(Math.floor((maxSellQuantity * percentOfCash) / 100).toString())
    }
  }, [percentOfCash, action, asset.price, availableCash, holdings, asset.symbol]) // Added asset.symbol to dependencies

  const handleTrade = () => {
    const quantityNum = Number(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    if (orderType !== "market" && (isNaN(Number(limitPrice)) || Number(limitPrice) <= 0)) {
      toast({
        title: "Invalid limit price",
        description: "Please enter a valid limit price",
        variant: "destructive",
      })
      return
    }

    if ((orderType === "stop" || orderType === "stop-limit") && (isNaN(Number(stopPrice)) || Number(stopPrice) <= 0)) {
      toast({
        title: "Invalid stop price",
        description: "Please enter a valid stop price",
        variant: "destructive",
      })
      return
    }

    const totalCost = quantityNum * asset.price
    if (action === "buy" && totalCost > availableCash) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough cash to place this order",
        variant: "destructive",
      })
      return
    }

    if (action === "sell" && quantityNum > (holdings[asset.symbol]?.quantity || 0)) {
      toast({
        title: "Insufficient holdings",
        description: "You don't have enough shares to sell",
        variant: "destructive",
      })
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

    toast({
      title: "Order placed",
      description: `Successfully placed a ${action} order for ${quantityNum} shares of ${asset.symbol}`,
    })

    setQuantity("")
    setLimitPrice("")
    setStopPrice("")
    setPercentOfCash(0)
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
          <div className="flex items-center space-x-4">
            <Button
              variant={action === "buy" ? "default" : "outline"}
              onClick={() => setAction("buy")}
              className="flex-1"
            >
              Buy
            </Button>
            <Button
              variant={action === "sell" ? "default" : "outline"}
              onClick={() => setAction("sell")}
              className="flex-1"
            >
              Sell
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Quantity ({action === "buy" ? "Max: " + maxBuyQuantity : "Max: " + maxSellQuantity})</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label>Percentage of {action === "buy" ? "Cash" : "Holdings"}</Label>
            <Slider value={[percentOfCash]} onValueChange={(value) => setPercentOfCash(value[0])} max={100} step={1} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Order Type</Label>
            <Select onValueChange={(value) => setOrderType(value as "market" | "limit" | "stop" | "stop-limit")}>
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
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
            <div className="space-y-2">
              <Label>Limit Price</Label>
              <Input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="Enter limit price"
                min="0.01"
                step="0.01"
              />
            </div>
          )}
          {(orderType === "stop" || orderType === "stop-limit") && (
            <div className="space-y-2">
              <Label>Stop Price</Label>
              <Input
                type="number"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder="Enter stop price"
                min="0.01"
                step="0.01"
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Switch id="advanced-order" checked={isAdvancedOrder} onCheckedChange={setIsAdvancedOrder} />
            <Label htmlFor="advanced-order">Advanced Order Options</Label>
          </div>
          {isAdvancedOrder && <div className="space-y-2">{/* Add advanced order options here */}</div>}
          <Button onClick={handleTrade} className="w-full">
            Place {action.charAt(0).toUpperCase() + action.slice(1)} Order
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

