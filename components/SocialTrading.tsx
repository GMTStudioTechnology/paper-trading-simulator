"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Trader {
  id: string
  name: string
  avatar: string
  performance: number
  followers: number
}

const mockTraders: Trader[] = [
  { id: "1", name: "GMTStudio", avatar: "/avatars/GMTStudio.jpg", performance: 15.2, followers: 1200 },
  { id: "2", name: "Unknown", avatar: "/avatars/bob.jpg", performance: 12.8, followers: 980 },
  { id: "3", name: "Unknown", avatar: "/avatars/charlie.jpg", performance: 18.5, followers: 1500 },
  { id: "4", name: "Unknown", avatar: "/avatars/diana.jpg", performance: 10.1, followers: 750 },
]

export function SocialTrading() {
  const [followedTraders, setFollowedTraders] = useState<string[]>([])

  const toggleFollow = (traderId: string) => {
    setFollowedTraders((prev) => (prev.includes(traderId) ? prev.filter((id) => id !== traderId) : [...prev, traderId]))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Trading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockTraders.map((trader) => (
            <Card key={trader.id}>
              <CardContent className="p-4 flex flex-col items-center">
                <Avatar className="w-16 h-16 mb-2">
                  <AvatarImage src={trader.avatar} alt={trader.name} />
                  <AvatarFallback>
                    {trader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">{trader.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">Performance: {trader.performance.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mb-4">Followers: {trader.followers}</p>
                <Button
                  variant={followedTraders.includes(trader.id) ? "secondary" : "default"}
                  onClick={() => toggleFollow(trader.id)}
                >
                  {followedTraders.includes(trader.id) ? "Unfollow" : "Follow"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

