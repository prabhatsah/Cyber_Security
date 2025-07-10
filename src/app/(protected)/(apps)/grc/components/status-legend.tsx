import { Badge } from "@/shadcn/ui/badge"
import { statusColors } from "../lib/chart-theme"

interface StatusLegendProps {
  statuses: string[]
  className?: string
}

export function StatusLegend({ statuses, className }: StatusLegendProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {statuses.map(status => (
        <div key={status} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
          />
          <span className="text-sm text-muted-foreground">{status}</span>
        </div>
      ))}
    </div>
  )
}