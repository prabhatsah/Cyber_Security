"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Button } from "@/shadcn/ui/button"
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Building, Calendar, Download, Filter, TrendingUp, ArrowUpRight, ArrowDownRight, Thermometer, Users, Gauge, Zap } from "lucide-react"
import { DatePickerWithRange } from "@/shadcn/ui/date-range-picker"
import { Badge } from "@/shadcn/ui/badge"
import { ScrollArea } from "@/shadcn/ui/scroll-area"

const temperatureData = [
  { time: "00:00", floor1: 72, floor2: 71, floor3: 73 },
  { time: "04:00", floor1: 71, floor2: 70, floor3: 72 },
  { time: "08:00", floor1: 73, floor2: 72, floor3: 74 },
  { time: "12:00", floor1: 75, floor2: 74, floor3: 76 },
  { time: "16:00", floor1: 76, floor2: 75, floor3: 77 },
  { time: "20:00", floor1: 74, floor2: 73, floor3: 75 },
]

const occupancyData = [
  { time: "00:00", floor1: 10, floor2: 5, floor3: 8 },
  { time: "04:00", floor1: 5, floor2: 3, floor3: 4 },
  { time: "08:00", floor1: 45, floor2: 40, floor3: 42 },
  { time: "12:00", floor1: 85, floor2: 80, floor3: 82 },
  { time: "16:00", floor1: 75, floor2: 70, floor3: 72 },
  { time: "20:00", floor1: 25, floor2: 20, floor3: 22 },
]

const energyData = [
  { time: "00:00", floor1: 42, floor2: 38, floor3: 40 },
  { time: "04:00", floor1: 38, floor2: 35, floor3: 36 },
  { time: "08:00", floor1: 85, floor2: 80, floor3: 82 },
  { time: "12:00", floor1: 95, floor2: 90, floor3: 92 },
  { time: "16:00", floor1: 88, floor2: 85, floor3: 86 },
  { time: "20:00", floor1: 55, floor2: 50, floor3: 52 },
]

const floorMetrics = [
  {
    floor: "Floor 1",
    temperature: "74°F",
    tempChange: "+2°F",
    occupancy: "85%",
    occupancyChange: "+5%",
    energy: "95 kW",
    energyChange: "+10%",
    comfort: "92%",
    comfortChange: "-2%",
  },
  {
    floor: "Floor 2",
    temperature: "73°F",
    tempChange: "+1°F",
    occupancy: "80%",
    occupancyChange: "+3%",
    energy: "90 kW",
    energyChange: "+8%",
    comfort: "94%",
    comfortChange: "+1%",
  },
  {
    floor: "Floor 3",
    temperature: "75°F",
    tempChange: "+3°F",
    occupancy: "82%",
    occupancyChange: "+4%",
    energy: "92 kW",
    energyChange: "+9%",
    comfort: "90%",
    comfortChange: "-3%",
  },
]

export function FloorOverview() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
  const [selectedMetric, setSelectedMetric] = useState("temperature")
  const [selectedFloor, setSelectedFloor] = useState("all")
  
  const getMetricData = () => {
    switch (selectedMetric) {
      case "temperature":
        return temperatureData
      case "occupancy":
        return occupancyData
      case "energy":
        return energyData
      default:
        return temperatureData
    }
  }
  
  const getMetricUnit = () => {
    switch (selectedMetric) {
      case "temperature":
        return "°F"
      case "occupancy":
        return "%"
      case "energy":
        return "kW"
      default:
        return ""
    }
  }
  
  const getChangeColor = (change: string) => {
    if (change.startsWith("+")) return "text-red-500"
    if (change.startsWith("-")) return "text-green-500"
    return "text-muted-foreground"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Floor Overview</h2>
          <p className="text-muted-foreground">
            Consolidated view and trend analysis across all floors
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <DatePickerWithRange 
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Gauge className="h-5 w-5 text-muted-foreground" />
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="occupancy">Occupancy</SelectItem>
                  <SelectItem value="energy">Energy Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Building className="h-5 w-5 text-muted-foreground" />
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  <SelectItem value="floor1">Floor 1</SelectItem>
                  <SelectItem value="floor2">Floor 2</SelectItem>
                  <SelectItem value="floor3">Floor 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-12">
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>
              Compare metrics across different floors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={getMetricData()}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}${getMetricUnit()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => [`${value}${getMetricUnit()}`, undefined]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="floor1"
                  name="Floor 1"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="floor2"
                  name="Floor 2"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="floor3"
                  name="Floor 3"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Floor Metrics</CardTitle>
            <CardDescription>
              Current status and changes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[350px]">
              {floorMetrics.map((floor, index) => (
                <div
                  key={floor.floor}
                  className={`p-4 ${
                    index !== floorMetrics.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">{floor.floor}</h4>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{floor.temperature}</span>
                      </div>
                      <div className={`text-xs ${getChangeColor(floor.tempChange)}`}>
                        {floor.tempChange}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{floor.occupancy}</span>
                      </div>
                      <div className={`text-xs ${getChangeColor(floor.occupancyChange)}`}>
                        {floor.occupancyChange}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{floor.energy}</span>
                      </div>
                      <div className={`text-xs ${getChangeColor(floor.energyChange)}`}>
                        {floor.energyChange}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{floor.comfort}</span>
                      </div>
                      <div className={`text-xs ${getChangeColor(floor.comfortChange)}`}>
                        {floor.comfortChange}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}