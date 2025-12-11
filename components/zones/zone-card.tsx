"use client"

import { MapPin, Users, Calendar, MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Zone } from "@/types"
import Link from "next/link"

interface ZoneCardProps {
  zone: Zone
  rank?: number
  onEdit?: (zone: Zone) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function ZoneCard({ zone, rank, onEdit, onDelete, showActions = false }: ZoneCardProps) {
  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-500",
    pending: "bg-amber-500/10 text-amber-500",
    inactive: "bg-muted text-muted-foreground",
  }

  const formatDate = (date?: string) => {
    if (!date) return "No activity"
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start gap-3">
          {rank && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {rank}
            </div>
          )}
          <div>
            <h3 className="font-semibold leading-tight text-foreground">{zone.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{zone.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={statusColors[zone.status]}>{zone.status}</Badge>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/zones/${zone.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(zone)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Zone
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(zone.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Zone
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cleanliness Score</span>
            <span className="font-medium">{zone.currentScore}/100</span>
          </div>
          <Progress value={zone.currentScore} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">{zone.totalPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">{zone.population.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Population</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatDate(zone.lastActivityDate)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Last Active</p>
          </div>
        </div>

        {zone.representative && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Representative</p>
            <p className="text-sm font-medium">{zone.representative.name}</p>
            <p className="text-xs text-muted-foreground">{zone.representative.email}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
