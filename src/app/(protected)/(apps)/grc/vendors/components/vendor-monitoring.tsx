"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"

const riskData = [
  { date: "2024-01", score: 82 },
  { date: "2024-02", score: 85 },
  { date: "2024-03", score: 79 },
  { date: "2024-04", score: 88 },
  { date: "2024-05", score: 85 },
  { date: "2024-06", score: 91 }
]

const alerts = [
  {
    id: "1",
    title: "Compliance Certificate Expiring",
    vendor: "Cloud Services Inc",
    severity: "High",
    date: "2024-04-15"
  },
  {
    id: "2",
    title: "Service Level Degradation",
    vendor: "SecureData Solutions",
    severity: "Medium",
    date: "2024-03-28"
  }
]

export function VendorMonitoring() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Risk Score Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
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
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{alert.title}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {alert.vendor} • Due {alert.date}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    alert.severity === "High" ? "destructive" :
                    alert.severity === "Medium" ? "default" :
                    "secondary"
                  }>
                    {alert.severity}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Uptime</div>
                  <div className="text-2xl font-bold">99.9%</div>
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Response Time</div>
                  <div className="text-2xl font-bold">250ms</div>
                </div>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Required Certifications</div>
                  <div className="text-2xl font-bold">8/10</div>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Policy Compliance</div>
                  <div className="text-2xl font-bold">95%</div>
                </div>
                <Badge variant="default">Compliant</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}