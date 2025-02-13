"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MarketEvent {
  sector: string
  category: string
  description: string
  impact: "minor" | "moderate" | "major"
  affectedStocks: string[]
  timestamp: Date
}

interface NewsPanelProps {
  events: MarketEvent[]
}

export function NewsPanel({ events }: NewsPanelProps) {
  const generateNewsHeadline = (event: MarketEvent) => {
    const headlines = [
      `${event.sector} Sector: ${event.category} Impacts Market`,
      `Breaking: ${event.description}`,
      `${event.impact.charAt(0).toUpperCase() + event.impact.slice(1)} Event in ${event.sector} Sector`,
      `Market Alert: ${event.category} Affects ${event.affectedStocks.length} Stocks`,
      `${event.sector} Stocks React to ${event.category}`,
    ]
    return headlines[Math.floor(Math.random() * headlines.length)]
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4">
            <ul className="space-y-2">
              {events.map((event, index) => (
                <li key={index} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{generateNewsHeadline(event)}</p>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.timestamp.toLocaleTimeString()} | Impact: {event.impact}
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

