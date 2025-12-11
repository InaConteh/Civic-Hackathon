"use client"

import { Sun, Trash2, Wrench, Award, Gift, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Reward } from "@/types"

const rewardIcons: Record<string, typeof Sun> = {
  "solar-streetlight": Sun,
  "trash-bins": Trash2,
  "cleanup-tools": Wrench,
  certificate: Award,
  "sponsor-incentive": Gift,
}

const tierColors = {
  gold: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  silver: "bg-gray-200 text-gray-600 border-gray-400/30",
  bronze: "bg-amber-600/10 text-amber-700 border-amber-600/30",
}

const tierBgGradients = {
  gold: "from-yellow-500/5 to-yellow-500/0",
  silver: "from-gray-400/5 to-gray-400/0",
  bronze: "from-amber-600/5 to-amber-600/0",
}

export function RewardCard({ reward }: { reward: Reward }) {
  const Icon = rewardIcons[reward.type] || Gift

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  return (
    <Card className={`overflow-hidden bg-gradient-to-br ${tierBgGradients[reward.tier]}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tierColors[reward.tier]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge className={tierColors[reward.tier]}>
            {reward.tier.charAt(0).toUpperCase() + reward.tier.slice(1)}
          </Badge>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="font-semibold capitalize">{reward.type.replace(/-/g, " ")}</h3>
          <p className="text-sm text-muted-foreground">{reward.zoneName}</p>
          <p className="text-xs text-muted-foreground">{reward.period}</p>
        </div>

        {reward.sponsor && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-background/50 p-3">
            <img
              src={reward.sponsor.logo || "/placeholder.svg"}
              alt={reward.sponsor.name}
              className="h-8 w-auto object-contain"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{reward.sponsor.name}</p>
              <p className="text-xs text-muted-foreground truncate">{reward.sponsor.rewardDescription}</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Awarded {formatDate(reward.awardedAt)}</p>
          {reward.claimed && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">
              <Check className="mr-1 h-3 w-3" />
              Claimed
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
