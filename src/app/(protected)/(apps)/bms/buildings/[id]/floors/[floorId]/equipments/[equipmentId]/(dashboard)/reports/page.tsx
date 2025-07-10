"use client"

import { useState } from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Calendar, Download, FileText, Filter, Printer, Share2 } from "lucide-react"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"
import EnergyChart from "./energy-chart"
import EBarChartComponent from "../../(dashboard)/eChartsMultipleSeries/multiple-series-bar-chart"

// Mock data for energy consumption report
const energyData = [
  { month: "Jan", hvac: 4200, lighting: 2400, equipment: 1800, total: 8400 },
  { month: "Feb", hvac: 3800, lighting: 2100, equipment: 1700, total: 7600 },
  { month: "Mar", hvac: 3600, lighting: 2000, equipment: 1600, total: 7200 },
  { month: "Apr", hvac: 3200, lighting: 1800, equipment: 1500, total: 6500 },
  { month: "May", hvac: 3000, lighting: 1700, equipment: 1400, total: 6100 },
  { month: "Jun", hvac: 3500, lighting: 1900, equipment: 1600, total: 7000 },
  { month: "Jul", hvac: 4100, lighting: 2200, equipment: 1800, total: 8100 },
  { month: "Aug", hvac: 4300, lighting: 2300, equipment: 1900, total: 8500 },
  { month: "Sep", hvac: 3700, lighting: 2000, equipment: 1700, total: 7400 },
  { month: "Oct", hvac: 3400, lighting: 1900, equipment: 1600, total: 6900 },
  { month: "Nov", hvac: 3800, lighting: 2100, equipment: 1700, total: 7600 },
  { month: "Dec", hvac: 4100, lighting: 2300, equipment: 1800, total: 8200 },
]

// Mock data for maintenance report
const maintenanceData = [
  { name: "Completed", value: 68 },
  { name: "Scheduled", value: 22 },
  { name: "Overdue", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Mock data for recent reports
const recentReports = [
  { 
    id: 1, 
    title: "Monthly Energy Consumption", 
    date: "01/05/2025", 
    type: "Energy",
    author: "System"
  },
  { 
    id: 2, 
    title: "Quarterly Maintenance Summary", 
    date: "15/04/2025", 
    type: "Maintenance",
    author: "John Smith"
  },
  { 
    id: 3, 
    title: "Annual System Performance", 
    date: "31/03/2025", 
    type: "Performance",
    author: "System"
  },
  { 
    id: 4, 
    title: "Security Audit Report", 
    date: "15/03/2025", 
    type: "Security",
    author: "Sarah Johnson"
  },
  { 
    id: 5, 
    title: "Occupancy Analysis", 
    date: "28/02/2025", 
    type: "Occupancy",
    author: "System"
  },
]

export default function ReportsPage() {
  const [reportType, setReportType] = useState("energy")
  const [timeRange, setTimeRange] = useState("monthly")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="energy">Energy Consumption</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="occupancy">Occupancy</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="performance">System Performance</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          <span>Custom Range</span>
        </Button>
      </div>

      <Tabs defaultValue="view" className="space-y-4">
        <TabsList>
          <TabsTrigger value="view">View Reports</TabsTrigger>
          {/* <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger> */}
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          {reportType === "energy" && (
            <Card>
              <CardHeader>
                <CardTitle>Energy Consumption Report</CardTitle>
                <CardDescription>
                  Monthly energy usage by category (kWh)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                 
                  {/* <EnergyChart energyData={energyData} /> */}
                  <EBarChartComponent />
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-between text-sm text-muted-foreground">
                  <div>Total Annual Consumption: 89,500 kWh</div>
                  <div>Cost: $10,740</div>
                </div>
              </CardFooter>
            </Card>
          )}

          {reportType === "maintenance" && (
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Report</CardTitle>
                <CardDescription>
                  Status of maintenance tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={maintenanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {maintenanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Maintenance Summary</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Total Tasks</span>
                          <span className="font-medium">124</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Completed</span>
                          <span className="font-medium text-blue-500">84</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Scheduled</span>
                          <span className="font-medium text-green-500">28</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Overdue</span>
                          <span className="font-medium text-red-500">12</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Critical Issues</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• HVAC filter replacement (3 days overdue)</li>
                        <li>• Fire alarm system test (5 days overdue)</li>
                        <li>• Elevator inspection (scheduled for tomorrow)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(reportType !== "energy" && reportType !== "maintenance") && (
            <Card>
              <CardHeader>
                <CardTitle>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</CardTitle>
                <CardDescription>
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} report data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  {reportType.charAt(0).toUpperCase() + reportType.slice(1)} report data will be displayed here
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                  <div className="col-span-5">Report Name</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Author</div>
                  <div className="col-span-1">Actions</div>
                </div>
                <div className="divide-y">
                  {recentReports.map((report) => (
                    <div key={report.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-5 font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {report.title}
                      </div>
                      <div className="col-span-2">{report.type}</div>
                      <div className="col-span-2">{report.date}</div>
                      <div className="col-span-2">{report.author}</div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>
                Create custom reports based on system data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Report generation interface will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Manage automated report generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Scheduled reports management will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}