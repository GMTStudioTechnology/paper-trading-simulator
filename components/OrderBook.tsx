"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  asset: string
  type: "market" | "limit" | "stop"
  action: "buy" | "sell"
  quantity: number
  price: number
  status: "pending" | "executed" | "cancelled"
  timestamp: Date
}

interface OrderBookProps {
  orders: Order[]
  onCancelOrder: (orderId: string) => void
}

export function OrderBook({ orders, onCancelOrder }: OrderBookProps) {
  const pendingOrders = orders.filter((order) => order.status === "pending")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingOrders.length === 0 ? (
          <p>No pending orders</p>
        ) : (
          <ul className="space-y-2">
            {pendingOrders.map((order) => (
              <li key={order.id} className="flex justify-between items-center">
                <div>
                  <span className={order.action === "buy" ? "text-green-500" : "text-red-500"}>
                    {order.action.toUpperCase()}
                  </span>{" "}
                  {order.quantity} {order.asset} @ ${order.price.toFixed(2)} ({order.type})
                </div>
                <Button size="sm" variant="destructive" onClick={() => onCancelOrder(order.id)}>
                  Cancel
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

