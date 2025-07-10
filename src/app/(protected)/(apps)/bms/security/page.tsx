"use client"

import { useState } from "react"
import { 
  Shield, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Key, 
  FileText, 
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Search
} from "lucide-react"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Switch } from "@/shadcn/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"

// Mock security events data
const securityEvents = [
  { 
    id: 1, 
    event: "Failed login attempt", 
    user: "unknown", 
    ip: "192.168.1.45", 
    time: "10:23 AM", 
    date: "Today",
    severity: "warning"
  },
  { 
    id: 2, 
    event: "User account locked", 
    user: "john.smith@example.com", 
    ip: "192.168.1.101", 
    time: "09:15 AM", 
    date: "Today",
    severity: "warning"
  },
  { 
    id: 3, 
    event: "Password changed", 
    user: "admin@example.com", 
    ip: "192.168.1.10", 
    time: "04:32 PM", 
    date: "Yesterday",
    severity: "info"
  },
  { 
    id: 4, 
    event: "New user created", 
    user: "sarah.johnson@example.com", 
    ip: "192.168.1.10", 
    time: "11:47 AM", 
    date: "Yesterday",
    severity: "info"
  },
  { 
    id: 5, 
    event: "Unauthorized access attempt", 
    user: "unknown", 
    ip: "203.0.113.42", 
    time: "02:13 AM", 
    date: "Yesterday",
    severity: "critical"
  },
  { 
    id: 6, 
    event: "Security settings modified", 
    user: "admin@example.com", 
    ip: "192.168.1.10", 
    time: "10:45 PM", 
    date: "2 days ago",
    severity: "warning"
  },
  { 
    id: 7, 
    event: "System backup downloaded", 
    user: "admin@example.com", 
    ip: "192.168.1.10", 
    time: "08:22 AM", 
    date: "2 days ago",
    severity: "info"
  },
  { 
    id: 8, 
    event: "Two-factor authentication enabled", 
    user: "robert.wilson@example.com", 
    ip: "192.168.1.105", 
    time: "09:00 AM", 
    date: "3 days ago",
    severity: "info"
  },
]

// Mock access points data
const accessPoints = [
  { id: 1, name: "Main Entrance", status: "secured", lastAccess: "10:15 AM Today" },
  { id: 2, name: "Server Room", status: "secured", lastAccess: "Yesterday 4:30 PM" },
  { id: 3, name: "Executive Office", status: "secured", lastAccess: "Today 9:05 AM" },
  { id: 4, name: "Loading Dock", status: "open", lastAccess: "Now" },
  { id: 5, name: "Roof Access", status: "secured", lastAccess: "3 days ago" },
  { id: 6, name: "Parking Garage", status: "secured", lastAccess: "Today 8:45 AM" },
]

// Mock security vulnerabilities
const vulnerabilities = [
  { 
    id: 1, 
    issue: "Outdated firmware on access control system", 
    severity: "high", 
    status: "open", 
    discovered: "3 days ago" 
  },
  { 
    id: 2, 
    issue: "Weak password policy for guest accounts", 
    severity: "medium", 
    status: "in progress", 
    discovered: "1 week ago" 
  },
  { 
    id: 3, 
    issue: "Unpatched operating system on monitoring station", 
    severity: "high", 
    status: "open", 
    discovered: "2 days ago" 
  },
  { 
    id: 4, 
    issue: "Insecure Wi-Fi configuration", 
    severity: "medium", 
    status: "resolved", 
    discovered: "2 weeks ago" 
  },
  { 
    id: 5, 
    issue: "Missing physical security controls at north entrance", 
    severity: "low", 
    status: "in progress", 
    discovered: "1 week ago" 
  },
]

