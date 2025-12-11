"use client"

import { useState } from "react"
import { Bell, CheckCheck, AlertTriangle, Gift, TrendingUp, Megaphone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/store"

const iconMap = {
  reminder: Clock,
  alert: AlertTriangle,
  announcement: Megaphone,
  "score-change": TrendingUp,
  reward: Gift,
}

const colorMap = {
  reminder: "text-blue-500 bg-blue-500/10",
  alert: "text-amber-500 bg-amber-500/10",
  announcement: "text-purple-500 bg-purple-500/10",
  "score-change": "text-emerald-500 bg-emerald-500/10",
  reward: "text-yellow-500 bg-yellow-500/10",
}

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState(getNotifications())

  const handleMarkAllRead = () => {
    markAllNotificationsRead()
    setNotifications(getNotifications())
  }

  const handleMarkRead = (id: string) => {
    markNotificationRead(id)
    setNotifications(getNotifications())
  }

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all read
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = iconMap[notification.type]
              return (
                <button
                  key={notification.id}
                  onClick={() => handleMarkRead(notification.id)}
                  className={cn(
                    "w-full rounded-lg p-3 text-left transition-colors hover:bg-muted",
                    !notification.read && "bg-primary/5",
                  )}
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        colorMap[notification.type],
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm font-medium", !notification.read && "text-foreground")}>
                          {notification.title}
                        </p>
                        {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground/70">{formatTime(notification.createdAt)}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
