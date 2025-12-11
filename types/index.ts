export interface Zone {
  id: string
  name: string
  location: string
  coordinates?: { lat: number; lng: number }
  population: number
  baselineScore: number
  currentScore: number
  totalPoints: number
  representative?: {
    name: string
    email: string
    phone?: string
  }
  createdAt: string
  updatedAt: string
  lastActivityDate?: string
  status: "active" | "pending" | "inactive"
}

export interface CleanupReport {
  id: string
  zoneId: string
  zoneName: string
  beforePhoto: string
  afterPhoto: string
  trashBags: number
  weightKg: number
  cleanupDate: string
  coordinates?: { lat: number; lng: number }
  wasteTags: WasteType[]
  status: "pending" | "verified" | "rejected"
  score?: number
  scoreBreakdown?: ScoreBreakdown
  submittedAt: string
  verifiedAt?: string
  verifiedBy?: string
  aiClassification?: AIClassification
}

export type WasteType = "plastics" | "recyclables" | "organic" | "e-waste" | "hazardous" | "general"

export interface ScoreBreakdown {
  volumeScore: number
  cleanlinessImprovement: number
  frequencyBonus: number
  wasteTypeImpact: number
  total: number
}

export interface AIClassification {
  confidence: number
  detectedWaste: WasteType[]
  cleanlinessBeforeScore: number
  cleanlinessAfterScore: number
  verificationStatus: "pass" | "review" | "fail"
}

export interface LeaderboardEntry {
  rank: number
  zone: Zone
  points: number
  change: number
  reportsCount: number
}

export type TimePeriod = "weekly" | "monthly" | "seasonal" | "all-time"

export interface Reward {
  id: string
  zoneId: string
  zoneName: string
  type: RewardType
  tier: "gold" | "silver" | "bronze"
  period: string
  awardedAt: string
  sponsor?: Sponsor
  claimed: boolean
}

export type RewardType = "solar-streetlight" | "trash-bins" | "cleanup-tools" | "certificate" | "sponsor-incentive"

export interface Sponsor {
  id: string
  name: string
  logo: string
  rewardDescription: string
}

export interface Notification {
  id: string
  type: "reminder" | "alert" | "announcement" | "score-change" | "reward"
  title: string
  message: string
  zoneId?: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface AdminStats {
  totalZones: number
  activeZones: number
  totalReports: number
  pendingVerifications: number
  totalPointsAwarded: number
  rewardsDistributed: number
}
