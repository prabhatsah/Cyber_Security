"use client"

import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface ChartProps {
  children: React.ReactNode
  height?: number
}

export function Chart({ children, height = 350 }: ChartProps) {
  return (
    <div className="w-full touch-scroll mobile-scroll">
      <div style={{ minWidth: '600px', height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

Chart.Grid = function ChartGrid() {
  return (
    <CartesianGrid 
      strokeDasharray="3 3" 
      stroke="hsl(var(--border))"
      vertical={true}
      horizontal={true}
    />
  )
}

Chart.XAxis = function ChartXAxis(props: any) {
  return (
    <XAxis
      {...props}
      stroke="hsl(var(--foreground))"
      fontSize={12}
      tickLine={false}
      axisLine={{ stroke: "hsl(var(--border))" }}
      tick={{ fill: "hsl(var(--foreground))" }}
      dy={10}
      interval="preserveStartEnd"
      minTickGap={20}
    />
  )
}

Chart.YAxis = function ChartYAxis(props: any) {
  return (
    <YAxis
      {...props}
      stroke="hsl(var(--foreground))"
      fontSize={12}
      tickLine={false}
      axisLine={{ stroke: "hsl(var(--border))" }}
      tick={{ fill: "hsl(var(--foreground))" }}
      dx={-10}
      width={40}
    />
  )
}

Chart.Tooltip = function ChartTooltip(props: any) {
  return (
    <Tooltip
      {...props}
      contentStyle={{
        backgroundColor: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
        padding: "8px 12px"
      }}
      labelStyle={{
        color: "hsl(var(--foreground))",
        fontWeight: 500,
        marginBottom: 4
      }}
      itemStyle={{
        color: "hsl(var(--foreground))",
        fontSize: 12
      }}
      wrapperStyle={{
        zIndex: 1000
      }}
    />
  )
}

Chart.Legend = function ChartLegend(props: any) {
  return (
    <Legend
      {...props}
      wrapperStyle={{
        paddingTop: 20,
        fontSize: 12,
        color: "hsl(var(--foreground))"
      }}
      formatter={(value: string) => (
        <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
      )}
    />
  )
}