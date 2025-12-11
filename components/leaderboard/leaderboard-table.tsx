"use client"

import { useState } from "react"
import { Trophy, TrendingUp, TrendingDown, Minus, Share2, Download, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getLeaderboard } from "@/lib/store"
import type { TimePeriod } from "@/types"
import Link from "next/link"

const periodLabels: Record<TimePeriod, string> = {
  weekly: "This Week",
  monthly: "This Month",
  seasonal: "This Season",
  "all-time": "All Time",
}

export function LeaderboardTable() {
  const [period, setPeriod] = useState<TimePeriod>("monthly")
  const leaderboard = getLeaderboard(period)

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
          <Trophy className="h-4 w-4" />
        </div>
      )
    if (rank === 2)
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-white font-bold">2</div>
      )
    if (rank === 3)
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white font-bold">3</div>
      )
    return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold">{rank}</div>
  }

  const getChangeIndicator = (change: number) => {
    if (change > 0)
      return (
        <span className="flex items-center gap-1 text-emerald-500">
          <TrendingUp className="h-4 w-4" />+{change}
        </span>
      )
    if (change < 0)
      return (
        <span className="flex items-center gap-1 text-red-500">
          <TrendingDown className="h-4 w-4" />
          {change}
        </span>
      )
    return (
      <span className="flex items-center gap-1 text-muted-foreground">
        <Minus className="h-4 w-4" />0
      </span>
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Clean-Up League Leaderboard",
        text: `Check out the ${periodLabels[period]} leaderboard!`,
        url: window.location.href,
      })
    }
  }

  const handleExport = () => {
    const data = leaderboard.map((e) => ({
      rank: e.rank,
      zone: e.zone.name,
      points: e.points,
      reports: e.reportsCount,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leaderboard-${period}.json`
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Zone Rankings
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="all-time">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <Link
              key={entry.zone.id}
              href={`/zones/${entry.zone.id}`}
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              {getRankBadge(entry.rank)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{entry.zone.name}</h3>
                  {entry.rank <= 3 && (
                    <Badge
                      variant="outline"
                      className={
                        entry.rank === 1
                          ? "border-yellow-500 text-yellow-500"
                          : entry.rank === 2
                            ? "border-gray-400 text-gray-500"
                            : "border-amber-600 text-amber-600"
                      }
                    >
                      {entry.rank === 1 ? "Gold" : entry.rank === 2 ? "Silver" : "Bronze"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{entry.reportsCount} reports</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {entry.zone.lastActivityDate
                      ? new Date(entry.zone.lastActivityDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "No activity"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-primary">{entry.points.toLocaleString()}</p>
                <div className="text-sm">{getChangeIndicator(entry.change)}</div>
              </div>
            </Link>
          ))}

          {leaderboard.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">No data available for this period</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
