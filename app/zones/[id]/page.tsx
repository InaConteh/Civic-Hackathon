"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, MapPin, Users, Calendar, Trophy, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportCard } from "@/components/reports/report-card"
import { RewardCard } from "@/components/rewards/reward-card"
import { getZoneById, getReports, getRewards, updateZone } from "@/lib/store"
import { ZoneForm, type ZoneFormData } from "@/components/zones/zone-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { notFound } from "next/navigation"

export default function ZoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const zone = getZoneById(id)
  const [editOpen, setEditOpen] = useState(false)
  const [currentZone, setCurrentZone] = useState(zone)

  if (!zone || !currentZone) {
    notFound()
  }

  const reports = getReports({ zoneId: id })
  const rewards = getRewards(id)

  const handleUpdate = async (data: ZoneFormData) => {
    const updated = updateZone(id, data)
    setCurrentZone(updated)
    setEditOpen(false)
  }

  const formatDate = (date?: string) => {
    if (!date) return "Never"
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="container space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/zones">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Zones
          </Link>
        </Button>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Zone</DialogTitle>
            </DialogHeader>
            <ZoneForm zone={currentZone} onSubmit={handleUpdate} onCancel={() => setEditOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Zone Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{currentZone.name}</h1>
              <Badge
                className={
                  currentZone.status === "active"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : currentZone.status === "pending"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-muted text-muted-foreground"
                }
              >
                {currentZone.status}
              </Badge>
            </div>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {currentZone.location}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentZone.totalPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentZone.currentScore}/100</p>
                <p className="text-xs text-muted-foreground">Cleanliness Score</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentZone.population.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Population</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatDate(currentZone.lastActivityDate)}</p>
                <p className="text-xs text-muted-foreground">Last Activity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cleanliness Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cleanliness Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Baseline: {currentZone.baselineScore}</span>
              <span className="font-medium">Current: {currentZone.currentScore}</span>
            </div>
            <Progress value={currentZone.currentScore} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Improvement: +{currentZone.currentScore - currentZone.baselineScore} points from baseline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Reports & Rewards */}
      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="rewards">Rewards ({rewards.length})</TabsTrigger>
          {currentZone.representative && <TabsTrigger value="contact">Contact</TabsTrigger>}
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          {reports.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No reports yet</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/report">Submit the first report</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          {rewards.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No rewards earned yet</p>
              <p className="text-sm text-muted-foreground">Keep cleaning to earn rewards!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          )}
        </TabsContent>

        {currentZone.representative && (
          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Zone Representative</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Name:</span> {currentZone.representative.name}
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span> {currentZone.representative.email}
                </p>
                {currentZone.representative.phone && (
                  <p>
                    <span className="text-muted-foreground">Phone:</span> {currentZone.representative.phone}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
