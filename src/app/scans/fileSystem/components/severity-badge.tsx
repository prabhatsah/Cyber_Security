"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, AlertCircle, Info } from "lucide-react"

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN"

export function SeverityBadge({ severity }: { severity: Severity }) {
  const getSeverityConfig = (sev: Severity) => {
    switch (sev) {
      case "CRITICAL":
        return {
          icon: AlertTriangle,
          className: "bg-red-500 text-white border-red-600 hover:bg-red-600",
          label: "Critical"
        }
      case "HIGH":
        return {
          icon: AlertCircle,
          className: "bg-orange-500 text-white border-orange-600 hover:bg-orange-600",
          label: "High"
        }
      case "MEDIUM":
        return {
          icon: AlertCircle,
          className: "bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600",
          label: "Medium"
        }
      case "LOW":
        return {
          icon: Info,
          className: "bg-blue-500 text-white border-blue-600 hover:bg-blue-600",
          label: "Low"
        }
      default:
        return {
          icon: Shield,
          className: "bg-gray-500 text-white border-gray-600 hover:bg-gray-600",
          label: "Unknown"
        }
    }
  }

  const config = getSeverityConfig(severity)
  const IconComponent = config.icon

  return (
    <Badge className={`${config.className} flex items-center gap-1 px-2 py-1`}>
      <IconComponent className="h-3 w-3" />
      <span className="text-xs font-semibold">{config.label}</span>
    </Badge>
  )
}