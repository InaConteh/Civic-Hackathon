"use client"

import { useState } from "react"
import { Gift, Trophy, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RewardCard } from "@/components/rewards/reward-card"
import { getRewards } from "@/lib/store"
import { mockSponsors } from "@/lib/mock-data"

export default function RewardsPage() {
  const [tierFilter, setTierFilter] = useState("all")
  const rewards = getRewards()

  const filteredRewards = rewards.filter((r) => tierFilter === "all" || r.tier === tierFilter)

  const rewardTypes = [
    {
      type: "solar-streetlight",
      title: "Solar Streetlights",
      description: "Green energy lighting for your neighborhood",
    },
    { type: "trash-bins", title: "Trash Bins", description: "Additional waste collection infrastructure" },
    { type: "cleanup-tools", title: "Cleanup Tools", description: "Professional cleanup equipment" },
    { type: "certificate", title: "Certificates", description: "Official recognition of achievement" },
    { type: "sponsor-incentive", title: "Sponsor Incentives", description: "Exclusive offers from our partners" },
  ]

  return (
    <div className="container space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Rewards</h1>
        <p className="text-muted-foreground">Earn prizes for your cleanup efforts</p>
      </div>

      <Tabs defaultValue="earned">
        <TabsList>
          <TabsTrigger value="earned">Earned Rewards</TabsTrigger>
          <TabsTrigger value="available">Available Prizes</TabsTrigger>
          <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filteredRewards.length} rewards earned</p>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-32">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredRewards.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <Gift className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No rewards earned yet</p>
              <p className="text-sm text-muted-foreground">Keep cleaning to earn rewards!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rewardTypes.map((reward, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    {reward.title}
                  </CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600">
                      Gold: 1st
                    </span>
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                      Silver: 2nd
                    </span>
                    <span className="rounded-full bg-amber-600/10 px-3 py-1 text-xs font-medium text-amber-700">
                      Bronze: 3rd
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sponsors" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockSponsors.map((sponsor) => (
              <Card key={sponsor.id}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <img
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={sponsor.name}
                    className="mb-4 h-16 w-auto object-contain"
                  />
                  <h3 className="font-semibold">{sponsor.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{sponsor.rewardDescription}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
