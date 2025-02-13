"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Transaction {
  orderId: string
  asset: string
  type: "buy" | "sell"
  quantity: number
  price: number
  timestamp: Date
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4">
            <ul className="space-y-2">
              {transactions.map((transaction, index) => (
                <li key={index} className="border-b pb-2 last:border-b-0">
                  <p>
                    <span className={transaction.type === "buy" ? "text-green-500" : "text-red-500"}>
                      {transaction.type.toUpperCase()}
                    </span>{" "}
                    {transaction.quantity} {transaction.asset} @ ${transaction.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total: ${(transaction.quantity * transaction.price).toFixed(2)} |{" "}
                    {transaction.timestamp.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

