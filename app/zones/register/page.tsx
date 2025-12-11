"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ZoneForm, type ZoneFormData } from "@/components/zones/zone-form"
import { ZoneCard } from "@/components/zones/zone-card"
import { createZone } from "@/lib/store"
import type { Zone } from "@/types"
import Link from "next/link"

export default function RegisterZonePage() {
  const router = useRouter()
  const [newZone, setNewZone] = useState<Zone | null>(null)

  const handleSubmit = async (data: ZoneFormData) => {
    const zone = createZone(data)
    setNewZone(zone)
  }

  if (newZone) {
    return (
      <div className="container max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold">Zone Registered Successfully!</h1>
          <p className="text-muted-foreground">Your neighborhood is now part of the Clean-Up League</p>
        </div>

        <ZoneCard zone={newZone} rank={1} />

        <div className="mt-6 flex gap-3">
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href="/zones">View All Zones</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/report">Submit First Report</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/zones">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Zones
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Register New Zone</h1>
        <p className="text-muted-foreground">Add your neighborhood to the Clean-Up League</p>
      </div>

      <ZoneForm onSubmit={handleSubmit} />
    </div>
  )
}
