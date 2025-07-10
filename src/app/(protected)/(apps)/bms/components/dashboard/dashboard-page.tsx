"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Overview } from "./overview"
import { RecentAlerts } from "./recent-alerts"
import { BuildingMetrics } from "./building-metrics"
import { Button } from "@/shadcn/ui/button"
import { Plus, Settings } from "lucide-react"
import { BuildingsList } from "./buildings-list"

export function DashboardPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Customize
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Building
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="buildings">Buildings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Buildings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  2 added this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  3 critical, 4 warnings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">BACnet Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">347</div>
                <p className="text-xs text-muted-foreground">
                  12 offline, 335 online
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,347</div>
                <p className="text-xs text-muted-foreground">
                  4,982 monitored actively
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Building Performance Overview</CardTitle>
                <CardDescription>
                  Energy usage and system performance across all buildings
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>
                  Last 24 hours system notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentAlerts />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Building Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators across properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BuildingMetrics />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Status of connected systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        {/* <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div> */}
                        <span>HVAC Systems</span>
                      </div>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "98%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Lighting Controls</span>
                      </div>
                      <span className="font-medium">100%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-amber-500"></div>
                        <span>Access Control</span>
                      </div>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-amber-500" style={{ width: "87%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                        <span>Fire Safety</span>
                      </div>
                      <span className="font-medium">76%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-red-500" style={{ width: "76%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Energy Monitoring</span>
                      </div>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="buildings" className="space-y-4">
          <BuildingsList />
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View detailed analytics across all buildings and systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and view reports on building performance and system status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reports content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}