"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Button } from "@/shadcn/ui/button"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Calendar, Download, Filter, BarChart3, PieChart as PieChartIcon, TrendingUp, Clock } from "lucide-react"
import { DatePickerWithRange } from "@/shadcn/ui/date-range-picker"
import { Badge } from "@/shadcn/ui/badge"

// Sample data - this would come from your API in a real application
const hourlyData = [
  { time: "00:00", hvac: 42, lighting: 18, plugLoad: 14, other: 8 },
  { time: "03:00", hvac: 38, lighting: 12, plugLoad: 12, other: 7 },
  { time: "06:00", hvac: 45, lighting: 25, plugLoad: 16, other: 9 },
  { time: "09:00", hvac: 68, lighting: 36, plugLoad: 28, other: 12 },
  { time: "12:00", hvac: 72, lighting: 38, plugLoad: 30, other: 15 },
  { time: "15:00", hvac: 78, lighting: 40, plugLoad: 32, other: 14 },
  { time: "18:00", hvac: 65, lighting: 35, plugLoad: 27, other: 11 },
  { time: "21:00", hvac: 50, lighting: 30, plugLoad: 22, other: 10 },
]

const dailyData = [
  { day: "Mon", hvac: 580, lighting: 320, plugLoad: 240, other: 120 },
  { day: "Tue", hvac: 600, lighting: 340, plugLoad: 260, other: 130 },
  { day: "Wed", hvac: 620, lighting: 350, plugLoad: 270, other: 140 },
  { day: "Thu", hvac: 590, lighting: 330, plugLoad: 250, other: 125 },
  { day: "Fri", hvac: 570, lighting: 310, plugLoad: 230, other: 115 },
  { day: "Sat", hvac: 490, lighting: 270, plugLoad: 190, other: 95 },
  { day: "Sun", hvac: 450, lighting: 250, plugLoad: 170, other: 85 },
]

const monthlyData = [
  { month: "Jan", hvac: 15200, lighting: 8400, plugLoad: 6300, other: 3150 },
  { month: "Feb", hvac: 14800, lighting: 8200, plugLoad: 6100, other: 3050 },
  { month: "Mar", hvac: 14600, lighting: 8100, plugLoad: 6000, other: 3000 },
  { month: "Apr", hvac: 15400, lighting: 8500, plugLoad: 6400, other: 3200 },
  { month: "May", hvac: 16800, lighting: 9300, plugLoad: 7000, other: 3500 },
  { month: "Jun", hvac: 18200, lighting: 10100, plugLoad: 7600, other: 3800 },
]

const distributionData = [
  { name: "HVAC", value: 58, color: "hsl(var(--chart-1))" },
  { name: "Lighting", value: 22, color: "hsl(var(--chart-2))" },
  { name: "Plug Load", value: 14, color: "hsl(var(--chart-3))" },
  { name: "Other", value: 6, color: "hsl(var(--chart-4))" },
]

const comparisonData = [
  {
    name: "Building A",
    current: 18.5,
    previous: 20.8,
    target: 17.0,
  },
  {
    name: "Building B",
    current: 15.2,
    previous: 16.5,
    target: 14.5,
  },
  {
    name: "Building C",
    current: 12.8,
    previous: 13.5,
    target: 12.0,
  },
  {
    name: "Building D",
    current: 16.4,
    previous: 16.9,
    target: 15.0,
  },
]

