"use client"

import { Calendar, Trash2, Scale, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { CleanupReport } from "@/types"

interface ReportCardProps {
  report: CleanupReport
  onVerify?: (id: string, approved: boolean) => void
  showActions?: boolean
}

const statusConfig = {
  pending: { icon: Clock, color: "bg-amber-500/10 text-amber-500", label: "Pending" },
  verified: { icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-500", label: "Verified" },
  rejected: { icon: XCircle, color: "bg-red-500/10 text-red-500", label: "Rejected" },
}

const wasteColors: Record<string, string> = {
  plastics: "bg-blue-500/10 text-blue-500",
  recyclables: "bg-emerald-500/10 text-emerald-500",
  organic: "bg-amber-500/10 text-amber-500",
  "e-waste": "bg-purple-500/10 text-purple-500",
  hazardous: "bg-red-500/10 text-red-500",
  general: "bg-gray-500/10 text-gray-500",
}

export function ReportCard({ report, onVerify, showActions = false }: ReportCardProps) {
  const status = statusConfig[report.status]
  const StatusIcon = status.icon

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <h3 className="font-semibold">{report.zoneName}</h3>
          <p className="text-sm text-muted-foreground">
            <Calendar className="mr-1 inline h-3 w-3" />
            {formatDate(report.cleanupDate)}
          </p>
        </div>
        <Badge className={status.color}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {status.label}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Photo Comparison */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Before</p>
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={report.beforePhoto || "/placeholder.svg"}
                alt="Before cleanup"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">After</p>
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={report.afterPhoto || "/placeholder.svg"}
                alt="After cleanup"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
            <span>{report.trashBags} bags</span>
          </div>
          <div className="flex items-center gap-1">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <span>{report.weightKg} kg</span>
          </div>
          {report.score && <div className="ml-auto font-semibold text-primary">+{report.score} pts</div>}
        </div>

        {/* Waste Tags */}
        <div className="flex flex-wrap gap-1">
          {report.wasteTags.map((tag) => (
            <Badge key={tag} variant="outline" className={wasteColors[tag]}>
              {tag}
            </Badge>
          ))}
        </div>

        {/* AI Classification */}
        {report.aiClassification && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <p className="mb-1 font-medium">AI Analysis</p>
            <p className="text-muted-foreground">
              Confidence: {Math.round(report.aiClassification.confidence * 100)}% | Cleanliness:{" "}
              {report.aiClassification.cleanlinessBeforeScore} → {report.aiClassification.cleanlinessAfterScore}
            </p>
          </div>
        )}

        {/* Score Breakdown */}
        {report.scoreBreakdown && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                View Score Breakdown
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Score Breakdown</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {Object.entries(report.scoreBreakdown).map(
                  ([key, value]) =>
                    key !== "total" && (
                      <div key={key} className="flex items-center justify-between">
                        <span className="capitalize text-muted-foreground">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="font-medium">+{value}</span>
                      </div>
                    ),
                )}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Score</span>
                    <span className="text-xl font-bold text-primary">{report.scoreBreakdown.total}</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Admin Actions */}
        {showActions && report.status === "pending" && onVerify && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-500 hover:bg-red-500/10 hover:text-red-500 bg-transparent"
              onClick={() => onVerify(report.id, false)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button size="sm" className="flex-1" onClick={() => onVerify(report.id, true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
