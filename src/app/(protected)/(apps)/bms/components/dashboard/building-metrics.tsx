"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  {
    name: "Building A",
    hvacEfficiency: 90,
    lightingEfficiency: 85,
    occupancyRate: 78,
  },
  {
    name: "Building B",
    hvacEfficiency: 85,
    lightingEfficiency: 92,
    occupancyRate: 82,
  },
  {
    name: "Building C",
    hvacEfficiency: 78,
    lightingEfficiency: 88,
    occupancyRate: 69,
  },
  {
    name: "Building D",
    hvacEfficiency: 92,
    lightingEfficiency: 94,
    occupancyRate: 86,
  },
]

export function BuildingMetrics() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="name" 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
          itemStyle={{
            fontSize: '12px',
          }}
          labelStyle={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '4px',
          }}
        />
        <Legend
          wrapperStyle={{
            fontSize: '12px',
            paddingTop: '10px',
          }}
        />
        <Bar 
          dataKey="hvacEfficiency" 
          name="HVAC Efficiency" 
          fill="hsl(var(--chart-1))" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          dataKey="lightingEfficiency" 
          name="Lighting Efficiency" 
          fill="hsl(var(--chart-2))" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          dataKey="occupancyRate" 
          name="Occupancy Rate" 
          fill="hsl(var(--chart-4))" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}