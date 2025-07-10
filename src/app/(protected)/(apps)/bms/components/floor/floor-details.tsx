"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Button } from "@/shadcn/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts"
import { 
  Download, 
  Filter, 
  TrendingUp, 
  Calendar,
  Thermometer,
  Users,
  Lightbulb,
  Lock,
  AlertTriangle,
  Settings,
  Share2,
  BarChart3,
  Activity,
  Brain,
  History,
  Gauge
} from "lucide-react"
import { DatePickerWithRange } from "@/shadcn/ui/date-range-picker"
import { Badge } from "@/shadcn/ui/badge"

const temperatureData = [
  { time: "00:00", zone1: 72, zone2: 71, zone3: 73 },
  { time: "04:00", zone1: 71, zone2: 70, zone3: 72 },
  { time: "08:00", zone1: 73, zone2: 72, zone3: 74 },
  { time: "12:00", zone1: 75, zone2: 74, zone3: 76 },
  { time: "16:00", zone1: 76, zone2: 75, zone3: 77 },
  { time: "20:00", zone1: 74, zone2: 73, zone3: 75 },
]

const occupancyData = [
  { time: "00:00", actual: 10, predicted: 12 },
  { time: "04:00", actual: 5, predicted: 6 },
  { time: "08:00", actual: 45, predicted: 42 },
  { time: "12:00", actual: 85, predicted: 80 },
  { time: "16:00", actual: 75, predicted: 78 },
  { time: "20:00", actual: 25, predicted: 28 },
]

const energyData = [
  { category: "HVAC", actual: 450, baseline: 500, target: 400 },
  { category: "Lighting", actual: 280, baseline: 300, target: 250 },
  { category: "Plug Load", actual: 180, baseline: 200, target: 150 },
  { category: "Other", actual: 90, baseline: 100, target: 80 },
]

interface FloorDetailsProps {
  buildingId: string
  floorId: string
}

export function FloorDetails({ buildingId, floorId }: FloorDetailsProps) {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
  const [selectedMetric, setSelectedMetric] = useState("temperature")
  const [selectedZone, setSelectedZone] = useState("all")
  
  const systemStatuses = [
    {
      name: "HVAC",
      icon: Thermometer,
      status: "normal",
      value: "72°F avg",
      change: "-0.5°F",
    },
    {
      name: "Lighting",
      icon: Lightbulb,
      status: "normal",
      value: "80% brightness",
      change: "+5%",
    },
    {
      name: "Occupancy",
      icon: Users,
      status: "warning",
      value: "85% capacity",
      change: "+15%",
    },
    {
      name: "Security",
      icon: Lock,
      status: "normal",
      value: "All secured",
      change: "No changes",
    },
  ]
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-500"
      case "warning":
        return "text-amber-500"
      case "error":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Floor 1</h2>
          <p className="text-muted-foreground">
            Detailed floor monitoring and analysis
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
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStatuses.map((system) => (
          <Card key={system.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full bg-primary/10 ${getStatusColor(system.status)}`}>
                    <system.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{system.name}</p>
                    <p className="text-sm text-muted-foreground">{system.value}</p>
                  </div>
                </div>
                <div className={`text-sm ${system.change.startsWith("+") ? "text-red-500" : system.change.startsWith("-") ? "text-green-500" : ""}`}>
                  {system.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="zone1">Zone 1</SelectItem>
                  <SelectItem value="zone2">Zone 2</SelectItem>
                  <SelectItem value="zone3">Zone 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Temperature Trends</CardTitle>
                <CardDescription>
                  Zone temperature variations over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}°F`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="zone1"
                      name="Zone 1"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="zone2"
                      name="Zone 2"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="zone3"
                      name="Zone 3"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Energy Consumption</CardTitle>
                <CardDescription>
                  Current vs baseline and target
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="category" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value} kWh`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="actual" 
                      name="Actual" 
                      fill="hsl(var(--chart-1))" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="baseline" 
                      name="Baseline" 
                      fill="hsl(var(--chart-2))" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="target" 
                      name="Target" 
                      fill="hsl(var(--chart-3))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historical Trend Analysis</CardTitle>
                  <CardDescription>
                    Long-term performance patterns and anomalies
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <History className="mr-2 h-4 w-4" />
                    Compare Periods
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="mr-2 h-4 w-4" />
                    View Patterns
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual Occupancy"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Predicted Occupancy"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI-Powered Predictions</CardTitle>
                  <CardDescription>
                    Machine learning forecasts and optimization suggestions
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Brain className="mr-2 h-4 w-4" />
                    Retrain Model
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Accuracy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Occupancy Prediction</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Expected peak occupancy of 87% between 1:00 PM and 3:00 PM today
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        95% Confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Thermometer className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Temperature Optimization</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended pre-cooling starting at 10:30 AM to optimize energy usage
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        12% Potential Savings
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Lighting Schedule</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Suggested adjustment to lighting schedule based on occupancy patterns
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        8% Potential Savings
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Alerts</CardTitle>
                  <CardDescription>
                    Current issues and notifications for this floor
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Manage Alerts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border bg-amber-50 dark:bg-amber-900/20 p-4">
                  <div className="flex items-start space-x-4">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-900 dark:text-amber-400">High Occupancy Warning</h4>
                      <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                        Zone 2 occupancy is approaching maximum capacity (85%)
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-amber-700 dark:text-amber-300">2 minutes ago</span>
                        <Button variant="outline" size="sm" className="h-7">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start space-x-4">
                    <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Temperature Deviation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Zone 1 temperature is 2°F above setpoint
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">15 minutes ago</span>
                        <Button variant="outline" size="sm" className="h-7">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start space-x-4">
                    <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Maintenance Reminder</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        VAV box filter replacement due in 5 days
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">1 hour ago</span>
                        <Button variant="outline" size="sm" className="h-7">
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}