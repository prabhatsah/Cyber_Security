"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, CheckCircle, Bell, Activity } from "lucide-react"

const performanceData = [
  { name: "Jan", value: 98.2 },
  { name: "Feb", value: 99.1 },
  { name: "Mar", value: 98.9 },
  { name: "Apr", value: 99.3 },
  { name: "May", value: 98.7 },
  { name: "Jun", value: 99.2 },
]

export default function MonitoringPage() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245ms</div>
            <p className="text-xs text-muted-foreground">
              -12ms from average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              CPU & Memory
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[95, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      High CPU Usage
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">Critical</Badge>
                  </TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Investigate</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-yellow-500" />
                      Memory Usage Warning
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>Warning</Badge>
                  </TableCell>
                  <TableCell>Investigating</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      Network Latency
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Info</Badge>
                  </TableCell>
                  <TableCell>Monitoring</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Last Incident</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Authentication Service</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Operational
                  </div>
                </TableCell>
                <TableCell>99.9%</TableCell>
                <TableCell>15 days ago</TableCell>
                <TableCell>120ms</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Metrics</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Database Cluster</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Operational
                  </div>
                </TableCell>
                <TableCell>99.95%</TableCell>
                <TableCell>30 days ago</TableCell>
                <TableCell>85ms</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Metrics</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">API Gateway</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Degraded
                  </div>
                </TableCell>
                <TableCell>98.5%</TableCell>
                <TableCell>2 hours ago</TableCell>
                <TableCell>245ms</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Metrics</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}