"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MarketEvent {
  sector: string
  category: string
  description: string
  impact: "minor" | "moderate" | "major"
  affectedStocks: string[]
  timestamp: Date
}

interface MarketEventsProps {
  events: MarketEvent[]
}

export function MarketEvents({ events }: MarketEventsProps) {
  return (
    <Card className="h-[300px] flex flex-col">
      <CardHeader>
        <CardTitle>Market Events</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <ul className="space-y-2">
          {events.map((event, index) => (
            <li key={index} className="border-b pb-2 last:border-b-0">
              <p className="font-semibold">
                {event.sector}: {event.category}
              </p>
              <p className="text-sm">{event.description}</p>
              <p className="text-xs text-muted-foreground">
                Impact:{" "}
                <span
                  className={`font-bold ${
                    event.impact === "minor"
                      ? "text-yellow-500"
                      : event.impact === "moderate"
                        ? "text-orange-500"
                        : "text-red-500"
                  }`}
                >
                  {event.impact}
                </span>{" "}
                | {event.timestamp.toLocaleTimeString()}
              </p>
              <p className="text-xs text-muted-foreground">Affected stocks: {event.affectedStocks.join(", ")}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

