"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Activity, Search, Download, AlertTriangle, CheckCircle, Clock, FileText, Upload } from "lucide-react"

export default function ActivityMonitoringPage() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Button variant="outline" className="ml-auto">
          <Upload className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              Current users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Monitoring coverage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="access">Access Patterns</TabsTrigger>
          <TabsTrigger value="violations">Policy Violations</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search activity..." className="pl-8" />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        File Access
                      </div>
                    </TableCell>
                    <TableCell>john.smith</TableCell>
                    <TableCell>confidential.pdf</TableCell>
                    <TableCell>View</TableCell>
                    <TableCell>2 mins ago</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Authorized
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        System Login
                      </div>
                    </TableCell>
                    <TableCell>sarah.jones</TableCell>
                    <TableCell>VPN Access</TableCell>
                    <TableCell>Login</TableCell>
                    <TableCell>5 mins ago</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Unusual Location
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Investigate</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Access Pattern Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Resource Type</TableHead>
                    <TableHead>Access Frequency</TableHead>
                    <TableHead>Last Access</TableHead>
                    <TableHead>Pattern</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">john.smith</TableCell>
                    <TableCell>Financial Data</TableCell>
                    <TableCell>Daily</TableCell>
                    <TableCell>10 mins ago</TableCell>
                    <TableCell>
                      <Badge variant="default">Normal</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Low</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View History</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations">
          <Card>
            <CardHeader>
              <CardTitle>Policy Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Violation Type</TableHead>
                    <TableHead>Detected</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Data Access Policy
                      </div>
                    </TableCell>
                    <TableCell>mark.wilson</TableCell>
                    <TableCell>Unauthorized Access</TableCell>
                    <TableCell>1 hour ago</TableCell>
                    <TableCell>
                      <Badge variant="destructive">High</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Under Review
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Investigate</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Triggered</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Multiple Failed Logins
                      </div>
                    </TableCell>
                    <TableCell>Auth System</TableCell>
                    <TableCell>Security</TableCell>
                    <TableCell>5 mins ago</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Critical</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Respond</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}