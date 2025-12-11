import type {
  Zone,
  CleanupReport,
  Reward,
  Notification,
  ScoreBreakdown,
  AIClassification,
  WasteType,
  RewardType,
} from "@/types"
import { mockZones, mockReports, mockRewards, mockNotifications, mockSponsors } from "./mock-data"

// In-memory store (simulates database)
let zones = [...mockZones]
let reports = [...mockReports]
const rewards = [...mockRewards]
const notifications = [...mockNotifications]

// Zone operations
export function getZones(): Zone[] {
  return [...zones].sort((a, b) => b.totalPoints - a.totalPoints)
}

export function getZoneById(id: string): Zone | undefined {
  return zones.find((z) => z.id === id)
}

export function createZone(
  data: Omit<Zone, "id" | "createdAt" | "updatedAt" | "currentScore" | "totalPoints" | "status">,
): Zone {
  const existingZone = zones.find((z) => z.name.toLowerCase() === data.name.toLowerCase())
  if (existingZone) {
    throw new Error("Zone with this name already exists")
  }

  const newZone: Zone = {
    ...data,
    id: `z${Date.now()}`,
    currentScore: data.baselineScore,
    totalPoints: 0,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  zones.push(newZone)

  // Create notification
  addNotification({
    type: "announcement",
    title: "New Zone Registered",
    message: `Welcome ${newZone.name} to the Clean-Up League!`,
  })

  return newZone
}

export function updateZone(id: string, data: Partial<Zone>): Zone {
  const index = zones.findIndex((z) => z.id === id)
  if (index === -1) throw new Error("Zone not found")

  zones[index] = {
    ...zones[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return zones[index]
}

export function deleteZone(id: string): void {
  zones = zones.filter((z) => z.id !== id)
  reports = reports.filter((r) => r.zoneId !== id)
}

// Report operations
export function getReports(filters?: { zoneId?: string; status?: string }): CleanupReport[] {
  let result = [...reports]
  if (filters?.zoneId) result = result.filter((r) => r.zoneId === filters.zoneId)
  if (filters?.status) result = result.filter((r) => r.status === filters.status)
  return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

export function getReportById(id: string): CleanupReport | undefined {
  return reports.find((r) => r.id === id)
}

export function createReport(data: Omit<CleanupReport, "id" | "submittedAt" | "status">): CleanupReport {
  const zone = getZoneById(data.zoneId)
  if (!zone) throw new Error("Zone not found")

  // Generate AI classification (mock)
  const aiClassification = generateAIClassification(data.wasteTags)

  const newReport: CleanupReport = {
    ...data,
    id: `r${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
    aiClassification,
  }
  reports.push(newReport)

  return newReport
}

export function verifyReport(id: string, approved: boolean, adminOverride?: Partial<ScoreBreakdown>): CleanupReport {
  const index = reports.findIndex((r) => r.id === id)
  if (index === -1) throw new Error("Report not found")

  const report = reports[index]

  if (approved) {
    const scoreBreakdown = adminOverride
      ? {
          ...calculateScore(report),
          ...adminOverride,
          total:
            Object.values({ ...calculateScore(report), ...adminOverride }).reduce((a, b) => a + b, 0) -
            (adminOverride.total || 0),
        }
      : calculateScore(report)

    reports[index] = {
      ...report,
      status: "verified",
      score: scoreBreakdown.total,
      scoreBreakdown,
      verifiedAt: new Date().toISOString(),
      verifiedBy: "admin",
    }

    // Update zone points
    const zone = getZoneById(report.zoneId)
    if (zone) {
      updateZone(zone.id, {
        totalPoints: zone.totalPoints + scoreBreakdown.total,
        currentScore: Math.min(100, zone.currentScore + Math.floor(scoreBreakdown.cleanlinessImprovement / 5)),
        lastActivityDate: new Date().toISOString(),
      })

      // Notify zone
      addNotification({
        type: "score-change",
        title: "Score Updated",
        message: `Your cleanup earned ${scoreBreakdown.total} points!`,
        zoneId: zone.id,
      })
    }
  } else {
    reports[index] = {
      ...report,
      status: "rejected",
      verifiedAt: new Date().toISOString(),
      verifiedBy: "admin",
    }
  }

  return reports[index]
}

// Scoring engine
export function calculateScore(report: CleanupReport): ScoreBreakdown {
  // Volume score: based on trash bags and weight
  const volumeScore = Math.min(35, Math.floor(report.trashBags * 2 + report.weightKg / 5))

  // Cleanliness improvement: mock based on AI or random
  const cleanlinessImprovement = report.aiClassification
    ? Math.floor((report.aiClassification.cleanlinessAfterScore - report.aiClassification.cleanlinessBeforeScore) / 2)
    : Math.floor(Math.random() * 20) + 10

  // Frequency bonus: check how many reports this zone has this month
  const zoneReportsThisMonth = reports.filter(
    (r) =>
      r.zoneId === report.zoneId &&
      r.status === "verified" &&
      new Date(r.submittedAt).getMonth() === new Date().getMonth(),
  ).length
  const frequencyBonus = Math.min(20, zoneReportsThisMonth * 5)

  // Waste type impact
  const wasteImpactMap: Record<WasteType, number> = {
    "e-waste": 5,
    hazardous: 5,
    recyclables: 4,
    plastics: 3,
    organic: 2,
    general: 1,
  }
  const wasteTypeImpact = Math.min(
    20,
    report.wasteTags.reduce((acc, tag) => acc + wasteImpactMap[tag], 0),
  )

  const total = volumeScore + cleanlinessImprovement + frequencyBonus + wasteTypeImpact

  return { volumeScore, cleanlinessImprovement, frequencyBonus, wasteTypeImpact, total }
}

function generateAIClassification(wasteTags: WasteType[]): AIClassification {
  const beforeScore = Math.floor(Math.random() * 40) + 20
  const afterScore = Math.floor(Math.random() * 30) + 65

  return {
    confidence: Math.random() * 0.2 + 0.78,
    detectedWaste: wasteTags.slice(0, Math.min(3, wasteTags.length)),
    cleanlinessBeforeScore: beforeScore,
    cleanlinessAfterScore: afterScore,
    verificationStatus: Math.random() > 0.1 ? "pass" : "review",
  }
}

// Leaderboard operations
export function getLeaderboard(period: "weekly" | "monthly" | "seasonal" | "all-time") {
  const now = new Date()
  let startDate: Date

  switch (period) {
    case "weekly":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "monthly":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case "seasonal":
      const quarter = Math.floor(now.getMonth() / 3)
      startDate = new Date(now.getFullYear(), quarter * 3, 1)
      break
    default:
      startDate = new Date(0)
  }

  // Calculate points per zone for the period
  const zonePoints = new Map<string, number>()
  const zoneReports = new Map<string, number>()

  reports
    .filter((r) => r.status === "verified" && new Date(r.submittedAt) >= startDate)
    .forEach((r) => {
      zonePoints.set(r.zoneId, (zonePoints.get(r.zoneId) || 0) + (r.score || 0))
      zoneReports.set(r.zoneId, (zoneReports.get(r.zoneId) || 0) + 1)
    })

  return zones
    .map((zone) => ({
      rank: 0,
      zone,
      points: period === "all-time" ? zone.totalPoints : zonePoints.get(zone.id) || 0,
      change: Math.floor(Math.random() * 5) - 2, // Mock change
      reportsCount: zoneReports.get(zone.id) || 0,
    }))
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
}

// Reward operations
export function getRewards(zoneId?: string): Reward[] {
  let result = [...rewards]
  if (zoneId) result = result.filter((r) => r.zoneId === zoneId)
  return result.sort((a, b) => new Date(b.awardedAt).getTime() - new Date(a.awardedAt).getTime())
}

export function distributeRewards(period: string): Reward[] {
  const leaderboard = getLeaderboard("monthly").slice(0, 3)
  const tiers: Array<"gold" | "silver" | "bronze"> = ["gold", "silver", "bronze"]
  const rewardTypes: RewardType[] = ["solar-streetlight", "trash-bins", "certificate"]

  const newRewards: Reward[] = leaderboard.map((entry, index) => ({
    id: `rw${Date.now()}-${index}`,
    zoneId: entry.zone.id,
    zoneName: entry.zone.name,
    type: rewardTypes[index],
    tier: tiers[index],
    period,
    awardedAt: new Date().toISOString(),
    sponsor: index < 2 ? mockSponsors[index] : undefined,
    claimed: false,
  }))

  rewards.push(...newRewards)

  // Notify winners
  newRewards.forEach((reward) => {
    addNotification({
      type: "reward",
      title: `${reward.tier.charAt(0).toUpperCase() + reward.tier.slice(1)} Reward Unlocked!`,
      message: `Congratulations! Your zone earned a ${reward.tier} ${reward.type.replace("-", " ")}.`,
      zoneId: reward.zoneId,
      actionUrl: "/rewards",
    })
  })

  return newRewards
}

// Notification operations
export function getNotifications(zoneId?: string): Notification[] {
  let result = [...notifications]
  if (zoneId) result = result.filter((n) => !n.zoneId || n.zoneId === zoneId)
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addNotification(data: Omit<Notification, "id" | "read" | "createdAt">): Notification {
  const notification: Notification = {
    ...data,
    id: `n${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  }
  notifications.push(notification)
  return notification
}

export function markNotificationRead(id: string): void {
  const notification = notifications.find((n) => n.id === id)
  if (notification) notification.read = true
}

export function markAllNotificationsRead(): void {
  notifications.forEach((n) => (n.read = true))
}

// Admin stats
export function getAdminStats() {
  return {
    totalZones: zones.length,
    activeZones: zones.filter((z) => z.status === "active").length,
    totalReports: reports.length,
    pendingVerifications: reports.filter((r) => r.status === "pending").length,
    totalPointsAwarded: reports.filter((r) => r.status === "verified").reduce((acc, r) => acc + (r.score || 0), 0),
    rewardsDistributed: rewards.length,
  }
}
