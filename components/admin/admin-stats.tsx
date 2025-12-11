"use client"

import { MapPin, FileText, Clock, Trophy, Gift, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getAdminStats } from "@/lib/store"

const statConfig = [
  { key: "totalZones", label: "Total Zones", icon: MapPin, color: "text-blue-500 bg-blue-500/10" },
  { key: "activeZones", label: "Active Zones", icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
  { key: "totalReports", label: "Total Reports", icon: FileText, color: "text-purple-500 bg-purple-500/10" },
  { key: "pendingVerifications", label: "Pending Reviews", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
  { key: "totalPointsAwarded", label: "Points Awarded", icon: Trophy, color: "text-yellow-500 bg-yellow-500/10" },
  { key: "rewardsDistributed", label: "Rewards Given", icon: Gift, color: "text-pink-500 bg-pink-500/10" },
]

export function AdminStats() {
  const stats = getAdminStats()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statConfig.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold">{stats[key as keyof typeof stats].toLocaleString()}</p>
                <p className="text-xs text-muted-foreground truncate">{label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