export default function SecurityPage() {
  const [securityMode, setSecurityMode] = useState("armed")
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  
  // Filter security events based on search and filters
  const filteredEvents = securityEvents.filter(event => {
    // Search filter
    const matchesSearch = event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.ip.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Severity filter
    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter
    
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Security Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button variant="destructive" size="sm" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Emergency Override</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Security Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Secured</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">3</div>
                <p className="text-xs text-muted-foreground">
                  +1 from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Access Points</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12/13</div>
                <p className="text-xs text-muted-foreground">
                  Secured access points
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2h ago</div>
                <p className="text-xs text-muted-foreground">
                  Security scan completed
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Security System</CardTitle>
                <CardDescription>
                  Control building security systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant={securityMode === "armed" ? "default" : "outline"}
                    className="h-20 flex flex-col gap-1"
                    onClick={() => setSecurityMode("armed")}
                  >
                    <Lock className="h-5 w-5" />
                    <span>Arm System</span>
                  </Button>
                  <Button 
                    variant={securityMode === "disarmed" ? "default" : "outline"}
                    className="h-20 flex flex-col gap-1"
                    onClick={() => setSecurityMode("disarmed")}
                  >
                    <Unlock className="h-5 w-5" />
                    <span>Disarm System</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <span>Access Control System</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Online</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                      <span>Surveillance Cameras</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Online</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                      <span>Intrusion Detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Active</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-muted-foreground" />
                      <span>Visitor Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Active</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Run Security Diagnostic</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>
                  Latest security-related activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-full p-1 ${
                          event.severity === "critical" 
                            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200" 
                            : event.severity === "warning"
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                        }`}>
                          {event.severity === "critical" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : event.severity === "warning" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.event}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.user} • {event.time} ({event.date})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Events</Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Access Point Status</CardTitle>
              <CardDescription>
                Current status of building access points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                  <div className="col-span-4">Access Point</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-3">Last Access</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y">
                  {accessPoints.map((point) => (
                    <div key={point.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-4 font-medium">{point.name}</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          {point.status === "secured" ? (
                            <>
                              <Lock className="h-4 w-4 text-green-500" />
                              <span className="text-green-500">Secured</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4 text-amber-500" />
                              <span className="text-amber-500">Open</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="col-span-3 text-muted-foreground">{point.lastAccess}</div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            {point.status === "secured" ? "Unlock" : "Lock"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Control Management</CardTitle>
              <CardDescription>
                Manage physical access to building areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="access-mode">Access Control Mode</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger id="access-mode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Operations</SelectItem>
                      <SelectItem value="restricted">Restricted Access</SelectItem>
                      <SelectItem value="lockdown">Lockdown</SelectItem>
                      <SelectItem value="emergency">Emergency Evacuation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access-schedule">Schedule Mode</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger id="access-schedule">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatic (Business Hours)</SelectItem>
                      <SelectItem value="manual">Manual Control</SelectItem>
                      <SelectItem value="custom">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="visitor-management">Visitor Management System</Label>
                  <Switch id="visitor-management" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable visitor check-in and temporary access credentials
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-lock">Automatic Locking</Label>
                  <Switch id="auto-lock" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically lock doors after business hours
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="access-groups">Access Groups</Label>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                    <div className="col-span-4">Group Name</div>
                    <div className="col-span-6">Access Areas</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-4 font-medium">Administrators</div>
                      <div className="col-span-6">All Areas</div>
                      <div className="col-span-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-4 font-medium">Managers</div>
                      <div className="col-span-6">Offices, Meeting Rooms, Common Areas</div>
                      <div className="col-span-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-4 font-medium">Staff</div>
                      <div className="col-span-6">Offices, Common Areas</div>
                      <div className="col-span-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-4 font-medium">Maintenance</div>
                      <div className="col-span-6">Technical Areas, Common Areas</div>
                      <div className="col-span-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-4 font-medium">Visitors</div>
                      <div className="col-span-6">Reception, Common Areas</div>
                      <div className="col-span-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Access Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Credentials</CardTitle>
              <CardDescription>
                Manage access cards, fobs, and mobile credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Access credential management interface will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Security Event Log</CardTitle>
              <CardDescription>
                View and analyze security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {/* Search and filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Events list */}
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                    <div className="col-span-1">Severity</div>
                    <div className="col-span-4">Event</div>
                    <div className="col-span-2">User</div>
                    <div className="col-span-2">IP Address</div>
                    <div className="col-span-3">Time</div>
                  </div>
                  <div className="divide-y">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <div key={event.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                          <div className="col-span-1">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              event.severity === "critical" 
                                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200" 
                                : event.severity === "warning"
                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                            }`}>
                              {event.severity === "critical" || event.severity === "warning" ? (
                                <AlertTriangle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                          <div className="col-span-4 font-medium">{event.event}</div>
                          <div className="col-span-2">{event.user}</div>
                          <div className="col-span-2">{event.ip}</div>
                          <div className="col-span-3 text-sm text-muted-foreground">
                            {event.time} ({event.date})
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No events match your filters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>
                Security event patterns and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Security event analytics will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Vulnerabilities</CardTitle>
              <CardDescription>
                Identified security issues and remediation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                  <div className="col-span-5">Issue</div>
                  <div className="col-span-2">Severity</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Discovered</div>
                  <div className="col-span-1">Actions</div>
                </div>
                <div className="divide-y">
                  {vulnerabilities.map((issue) => (
                    <div key={issue.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-5 font-medium">{issue.issue}</div>
                      <div className="col-span-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          issue.severity === "high" 
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" 
                            : issue.severity === "medium"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className={`inline-flex items-center gap-1 ${
                          issue.status === "resolved" 
                            ? "text-green-500" 
                            : issue.status === "in progress"
                            ? "text-amber-500"
                            : "text-red-500"
                        }`}>
                          {issue.status === "resolved" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : issue.status === "in progress" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          <span className="capitalize">{issue.status}</span>
                        </span>
                      </div>
                      <div className="col-span-2 text-muted-foreground">{issue.discovered}</div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Report</Button>
              <Button>Run Security Scan</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Compliance</CardTitle>
              <CardDescription>
                Compliance status with security standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Physical Security Controls</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Access Control Compliance</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Network Security</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Data Protection</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Overall Security Rating</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}