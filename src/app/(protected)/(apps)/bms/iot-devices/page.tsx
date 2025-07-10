"use client"

import { useState } from "react"
import { 
  Cpu, 
  Battery, 
  Signal, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Bell, 
  Settings, 
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  MoreHorizontal,
  Edit,
  Trash,
  Home,
  Users,
  Eye,
  Camera,
  Lightbulb,
  Thermometer,
  Wind,
  Calendar
} from "lucide-react"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Switch } from "@/shadcn/ui/switch"
import { Badge } from "@/shadcn/ui/badge"
import { Progress } from "@/shadcn/ui/progress"
import { ScrollArea } from "@/shadcn/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu"

// Mock IoT device data
const deviceData = [
  { 
    id: 1, 
    name: "Temperature Sensor 1", 
    type: "temperature", 
    location: "Server Room",
    status: "online",
    battery: 87,
    signal: 92,
    lastActive: "2 minutes ago",
    reading: "23.5°C",
    firmware: "v2.1.4",
    ipAddress: "192.168.1.101"
  },
  { 
    id: 2, 
    name: "Motion Sensor 1", 
    type: "motion", 
    location: "Main Entrance",
    status: "online",
    battery: 64,
    signal: 78,
    lastActive: "Just now",
    reading: "No motion detected",
    firmware: "v1.8.2",
    ipAddress: "192.168.1.102"
  },
  { 
    id: 3, 
    name: "Smart Light Controller", 
    type: "lighting", 
    location: "Conference Room",
    status: "online",
    battery: null, // Powered device
    signal: 95,
    lastActive: "5 minutes ago",
    reading: "On (Brightness: 75%)",
    firmware: "v3.0.1",
    ipAddress: "192.168.1.103"
  },
  { 
    id: 4, 
    name: "Air Quality Sensor", 
    type: "air-quality", 
    location: "Open Office Area",
    status: "warning",
    battery: 23,
    signal: 85,
    lastActive: "7 minutes ago",
    reading: "PM2.5: 18µg/m³",
    firmware: "v1.5.7",
    ipAddress: "192.168.1.104"
  },
  { 
    id: 5, 
    name: "Door Access Controller", 
    type: "access", 
    location: "Server Room",
    status: "online",
    battery: null, // Powered device
    signal: 90,
    lastActive: "12 minutes ago",
    reading: "Locked",
    firmware: "v2.3.0",
    ipAddress: "192.168.1.105"
  },
  { 
    id: 6, 
    name: "Energy Monitor", 
    type: "power", 
    location: "Electrical Panel",
    status: "online",
    battery: null, // Powered device
    signal: 88,
    lastActive: "3 minutes ago",
    reading: "4.2 kW",
    firmware: "v2.0.5",
    ipAddress: "192.168.1.106"
  },
  { 
    id: 7, 
    name: "Water Leak Detector", 
    type: "water", 
    location: "Bathroom",
    status: "offline",
    battery: 0,
    signal: 0,
    lastActive: "2 days ago",
    reading: "No leak detected",
    firmware: "v1.2.3",
    ipAddress: "192.168.1.107"
  },
  { 
    id: 8, 
    name: "Humidity Sensor", 
    type: "humidity", 
    location: "Server Room",
    status: "online",
    battery: 92,
    signal: 94,
    lastActive: "1 minute ago",
    reading: "45% RH",
    firmware: "v1.7.2",
    ipAddress: "192.168.1.108"
  },
]

// Mock alert data
const alertData = [
  {
    id: 1,
    deviceId: 4,
    deviceName: "Air Quality Sensor",
    message: "Air quality below threshold (PM2.5: 18µg/m³)",
    severity: "medium",
    timestamp: "7 minutes ago",
    status: "unresolved"
  },
  {
    id: 2,
    deviceName: "Water Leak Detector",
    deviceId: 7,
    message: "Device battery depleted",
    severity: "high",
    timestamp: "2 days ago",
    status: "unresolved"
  },
  {
    id: 3,
    deviceName: "Temperature Sensor 1",
    deviceId: 1,
    message: "Temperature spike detected (28.7°C)",
    severity: "medium",
    timestamp: "Yesterday, 2:45 PM",
    status: "resolved"
  },
  {
    id: 4,
    deviceName: "Motion Sensor 1",
    deviceId: 2,
    message: "Motion detected outside business hours",
    severity: "low",
    timestamp: "3 days ago, 11:32 PM",
    status: "resolved"
  },
  {
    id: 5,
    deviceName: "Door Access Controller",
    deviceId: 5,
    message: "Multiple failed access attempts",
    severity: "critical",
    timestamp: "4 days ago, 3:12 AM",
    status: "resolved"
  }
]

