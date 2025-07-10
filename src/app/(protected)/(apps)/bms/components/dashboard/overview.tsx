"use client"

import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  LineChart,
  Line
} from "recharts"

const data = [
  {
    month: "Jan",
    hvac: 3400,
    lighting: 2400,
    other: 1200,
  },
  {
    month: "Feb",
    hvac: 3000,
    lighting: 2210,
    other: 1290,
  },
  {
    month: "Mar",
    hvac: 2800,
    lighting: 2290,
    other: 1100,
  },
  {
    month: "Apr",
    hvac: 2780,
    lighting: 2000,
    other: 940,
  },
  {
    month: "May",
    hvac: 3090,
    lighting: 2181,
    other: 1220,
  },
  {
    month: "Jun",
    hvac: 3490,
    lighting: 2500,
    other: 1300,
  },
  {
    month: "Jul",
    hvac: 3870,
    lighting: 2570,
    other: 1380,
  },
  {
    month: "Aug",
    hvac: 3700,
    lighting: 2400,
    other: 1250,
  },
  {
    month: "Sep",
    hvac: 3500,
    lighting: 2210,
    other: 1100,
  },
  {
    month: "Oct",
    hvac: 3200,
    lighting: 2300,
    other: 1240,
  },
  {
    month: "Nov",
    hvac: 3000,
    lighting: 2100,
    other: 1100,
  },
  {
    month: "Dec",
    hvac: 3200,
    lighting: 2400,
    other: 1290,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorHvac" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorLighting" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="month" 
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
          tickFormatter={(value) => `${value}kWh`}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
        <Area
          type="monotone"
          dataKey="hvac"
          stroke="hsl(var(--chart-1))"
          fillOpacity={1}
          fill="url(#colorHvac)"
          name="HVAC"
        />
        <Area
          type="monotone"
          dataKey="lighting"
          stroke="hsl(var(--chart-2))"
          fillOpacity={1}
          fill="url(#colorLighting)"
          name="Lighting"
        />
        <Area
          type="monotone"
          dataKey="other"
          stroke="hsl(var(--chart-3))"
          fillOpacity={1}
          fill="url(#colorOther)"
          name="Other Systems"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}