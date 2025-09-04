"use client"

import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts"

type Item = { name: string; value: number }

const COLORS: Record<string, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#f59e0b",
  LOW: "#10b981",
}

export function SeverityDonut({ data }: { data: Item[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="relative h-44 w-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={48}
            outerRadius={72}
            stroke="rgba(255,255,255,0.08)"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#64748b"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 8,
              color: "white",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold">{total}</div>
          <div className="text-xs text-muted-foreground">Issues</div>
        </div>
      </div>
    </div>
  )
}
