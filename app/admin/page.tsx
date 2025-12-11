"use client"

import { useState } from "react"
import { Search, Filter, CheckCircle, XCircle, Edit, Trash2, Eye, Gift, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AdminStats } from "@/components/admin/admin-stats"
import { ReportCard } from "@/components/reports/report-card"
import { ZoneForm, type ZoneFormData } from "@/components/zones/zone-form"
import {
  getZones,
  getReports,
  getRewards,
  verifyReport,
  updateZone,
  deleteZone,
  distributeRewards,
  getAdminStats,
} from "@/lib/store"
import type { Zone, CleanupReport } from "@/types"

export default function AdminPage() {
  const [zones, setZones] = useState(getZones())
  const [reports, setReports] = useState(getReports())
  const [rewards, setRewards] = useState(getRewards())
  const [stats, setStats] = useState(getAdminStats())

  const [zoneSearch, setZoneSearch] = useState("")
  const [zoneStatus, setZoneStatus] = useState("all")
  const [reportStatus, setReportStatus] = useState("all")
  const [editingZone, setEditingZone] = useState<Zone | null>(null)
  const [selectedReport, setSelectedReport] = useState<CleanupReport | null>(null)

  const refreshData = () => {
    setZones(getZones())
    setReports(getReports())
    setRewards(getRewards())
    setStats(getAdminStats())
  }

  const handleVerifyReport = (id: string, approved: boolean) => {
    verifyReport(id, approved)
    refreshData()
    setSelectedReport(null)
  }

  const handleUpdateZone = async (data: ZoneFormData) => {
    if (editingZone) {
      updateZone(editingZone.id, data)
      refreshData()
      setEditingZone(null)
    }
  }

  const handleDeleteZone = (id: string) => {
    if (confirm("Delete this zone? This will also delete all associated reports.")) {
      deleteZone(id)
      refreshData()
    }
  }

  const handleDistributeRewards = () => {
    const period = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
    if (confirm(`Distribute rewards for ${period}? This will award Gold, Silver, and Bronze to top 3 zones.`)) {
      distributeRewards(period)
      refreshData()
    }
  }

  const filteredZones = zones.filter((z) => {
    const matchesSearch = z.name.toLowerCase().includes(zoneSearch.toLowerCase())
    const matchesStatus = zoneStatus === "all" || z.status === zoneStatus
    return matchesSearch && matchesStatus
  })

  const filteredReports = reports.filter((r) => reportStatus === "all" || r.status === reportStatus)

  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-500",
    pending: "bg-amber-500/10 text-amber-500",
    inactive: "bg-muted text-muted-foreground",
    verified: "bg-emerald-500/10 text-emerald-500",
    rejected: "bg-red-500/10 text-red-500",
  }

  return (
    <div className="container space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage zones, verify reports, and distribute rewards</p>
      </div>

      <AdminStats />

      <Tabs defaultValue="zones">
        <TabsList>
          <TabsTrigger value="zones">Zones ({zones.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports ({stats.pendingVerifications} pending)</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Zones Tab */}
        <TabsContent value="zones" className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search zones..."
                className="pl-9"
                value={zoneSearch}
                onChange={(e) => setZoneSearch(e.target.value)}
              />
            </div>
            <Select value={zoneStatus} onValueChange={setZoneStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead>Population</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredZones.map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">{zone.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>{zone.population.toLocaleString()}</TableCell>
                    <TableCell>{zone.currentScore}/100</TableCell>
                    <TableCell>{zone.totalPoints.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[zone.status]}>{zone.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingZone(zone)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteZone(zone.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Edit Zone Dialog */}
          <Dialog open={!!editingZone} onOpenChange={(open) => !open && setEditingZone(null)}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Zone</DialogTitle>
              </DialogHeader>
              {editingZone && (
                <ZoneForm zone={editingZone} onSubmit={handleUpdateZone} onCancel={() => setEditingZone(null)} />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Select value={reportStatus} onValueChange={setReportStatus}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Bags</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.zoneName}</TableCell>
                    <TableCell>{new Date(report.cleanupDate).toLocaleDateString()}</TableCell>
                    <TableCell>{report.trashBags}</TableCell>
                    <TableCell>{report.weightKg} kg</TableCell>
                    <TableCell>
                      <Badge className={statusColors[report.status]}>{report.status}</Badge>
                    </TableCell>
                    <TableCell>{report.score ? `+${report.score}` : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedReport(report)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Report Details</DialogTitle>
                            </DialogHeader>
                            {selectedReport && (
                              <ReportCard
                                report={selectedReport}
                                showActions={selectedReport.status === "pending"}
                                onVerify={handleVerifyReport}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        {report.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-emerald-500 hover:text-emerald-500"
                              onClick={() => handleVerifyReport(report.id, true)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-500"
                              onClick={() => handleVerifyReport(report.id, false)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{rewards.length} rewards distributed</p>
            <Button onClick={handleDistributeRewards}>
              <Gift className="mr-2 h-4 w-4" />
              Distribute Monthly Rewards
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Claimed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell className="font-medium">{reward.zoneName}</TableCell>
                    <TableCell className="capitalize">{reward.type.replace(/-/g, " ")}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          reward.tier === "gold"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : reward.tier === "silver"
                              ? "bg-gray-200 text-gray-600"
                              : "bg-amber-600/10 text-amber-700"
                        }
                      >
                        {reward.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>{reward.period}</TableCell>
                    <TableCell>{reward.sponsor?.name || "-"}</TableCell>
                    <TableCell>
                      {reward.claimed ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500">Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Zone Performance
                </CardTitle>
                <CardDescription>Points distribution across zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zones.slice(0, 5).map((zone) => (
                    <div key={zone.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate">{zone.name}</span>
                        <span className="font-medium">{zone.totalPoints.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(100, (zone.totalPoints / Math.max(...zones.map((z) => z.totalPoints))) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Statistics</CardTitle>
                <CardDescription>Breakdown by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      label: "Verified",
                      count: reports.filter((r) => r.status === "verified").length,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Pending",
                      count: reports.filter((r) => r.status === "pending").length,
                      color: "bg-amber-500",
                    },
                    {
                      label: "Rejected",
                      count: reports.filter((r) => r.status === "rejected").length,
                      color: "bg-red-500",
                    },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${stat.color}`} />
                        <span>{stat.label}</span>
                      </div>
                      <span className="font-medium">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
