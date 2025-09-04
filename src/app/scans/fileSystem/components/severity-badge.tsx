import { Badge } from "@/components/ui/badge"

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN"

export function SeverityBadge({ severity, value }: { severity: Severity, value: number }) {
  const map: Record<Severity, string> = {
    CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
    HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    LOW: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    UNKNOWN: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  }
  const spanMap: Record<Severity, string> = {
    CRITICAL: "bg-red-500/30 text-white ms-2 px-1 rounded-full",
    HIGH: "bg-orange-500/30 text-white ms-2 px-1 rounded-full",
    MEDIUM: "bg-yellow-500/30 text-white ms-2 px-1 rounded-full",
    LOW: "bg-emerald-500/30 text-white ms-2 px-1 rounded-full",
    UNKNOWN: "bg-slate-500/30 text-white ms-2 px-1 rounded-full",
  }
  return (
    <Badge variant="outline" className={`rounded-full px-2 py-1 text-xs ${map[severity]}`}>
      {severity}
      <span className={`${spanMap[severity]}`}>{value}</span>
    </Badge>
  )
}
