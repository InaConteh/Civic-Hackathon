"use client"

import Link from "next/link"
import { ArrowRight, Trophy, MapPin, FileText, Gift, TrendingUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLeaderboard, getAdminStats, getReports } from "@/lib/store"

export default function HomePage() {
  const leaderboard = getLeaderboard("monthly").slice(0, 3)
  const stats = getAdminStats()
  const recentReports = getReports().slice(0, 3)

  return (
    <div className="container space-y-12 px-4 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Community-Powered Cleanliness
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Clean-Up League
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Join neighborhoods across the city in the ultimate cleanup competition. Track progress, earn points, and win
            rewards for making your community shine.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/zones/register">
                <MapPin className="mr-2 h-5 w-5" />
                Register Your Zone
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/report">
                <FileText className="mr-2 h-5 w-5" />
                Report Cleanup
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      </section>

      {/* Stats Overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <MapPin className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.totalZones}</p>
              <p className="text-sm text-muted-foreground">Active Zones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <FileText className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.totalReports}</p>
              <p className="text-sm text-muted-foreground">Cleanup Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.totalPointsAwarded.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Points Awarded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10">
              <Gift className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.rewardsDistributed}</p>
              <p className="text-sm text-muted-foreground">Rewards Given</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Leaderboard Preview */}
      <section className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Performers
              </CardTitle>
              <CardDescription>This month's leading zones</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/leaderboard">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div key={entry.zone.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                    index === 0
                      ? "bg-yellow-500 text-white"
                      : index === 1
                        ? "bg-gray-400 text-white"
                        : "bg-amber-600 text-white"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{entry.zone.name}</h3>
                  <p className="text-sm text-muted-foreground">{entry.reportsCount} reports</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{entry.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest cleanup reports</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/report">
                Submit Report <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="h-12 w-12 overflow-hidden rounded-lg">
                  <img
                    src={report.afterPhoto || "/placeholder.svg"}
                    alt="Cleanup"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{report.zoneName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {report.trashBags} bags, {report.weightKg}kg collected
                  </p>
                </div>
                {report.score && (
                  <div className="text-right">
                    <p className="font-bold text-primary">+{report.score}</p>
                    <p className="text-xs text-muted-foreground">pts</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">Four simple steps to community impact</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPin, title: "Register Zone", description: "Sign up your neighborhood to join the league" },
            { icon: FileText, title: "Report Cleanups", description: "Document your cleanup activities with photos" },
            { icon: Trophy, title: "Earn Points", description: "Get scored based on impact and consistency" },
            { icon: Gift, title: "Win Rewards", description: "Top zones earn solar lights, bins, and more" },
          ].map((step, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
