"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Props = {
  label: string
  value: string | number
  hint?: string
  className?: string
  children?: React.ReactNode
}

export function StatCard({ label, value, hint, className, children }: Props) {
  return (
    <Card className={cn("flex items-center justify-between rounded-xl border-border/50  p-4", className)}>
      <div className="flex flex-col gap-1">
        <span className="text-sm ">{label}</span>
        <span className="text-2xl font-semibold">{value}</span>
        {hint ? <span className="text-xs ">{hint}</span> : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </Card>
  )
}
