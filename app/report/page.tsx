"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportForm, type ReportFormData } from "@/components/reports/report-form"
import { ReportCard } from "@/components/reports/report-card"
import { createReport, getReports } from "@/lib/store"
import type { CleanupReport } from "@/types"

export default function ReportPage() {
  const [tab, setTab] = useState("submit")
  const [submitted, setSubmitted] = useState<CleanupReport | null>(null)
  const reports = getReports()

  const handleSubmit = async (data: ReportFormData) => {
    const report = createReport(data)
    setSubmitted(report)
  }

  const handleNewReport = () => {
    setSubmitted(null)
    setTab("submit")
  }

  return (
    <div className="container max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cleanup Reports</h1>
        <p className="text-muted-foreground">Submit and track cleanup activities</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="submit">Submit Report</TabsTrigger>
          <TabsTrigger value="history">History ({reports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          {submitted ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold">Report Submitted!</h2>
                <p className="text-muted-foreground">Your cleanup report is pending verification</p>
              </div>

              <ReportCard report={submitted} />

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleNewReport}>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Another
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/leaderboard">View Leaderboard</Link>
                </Button>
              </div>
            </div>
          ) : (
            <ReportForm onSubmit={handleSubmit} />
          )}
        </TabsContent>

        <TabsContent value="history">
          {reports.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No reports submitted yet</p>
              <Button variant="link" className="mt-2" onClick={() => setTab("submit")}>
                Submit your first report
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
      </Tabs>
    </div>
  )
}
