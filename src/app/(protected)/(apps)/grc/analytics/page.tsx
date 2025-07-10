"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/shadcn/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Button } from "@/shadcn/ui/button"
import { ArrowDown, ArrowUp, Download } from "lucide-react"
import { Overview } from "../components/dashboard/overview"
import { RecentAudits } from "../components/dashboard/recent-audits"

const complianceData = [
  { month: "Jan", rate: 82 },
  { month: "Feb", rate: 85 },
  { month: "Mar", rate: 88 },
  { month: "Apr", rate: 85 },
  { month: "May", rate: 90 },
  { month: "Jun", rate: 92 }
]

const riskData = [
  { category: "High", count: 5 },
  { category: "Medium", count: 12 },
  { category: "Low", count: 8 }
]

const trendsData = [
  { name: "Access Control", current: 95, previous: 88 },
  { name: "Data Protection", current: 88, previous: 85 },
  { name: "Security Training", current: 92, previous: 85 },
  { name: "Incident Response", current: 85, previous: 90 },
  { name: "Asset Management", current: 90, previous: 87 }
]

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+2</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">-3</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Medium</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">Improved</span>
              <span className="ml-1">from High</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+5%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentAudits />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Current Score</TableHead>
                <TableHead>Previous Score</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendsData.map((trend) => {
                const change = trend.current - trend.previous
                return (
                  <TableRow key={trend.name}>
                    <TableCell className="font-medium">{trend.name}</TableCell>
                    <TableCell>{trend.current}%</TableCell>
                    <TableCell>{trend.previous}%</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {change > 0 ? (
                          <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                        )}
                        {Math.abs(change)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trend.current >= 90 ? "default" : "secondary"}>
                        {trend.current >= 90 ? "Excellent" : "Good"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}