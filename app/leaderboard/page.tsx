import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table"

export default function LeaderboardPage() {
  return (
    <div className="container max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how zones rank in the Clean-Up League</p>
      </div>

      <LeaderboardTable />
    </div>
  )
}
