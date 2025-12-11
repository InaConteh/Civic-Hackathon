"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Users, User, Mail, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Zone } from "@/types"

interface ZoneFormProps {
  zone?: Zone
  onSubmit: (data: ZoneFormData) => Promise<void>
  onCancel?: () => void
}

export interface ZoneFormData {
  name: string
  location: string
  coordinates?: { lat: number; lng: number }
  population: number
  baselineScore: number
  representative?: {
    name: string
    email: string
    phone?: string
  }
}

export function ZoneForm({ zone, onSubmit, onCancel }: ZoneFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasRep, setHasRep] = useState(!!zone?.representative)
  const [useGeotag, setUseGeotag] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  const [formData, setFormData] = useState<ZoneFormData>({
    name: zone?.name || "",
    location: zone?.location || "",
    coordinates: zone?.coordinates,
    population: zone?.population || 1000,
    baselineScore: zone?.baselineScore || 50,
    representative: zone?.representative,
  })

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }))
        setGettingLocation(false)
      },
      () => {
        setError("Unable to get your location")
        setGettingLocation(false)
      },
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError("Zone name is required")
      return
    }
    if (!formData.location.trim()) {
      setError("Location is required")
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        ...formData,
        representative: hasRep ? formData.representative : undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Zone Information
          </CardTitle>
          <CardDescription>Basic details about the neighborhood zone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Zone Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Greenwood Heights"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location / Address *</Label>
            <Input
              id="location"
              placeholder="e.g., 123 Oak Street, District A"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>GPS Coordinates</Label>
              <p className="text-sm text-muted-foreground">
                {formData.coordinates
                  ? `${formData.coordinates.lat.toFixed(4)}, ${formData.coordinates.lng.toFixed(4)}`
                  : "Not set"}
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} disabled={gettingLocation}>
              {gettingLocation ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2 h-4 w-4" />
              )}
              Get Location
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Zone Metrics
          </CardTitle>
          <CardDescription>Population and initial cleanliness assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="population">Population Size</Label>
            <Input
              id="population"
              type="number"
              min={100}
              max={1000000}
              value={formData.population}
              onChange={(e) => setFormData((prev) => ({ ...prev, population: Number.parseInt(e.target.value) || 0 }))}
            />
            <p className="text-xs text-muted-foreground">Estimated number of residents in this zone</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Baseline Cleanliness Score</Label>
              <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                {formData.baselineScore}/100
              </span>
            </div>
            <Slider
              value={[formData.baselineScore]}
              onValueChange={([value]) => setFormData((prev) => ({ ...prev, baselineScore: value }))}
              min={0}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Initial assessment of the zone's cleanliness level (0 = Very Dirty, 100 = Pristine)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Zone Representative
              </CardTitle>
              <CardDescription>Optional contact person for this zone</CardDescription>
            </div>
            <Switch checked={hasRep} onCheckedChange={setHasRep} />
          </div>
        </CardHeader>
        {hasRep && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repName">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="repName"
                  className="pl-9"
                  placeholder="John Doe"
                  value={formData.representative?.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      representative: { ...prev.representative!, name: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repEmail">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="repEmail"
                  type="email"
                  className="pl-9"
                  placeholder="john@example.com"
                  value={formData.representative?.email || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      representative: { ...prev.representative!, email: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repPhone">Phone (optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="repPhone"
                  type="tel"
                  className="pl-9"
                  placeholder="555-0100"
                  value={formData.representative?.phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      representative: { ...prev.representative!, phone: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} className="flex-1">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {zone ? "Update Zone" : "Register Zone"}
        </Button>
      </div>
    </form>
  )
}
