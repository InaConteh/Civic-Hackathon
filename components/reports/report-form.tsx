"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, MapPin, Trash2, Scale, Calendar, Tag, Loader2, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getZones } from "@/lib/store"
import type { WasteType } from "@/types"

interface ReportFormProps {
  onSubmit: (data: ReportFormData) => Promise<void>
  onCancel?: () => void
}

export interface ReportFormData {
  zoneId: string
  zoneName: string
  beforePhoto: string
  afterPhoto: string
  trashBags: number
  weightKg: number
  cleanupDate: string
  coordinates?: { lat: number; lng: number }
  wasteTags: WasteType[]
}

const wasteTypes: { value: WasteType; label: string; color: string }[] = [
  { value: "plastics", label: "Plastics", color: "bg-blue-500/10 text-blue-500" },
  { value: "recyclables", label: "Recyclables", color: "bg-emerald-500/10 text-emerald-500" },
  { value: "organic", label: "Organic", color: "bg-amber-500/10 text-amber-500" },
  { value: "e-waste", label: "E-Waste", color: "bg-purple-500/10 text-purple-500" },
  { value: "hazardous", label: "Hazardous", color: "bg-red-500/10 text-red-500" },
  { value: "general", label: "General", color: "bg-gray-500/10 text-gray-500" },
]

export function ReportForm({ onSubmit, onCancel }: ReportFormProps) {
  const zones = getZones()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<{ confidence: number; suggestedTags: WasteType[] } | null>(null)

  const beforeInputRef = useRef<HTMLInputElement>(null)
  const afterInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ReportFormData>({
    zoneId: "",
    zoneName: "",
    beforePhoto: "",
    afterPhoto: "",
    trashBags: 1,
    weightKg: 5,
    cleanupDate: new Date().toISOString().split("T")[0],
    wasteTags: [],
  })

  const handlePhotoUpload = (type: "before" | "after") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const key = type === "before" ? "beforePhoto" : "afterPhoto"
        setFormData((prev) => ({ ...prev, [key]: reader.result as string }))

        // Mock AI analysis when both photos uploaded
        if (type === "after" && formData.beforePhoto) {
          runAiAnalysis()
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const runAiAnalysis = () => {
    setAiAnalyzing(true)
    // Simulate AI processing
    setTimeout(() => {
      const suggestedTags: WasteType[] = ["plastics", "general"]
      if (Math.random() > 0.5) suggestedTags.push("recyclables")
      if (Math.random() > 0.7) suggestedTags.push("organic")

      setAiResult({
        confidence: Math.random() * 0.2 + 0.78,
        suggestedTags,
      })
      setAiAnalyzing(false)
    }, 2000)
  }

  const applySuggestedTags = () => {
    if (aiResult) {
      setFormData((prev) => ({ ...prev, wasteTags: aiResult.suggestedTags }))
    }
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
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
        setError("Unable to get location")
        setGettingLocation(false)
      },
    )
  }

  const toggleWasteTag = (tag: WasteType) => {
    setFormData((prev) => ({
      ...prev,
      wasteTags: prev.wasteTags.includes(tag) ? prev.wasteTags.filter((t) => t !== tag) : [...prev.wasteTags, tag],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.zoneId) {
      setError("Please select a zone")
      return
    }
    if (!formData.beforePhoto || !formData.afterPhoto) {
      setError("Please upload both before and after photos")
      return
    }
    if (formData.wasteTags.length === 0) {
      setError("Please select at least one waste type")
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const progress = Math.round(((step - 1) / 3) * 100)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Step {step} of 4</span>
          <span className="font-medium">{progress}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      {/* Step 1: Zone Selection */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Zone
            </CardTitle>
            <CardDescription>Choose the neighborhood zone for this cleanup report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Zone *</Label>
              <Select
                value={formData.zoneId}
                onValueChange={(value) => {
                  const zone = zones.find((z) => z.id === value)
                  setFormData((prev) => ({
                    ...prev,
                    zoneId: value,
                    zoneName: zone?.name || "",
                  }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>GPS Confirmation</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.coordinates
                    ? `${formData.coordinates.lat.toFixed(4)}, ${formData.coordinates.lng.toFixed(4)}`
                    : "Location not confirmed"}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} disabled={gettingLocation}>
                {gettingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                Confirm Location
              </Button>
            </div>

            <Button type="button" className="w-full" onClick={() => setStep(2)} disabled={!formData.zoneId}>
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Photo Upload */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload Photos
            </CardTitle>
            <CardDescription>Take or upload before and after photos of the cleanup area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Before Photo */}
              <div className="space-y-2">
                <Label>Before Photo *</Label>
                <input
                  ref={beforeInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoUpload("before")}
                />
                {formData.beforePhoto ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg border">
                    <img
                      src={formData.beforePhoto || "/placeholder.svg"}
                      alt="Before cleanup"
                      className="h-full w-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={() => setFormData((prev) => ({ ...prev, beforePhoto: "" }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => beforeInputRef.current?.click()}
                    className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Before Photo</span>
                  </button>
                )}
              </div>

              {/* After Photo */}
              <div className="space-y-2">
                <Label>After Photo *</Label>
                <input
                  ref={afterInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoUpload("after")}
                />
                {formData.afterPhoto ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg border">
                    <img
                      src={formData.afterPhoto || "/placeholder.svg"}
                      alt="After cleanup"
                      className="h-full w-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, afterPhoto: "" }))
                        setAiResult(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => afterInputRef.current?.click()}
                    className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload After Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* AI Analysis Preview */}
            {aiAnalyzing && (
              <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="font-medium">AI Analyzing Photos...</p>
                  <p className="text-sm text-muted-foreground">Detecting waste types and cleanliness improvement</p>
                </div>
              </div>
            )}

            {aiResult && !aiAnalyzing && (
              <div className="space-y-3 rounded-lg bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium text-emerald-500">AI Analysis Complete</span>
                  <Badge variant="outline" className="ml-auto">
                    {Math.round(aiResult.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Suggested waste types: {aiResult.suggestedTags.join(", ")}
                </p>
                <Button type="button" variant="outline" size="sm" onClick={applySuggestedTags}>
                  Apply Suggestions
                </Button>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1"
                disabled={!formData.beforePhoto || !formData.afterPhoto}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Cleanup Details */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Cleanup Details
            </CardTitle>
            <CardDescription>Provide details about the cleanup activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trashBags">Number of Trash Bags</Label>
                <div className="relative">
                  <Trash2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="trashBags"
                    type="number"
                    min={1}
                    max={100}
                    className="pl-9"
                    value={formData.trashBags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, trashBags: Number.parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight Estimate (kg)</Label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="weight"
                    type="number"
                    min={1}
                    max={1000}
                    className="pl-9"
                    value={formData.weightKg}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, weightKg: Number.parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Cleanup Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  className="pl-9"
                  value={formData.cleanupDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cleanupDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button type="button" onClick={() => setStep(4)} className="flex-1">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Waste Tags */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Waste Type Tags
            </CardTitle>
            <CardDescription>Select all waste types collected during cleanup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {wasteTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleWasteTag(type.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    formData.wasteTags.includes(type.value)
                      ? `${type.color} ring-2 ring-current ring-offset-2`
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {formData.wasteTags.length > 0 && (
              <p className="text-sm text-muted-foreground">Selected: {formData.wasteTags.join(", ")}</p>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || formData.wasteTags.length === 0}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  )
}