// Mock device groups
const deviceGroups = [
  { id: 1, name: "Server Room", deviceCount: 3 },
  { id: 2, name: "Office Areas", deviceCount: 2 },
  { id: 3, name: "Entry Points", deviceCount: 2 },
  { id: 4, name: "Utilities", deviceCount: 1 }
]

export default function IoTDevicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [devices, setDevices] = useState(deviceData)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [alerts, setAlerts] = useState(alertData)
  
  // Filter devices based on search and filters
  const filteredDevices = devices.filter(device => {
    // Search filter
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Type filter
    const matchesType = typeFilter === "all" || device.type === typeFilter
    
    // Status filter
    const matchesStatus = statusFilter === "all" || device.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Get unique device types for filter dropdown
  const deviceTypes = [...new Set(devices.map(device => device.type))]

  // Toggle device status
  const toggleDeviceStatus = (id) => {
    setDevices(devices.map(device => 
      device.id === id ? { 
        ...device, 
        status: device.status === "online" ? "offline" : "online" 
      } : device
    ))
  }

  // Resolve alert
  const resolveAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: "resolved" } : alert
    ))
  }

  // Get battery status color
  const getBatteryColor = (level) => {
    if (level === null) return "text-muted-foreground" // Powered device
    if (level < 20) return "text-red-500"
    if (level < 50) return "text-amber-500"
    return "text-green-500"
  }

  // Get signal status color
  const getSignalColor = (level) => {
    if (level === 0) return "text-muted-foreground" // Offline
    if (level < 50) return "text-red-500"
    if (level < 80) return "text-amber-500"
    return "text-green-500"
  }

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Online</Badge>
      case "offline":
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">Offline</Badge>
      case "warning":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Warning</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">IoT Device Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Device</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Monitoring</TabsTrigger>
          <TabsTrigger value="management">Device Management</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>
                Manage and monitor your IoT device network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {/* Search and filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search devices..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Device Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {deviceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type.replace('-', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Devices list */}
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                    <div className="col-span-3">Device</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Battery</div>
                    <div className="col-span-2">Last Active</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  <div className="divide-y">
                    {filteredDevices.length > 0 ? (
                      filteredDevices.map((device) => (
                        <div key={device.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                          <div className="col-span-3 font-medium flex items-center gap-2">
                            <Cpu className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div>{device.name}</div>
                              <div className="text-xs text-muted-foreground">{device.type.replace('-', ' ')}</div>
                            </div>
                          </div>
                          <div className="col-span-2">{device.location}</div>
                          <div className="col-span-2 flex items-center gap-2">
                            {getStatusBadge(device.status)}
                            <Switch 
                              checked={device.status === "online" || device.status === "warning"} 
                              onCheckedChange={() => toggleDeviceStatus(device.id)}
                              disabled={device.battery === 0}
                            />
                          </div>
                          <div className="col-span-2">
                            {device.battery !== null ? (
                              <div className="flex items-center gap-2">
                                <Battery className={`h-4 w-4 ${getBatteryColor(device.battery)}`} />
                                <div className="w-full max-w-24">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>{device.battery}%</span>
                                  </div>
                                  <Progress value={device.battery} className="h-1.5" />
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Powered</span>
                            )}
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{device.lastActive}</span>
                          </div>
                          <div className="col-span-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedDevice(device)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  <span>Configure</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  <span>Reboot</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No devices match your filters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedDevice && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedDevice.name}</CardTitle>
                    <CardDescription>
                      {selectedDevice.type.replace('-', ' ')} • {selectedDevice.location}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDevice(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Device Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Status</div>
                        <div>{getStatusBadge(selectedDevice.status)}</div>
                        <div className="text-muted-foreground">IP Address</div>
                        <div>{selectedDevice.ipAddress}</div>
                        <div className="text-muted-foreground">Firmware</div>
                        <div>{selectedDevice.firmware}</div>
                        <div className="text-muted-foreground">Last Active</div>
                        <div>{selectedDevice.lastActive}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Current Reading</h3>
                      <div className="text-2xl font-bold">{selectedDevice.reading}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Signal Strength</h3>
                      <div className="flex items-center gap-2">
                        <Signal className={`h-5 w-5 ${getSignalColor(selectedDevice.signal)}`} />
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{selectedDevice.signal}%</span>
                          </div>
                          <Progress value={selectedDevice.signal} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    {selectedDevice.battery !== null && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Battery Level</h3>
                        <div className="flex items-center gap-2">
                          <Battery className={`h-5 w-5 ${getBatteryColor(selectedDevice.battery)}`} />
                          <div className="w-full">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{selectedDevice.battery}%</span>
                            </div>
                            <Progress value={selectedDevice.battery} className="h-2" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          <span>Refresh</span>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          <span>Configure</span>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bell className="h-4 w-4 mr-1" />
                          <span>Alerts</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  <span>Edit Device</span>
                </Button>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-1" />
                  <span>Remove Device</span>
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
                <CardDescription>
                  Configure device alert thresholds and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="alert-mode">Alert Mode</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger id="alert-mode">
                      <SelectValue placeholder="Select alert mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Methods</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <Switch id="sms-notifications" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert-priority">Minimum Alert Priority</Label>
                  <Select defaultValue="low">
                    <SelectTrigger id="alert-priority">
                      <SelectValue placeholder="Select minimum priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical Only</SelectItem>
                      <SelectItem value="high">High & Critical</SelectItem>
                      <SelectItem value="medium">Medium & Above</SelectItem>
                      <SelectItem value="low">All Alerts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quiet Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiet-start" className="text-xs">Start Time</Label>
                      <Input id="quiet-start" type="time" defaultValue="22:00" />
                    </div>
                    <div>
                      <Label htmlFor="quiet-end" className="text-xs">End Time</Label>
                      <Input id="quiet-end" type="time" defaultValue="07:00" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only critical alerts will be sent during quiet hours
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Alert Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Alerts</CardTitle>
                <CardDescription>
                  Recent alerts from your IoT devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] relative">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                      {alerts.map(alert => (
                        <Card key={alert.id} className="border shadow-none">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 rounded-full p-1 ${
                                alert.severity === 'critical' 
                                  ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200' 
                                  : alert.severity === 'high'
                                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200'
                                  : alert.severity === 'medium'
                                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                <AlertTriangle className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{alert.deviceName}</p>
                                <p className="text-sm text-muted-foreground">{alert.message}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                                  {alert.status === "resolved" ? (
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                      Resolved
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                      Unresolved
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Export Report</Button>
                <Button>Generate Health Report</Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device Health Monitoring</CardTitle>
              <CardDescription>
                Monitor the health and performance of your IoT devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Online Devices</h3>
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold">
                      {devices.filter(d => d.status === "online").length}
                      <span className="text-sm text-muted-foreground ml-1">/ {devices.length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {Math.round(devices.filter(d => d.status === "online").length / devices.length * 100)}% online
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Warning Status</h3>
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-3xl font-bold">
                      {devices.filter(d => d.status === "warning").length}
                      <span className="text-sm text-muted-foreground ml-1">/ {devices.length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Devices requiring attention
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Low Battery</h3>
                      <Battery className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-3xl font-bold">
                      {devices.filter(d => d.battery !== null && d.battery < 20).length}
                      <span className="text-sm text-muted-foreground ml-1">/ {devices.filter(d => d.battery !== null).length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Devices below 20% battery
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Active Alerts</h3>
                      <Bell className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-3xl font-bold">
                      {alerts.filter(a => a.status === "unresolved").length}
                      <span className="text-sm text-muted-foreground ml-1">/ {alerts.length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Unresolved alerts
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Groups</CardTitle>
                <CardDescription>
                  Manage device groups and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceGroups.map(group => (
                    <div key={group.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-muted-foreground">{group.deviceCount} devices</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Devices</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          <span>Edit</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Create New Group</span>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Operations</CardTitle>
                <CardDescription>
                  Configure automated device operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Office Hours Lighting</h3>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Automatically turn on lights in office areas during working hours
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>8:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Weekdays</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Night Mode Security</h3>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Increase motion sensor sensitivity and enable all cameras after hours
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>7:00 PM - 7:00 AM</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Daily</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Weekend Energy Saving</h3>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Reduce HVAC operation and turn off non-essential devices
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>All day</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Weekends</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Create New Schedule</span>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device Rules & Triggers</CardTitle>
              <CardDescription>
                Configure automated responses to device events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">High Temperature Response</h3>
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">If</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span>Temperature &gt; 28°C</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Then</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Wind className="h-4 w-4 text-muted-foreground" />
                        <span>Increase HVAC cooling</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">And</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span>Send notification</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Motion Detection After Hours</h3>
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">If</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>Motion detected after 7PM</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Then</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Lightbulb className="h-4 w-4 text-muted-foreground" />
                        <span>Turn on area lights</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">And</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span>Record video</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Low Battery Alert</h3>
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">If</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Battery className="h-4 w-4 text-muted-foreground" />
                        <span>Battery level &lt; 15%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Then</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span>Send critical alert</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">And</p>
                      <div className="flex items-center gap-1 text-sm">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        <span>Reduce polling frequency</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                <span>Create New Rule</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}