export function EnergyAnalytics() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
  const [timeframe, setTimeframe] = useState("daily")
  const [building, setBuilding] = useState("all")

  const handleDateRangeChange = (range) => {
    setDateRange(range)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Energy Analytics</h2>
          <p className="text-muted-foreground">
            Monitor and analyze energy consumption across your buildings
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
      
      {/* Controls Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <DatePickerWithRange 
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <Select value={building} onValueChange={setBuilding}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  <SelectItem value="building-a">Building A</SelectItem>
                  <SelectItem value="building-b">Building B</SelectItem>
                  <SelectItem value="building-c">Building C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="consumption" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="comparison">Building Comparison</TabsTrigger>
          <TabsTrigger value="savings">Savings Opportunities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="consumption" className="space-y-4">
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Energy Consumption Over Time</CardTitle>
                  <CardDescription>
                    Energy usage breakdown by category
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-normal">
                  {timeframe === 'hourly' ? 'kWh' : timeframe === 'daily' ? 'kWh/day' : 'kWh/month'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={
                    timeframe === 'hourly' 
                      ? hourlyData 
                      : timeframe === 'daily' 
                        ? dailyData 
                        : monthlyData
                  }
                  stackOffset="none"
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey={
                      timeframe === 'hourly' 
                        ? 'time' 
                        : timeframe === 'daily' 
                          ? 'day' 
                          : 'month'
                    } 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}`}
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
                    dataKey="hvac" 
                    name="HVAC" 
                    stackId="a" 
                    fill="hsl(var(--chart-1))" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="lighting" 
                    name="Lighting" 
                    stackId="a" 
                    fill="hsl(var(--chart-2))" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="plugLoad" 
                    name="Plug Load" 
                    stackId="a" 
                    fill="hsl(var(--chart-3))" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="other" 
                    name="Other" 
                    stackId="a" 
                    fill="hsl(var(--chart-4))" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Energy Trends</CardTitle>
                <CardDescription>
                  Month-over-month energy usage trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                      formatter={(value) => [`${value.toLocaleString()} kWh`, undefined]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="hvac" 
                      name="HVAC" 
                      stroke="hsl(var(--chart-1))" 
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lighting" 
                      name="Lighting" 
                      stroke="hsl(var(--chart-2))" 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Consumption Summary</CardTitle>
                <CardDescription>
                  Total energy usage for selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xl font-bold">132,450 kWh</div>
                    <p className="text-sm text-muted-foreground">Total consumption</p>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <span className="font-medium">↓ 8.2%</span>
                      <span className="ml-1">vs previous period</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xl font-bold">$15,894</div>
                    <p className="text-sm text-muted-foreground">Estimated cost</p>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <span className="font-medium">↓ 7.5%</span>
                      <span className="ml-1">vs previous period</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xl font-bold">65.3 kBtu/ft²</div>
                    <p className="text-sm text-muted-foreground">Energy intensity</p>
                    <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                      <span className="font-medium">→ 0.2%</span>
                      <span className="ml-1">vs target</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xl font-bold">48.2 tons</div>
                    <p className="text-sm text-muted-foreground">CO₂ emissions</p>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <span className="font-medium">↓ 9.7%</span>
                      <span className="ml-1">vs previous period</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Energy Distribution by Category</CardTitle>
                <CardDescription>
                  Breakdown of energy consumption by system type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[300px] items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                        formatter={(value) => [`${value}%`, undefined]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Breakdown</CardTitle>
                <CardDescription>
                  Detailed view of energy consumption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {distributionData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{(item.value * 1325.5).toFixed(0)} kWh</span>
                        <span>${(item.value * 159).toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Building Energy Performance Comparison</CardTitle>
              <CardDescription>
                Comparing current vs previous period and target values (kWh/ft²)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={comparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="previous"
                    name="Previous Period"
                    fill="hsl(var(--muted-foreground))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="current"
                    name="Current Period"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="target"
                    name="Target"
                    fill="hsl(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="savings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Savings Opportunities</CardTitle>
                <CardDescription>
                  Potential energy and cost savings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">HVAC Scheduling Optimization</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Adjust operating schedules based on occupancy patterns
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                        High Impact
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">15,400 kWh</div>
                        <p className="text-xs text-muted-foreground">Annual savings</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium">$1,848</div>
                        <p className="text-xs text-muted-foreground">Cost savings</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Lighting Controls Upgrade</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Install occupancy sensors and daylight harvesting
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300">
                        Medium Impact
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">8,200 kWh</div>
                        <p className="text-xs text-muted-foreground">Annual savings</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium">$984</div>
                        <p className="text-xs text-muted-foreground">Cost savings</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>
                  Return on investment for energy efficiency measures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="year"
                      type="category"
                      allowDuplicatedCategory={false}
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(var(--chart-1))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}k`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--chart-2))"
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
                      yAxisId="left"
                      type="monotone"
                      dataKey="investment"
                      name="Investment"
                      stroke="hsl(var(--chart-1))"
                      activeDot={{ r: 6 }}
                      data={[
                        { year: "Year 0", investment: 15 },
                        { year: "Year 1", investment: 10 },
                        { year: "Year 2", investment: 5 },
                        { year: "Year 3", investment: 0 },
                        { year: "Year 4", investment: -5 },
                        { year: "Year 5", investment: -10 },
                      ]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="roi"
                      name="ROI"
                      stroke="hsl(var(--chart-2))"
                      activeDot={{ r: 6 }}
                      data={[
                        { year: "Year 0", roi: 0 },
                        { year: "Year 1", roi: 15 },
                        { year: "Year 2", roi: 45 },
                        { year: "Year 3", roi: 85 },
                        { year: "Year 4", roi: 115 },
                        { year: "Year 5", roi: 145 },
                      ]}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm">
                  <div className="font-medium">Project Summary:</div>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>• Initial investment: $15,000</li>
                    <li>• Annual savings: $2,832</li>
                    <li>• Simple payback: 5.3 years</li>
                    <li>• 5-year ROI: 145%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}