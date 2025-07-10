"use client"

import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar"
import { Badge } from "@/shadcn/ui/badge"
import { ScrollArea } from "@/shadcn/ui/scroll-area"

export function RecentAlerts() {
  const alerts = [
    {
      id: 1,
      severity: "critical",
      message: "HVAC failure detected in Building A, Floor 3",
      time: "10 minutes ago",
      location: "Building A",
      system: "HVAC",
    },
    {
      id: 2,
      severity: "warning",
      message: "Temperature in Server Room exceeding threshold",
      time: "25 minutes ago",
      location: "Building B",
      system: "Cooling",
    },
    {
      id: 3,
      severity: "info",
      message: "BACnet device discovery completed",
      time: "1 hour ago",
      location: "Building C",
      system: "Network",
    },
    {
      id: 4,
      severity: "success",
      message: "Maintenance completed on elevator systems",
      time: "1 hour ago",
      location: "Building A",
      system: "Elevators",
    },
    {
      id: 5,
      severity: "warning",
      message: "Energy consumption above normal for Floor 5",
      time: "2 hours ago",
      location: "Building B",
      system: "Energy",
    },
    {
      id: 6,
      severity: "info",
      message: "New firmware update available for access control system",
      time: "3 hours ago",
      location: "Building C",
      system: "Access",
    },
  ]
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Warning</Badge>
      case "info":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Info</Badge>
      case "success":
        return <Badge variant="outline" className="border-green-500 text-green-500">Success</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  const getSystemAvatar = (system: string) => {
    const colors: Record<string, string> = {
      "HVAC": "bg-blue-500",
      "Cooling": "bg-cyan-500",
      "Network": "bg-indigo-500",
      "Elevators": "bg-emerald-500",
      "Energy": "bg-amber-500",
      "Access": "bg-violet-500",
    }
    
    return (
      <Avatar className="h-9 w-9">
        <AvatarFallback className={colors[system] || "bg-gray-500"}>
          {system.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
    )
  }
  
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-4">
            {getSystemAvatar(alert.system)}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {getSeverityIcon(alert.severity)}
                <p className="text-sm font-medium leading-none">{alert.message}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{alert.location}</span>
                <span>•</span>
                <span>{alert.system}</span>
                <span>•</span>
                <span>{alert.time}</span>
              </div>
            </div>
            <div>
              {getSeverityBadge(alert.severity)}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}