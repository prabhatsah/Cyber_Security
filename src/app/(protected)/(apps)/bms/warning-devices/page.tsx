"use client"

import { useState } from "react"
import { 
  AlertTriangle, 
  Bell, 
  Search, 
  Filter, 
  Plus, 
  RefreshCw, 
  Battery, 
  Signal, 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  MoreHorizontal,
  Edit,
  Trash,
  Volume2,
  VolumeX,
  Siren,
  Megaphone,
  Wifi,
  WifiOff
} from "lucide-react"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Switch } from "@/shadcn/ui/switch"
import { Badge } from "@/shadcn/ui/badge"
import { Progress } from "@/shadcn/ui/progress"
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
import { ScrollArea } from "@/shadcn/ui/scroll-area"

// Mock warning device data
const warningDeviceData = [
  { 
    id: 1, 
    name: "Fire Alarm Panel", 
    type: "fire-alarm", 
    location: "Main Building",
    status: "active",
    battery: null, // Powered device
    signal: 98,
    lastTested: "2025-03-15",
    lastMaintenance: "2025-01-10",
    alertLevel: "normal",
    firmware: "v3.2.1",
    ipAddress: "192.168.1.201"
  },
  { 
    id: 2, 
    name: "Emergency Siren 1", 
    type: "siren", 
    location: "North Wing",
    status: "active",
    battery: 87,
    signal: 92,
    lastTested: "2025-03-10",
    lastMaintenance: "2024-12-15",
    alertLevel: "normal",
    firmware: "v2.1.4",
    ipAddress: "192.168.1.202"
  },
  { 
    id: 3, 
    name: "Emergency Siren 2", 
    type: "siren", 
    location: "South Wing",
    status: "active",
    battery: 64,
    signal: 78,
    lastTested: "2025-03-10",
    lastMaintenance: "2024-12-15",
    alertLevel: "normal",
    firmware: "v2.1.4",
    ipAddress: "192.168.1.203"
  },
  { 
    id: 4, 
    name: "PA System", 
    type: "pa-system", 
    location: "All Floors",
    status: "active",
    battery: null, // Powered device
    signal: 95,
    lastTested: "2025-02-28",
    lastMaintenance: "2024-11-20",
    alertLevel: "normal",
    firmware: "v3.0.1",
    ipAddress: "192.168.1.204"
  },
  { 
    id: 5, 
    name: "Evacuation Alarm", 
    type: "evacuation", 
    location: "Main Building",
    status: "warning",
    battery: 23,
    signal: 85,
    lastTested: "2025-01-15",
    lastMaintenance: "2024-10-05",
    alertLevel: "warning",
    firmware: "v1.5.7",
    ipAddress: "192.168.1.205"
  },
  { 
    id: 6, 
    name: "Emergency Beacon", 
    type: "beacon", 
    location: "Parking Garage",
    status: "active",
    battery: 91,
    signal: 90,
    lastTested: "2025-02-10",
    lastMaintenance: "2024-11-15",
    alertLevel: "normal",
    firmware: "v2.3.0",
    ipAddress: "192.168.1.206"
  },
  { 
    id: 7, 
    name: "Smoke Detector Network", 
    type: "smoke-detector", 
    location: "All Floors",
    status: "active",
    battery: null, // Powered device
    signal: 88,
    lastTested: "2025-03-01",
    lastMaintenance: "2024-12-20",
    alertLevel: "normal",
    firmware: "v2.0.5",
    ipAddress: "192.168.1.207"
  },
  { 
    id: 8, 
    name: "Emergency Call Point", 
    type: "call-point", 
    location: "Main Entrance",
    status: "inactive",
    battery: 0,
    signal: 0,
    lastTested: "2024-12-10",
    lastMaintenance: "2024-09-15",
    alertLevel: "normal",
    firmware: "v1.2.3",
    ipAddress: "192.168.1.208"
  },
]

// Mock maintenance history
const maintenanceHistory = [
  {
    id: 1,
    deviceId: 1,
    deviceName: "Fire Alarm Panel",
    date: "2025-01-10",
    type: "Scheduled",
    technician: "John Smith",
    notes: "Replaced backup battery, tested all connections, updated firmware to v3.2.1"
  },
  {
    id: 2,
    deviceId: 2,
    deviceName: "Emergency Siren 1",
    date: "2024-12-15",
    type: "Scheduled",
    technician: "Sarah Johnson",
    notes: "Checked power supply, tested sound output, cleaned exterior"
  },
  {
    id: 3,
    deviceId: 5,
    deviceName: "Evacuation Alarm",
    date: "2024-10-05",
    type: "Scheduled",
    technician: "Mike Wilson",
    notes: "Replaced worn wiring, tested battery backup system"
  },
  {
    id: 4,
    deviceId: 8,
    deviceName: "Emergency Call Point",
    date: "2024-09-15",
    type: "Repair",
    technician: "Sarah Johnson",
    notes: "Replaced damaged button mechanism, tested connectivity"
  },
  {
    id: 5,
    deviceId: 4,
    deviceName: "PA System",
    date: "2024-11-20",
    type: "Scheduled",
    technician: "John Smith",
    notes: "Tested all speakers, adjusted volume levels, updated firmware"
  }
]

// Mock test history
const testHistory = [
  {
    id: 1,
    deviceId: 1,
    deviceName: "Fire Alarm Panel",
    date: "2025-03-15",
    result: "pass",
    tester: "John Smith",
    notes: "All systems functioning correctly"
  },
  {
    id: 2,
    deviceId: 2,
    deviceName: "Emergency Siren 1",
    date: "2025-03-10",
    result: "pass",
    tester: "Sarah Johnson",
    notes: "Sound output at expected levels"
  },
  {
    id: 3,
    deviceId: 3,
    deviceName: "Emergency Siren 2",
    date: "2025-03-10",
    result: "pass",
    tester: "Sarah Johnson",
    notes: "Sound output at expected levels"
  },
  {
    id: 4,
    deviceId: 5,
    deviceName: "Evacuation Alarm",
    date: "2025-01-15",
    result: "warning",
    tester: "Mike Wilson",
    notes: "Battery level lower than expected, sound output acceptable"
  },
  {
    id: 5,
    deviceId: 8,
    deviceName: "Emergency Call Point",
    date: "2024-12-10",
    result: "fail",
    tester: "Sarah Johnson",
    notes: "Button mechanism not triggering properly, scheduled for repair"
  }
]

// Format date function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calculate days since date
const daysSince = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function WarningDevicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [devices, setDevices] = useState(warningDeviceData);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [dashboardEnabled, setDashboardEnabled] = useState(true);
  
  // Filter devices based on search and filters
  const filteredDevices = devices.filter(device => {
    // Search filter
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === "all" || device.type === typeFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get unique device types for filter dropdown
  const deviceTypes = [...new Set(devices.map(device => device.type))];

  // Toggle device status
  const toggleDeviceStatus = (id) => {
    setDevices(devices.map(device => 
      device.id === id ? { 
        ...device, 
        status: device.status === "active" ? "inactive" : "active" 
      } : device
    ));
  };

  // Toggle dashboard enabled state
  const toggleDashboard = (enabled) => {
    setDashboardEnabled(enabled);
  };

  // Get battery status color
  const getBatteryColor = (level) => {
    if (level === null) return "text-muted-foreground"; // Powered device
    if (level < 20) return "text-red-500";
    if (level < 50) return "text-amber-500";
    return "text-green-500";
  };

  // Get signal status color
  const getSignalColor = (level) => {
    if (level === 0) return "text-muted-foreground"; // Offline
    if (level < 50) return "text-red-500";
    if (level < 80) return "text-amber-500";
    return "text-green-500";
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">Inactive</Badge>;
      case "warning":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Warning</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get device type icon
  const getDeviceTypeIcon = (type) => {
    switch (type) {
      case "fire-alarm":
        return <Bell className="h-5 w-5 text-red-500" />;
      case "siren":
        return <Volume2 className="h-5 w-5 text-amber-500" />;
      case "pa-system":
        return <Megaphone className="h-5 w-5 text-blue-500" />;
      case "evacuation":
        return <Siren className="h-5 w-5 text-red-500" />;
      case "beacon":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "smoke-detector":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "call-point":
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Warning Device Dashboard</h1>
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

      {!dashboardEnabled && (
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <p className="font-medium text-amber-500">Warning Device Dashboard is currently disabled</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">All monitoring and alerting functions are inactive. Re-enable the dashboard in settings.</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Warning Devices</CardTitle>
              <CardDescription>
                Manage and monitor warning devices across your facility
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
                      disabled={!dashboardEnabled}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select 
                      value={typeFilter} 
                      onValueChange={setTypeFilter}
                      disabled={!dashboardEnabled}
                    >
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

                    <Select 
                      value={statusFilter} 
                      onValueChange={setStatusFilter}
                      disabled={!dashboardEnabled}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" disabled={!dashboardEnabled}>
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
                    <div className="col-span-2">Last Tested</div>
                    <div className="col-span-2">Battery/Signal</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  <div className="divide-y">
                    {filteredDevices.length > 0 ? (
                      filteredDevices.map((device) => (
                        <div key={device.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                          <div className="col-span-3 font-medium flex items-center gap-2">
                            {getDeviceTypeIcon(device.type)}
                            <div>
                              <div>{device.name}</div>
                              <div className="text-xs text-muted-foreground">{device.type.replace('-', ' ')}</div>
                            </div>
                          </div>
                          <div className="col-span-2">{device.location}</div>
                          <div className="col-span-2 flex items-center gap-2">
                            {getStatusBadge(device.status)}
                            <Switch 
                              checked={device.status === "active" || device.status === "warning"} 
                              onCheckedChange={() => toggleDeviceStatus(device.id)}
                              disabled={!dashboardEnabled || device.battery === 0}
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="flex flex-col">
                              <span>{formatDate(device.lastTested)}</span>
                              <span className="text-xs text-muted-foreground">
                                {daysSince(device.lastTested)} days ago
                              </span>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              {device.battery !== null ? (
                                <Battery className={`h-4 w-4 ${getBatteryColor(device.battery)}`} />
                              ) : (
                                <span className="text-sm text-muted-foreground">AC</span>
                              )}
                              {device.signal > 0 ? (
                                <Wifi className={`h-4 w-4 ${getSignalColor(device.signal)}`} />
                              ) : (
                                <WifiOff className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  disabled={!dashboardEnabled}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedDevice(device)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bell className="mr-2 h-4 w-4" />
                                  <span>Test Device</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedDevice(null)}
                    disabled={!dashboardEnabled}
                  >
                    <XCircle className="h-4 w-4" />
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
                        <div className="text-muted-foreground">Alert Level</div>
                        <div>
                          {selectedDevice.alertLevel === "normal" ? (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Normal</Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Warning</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Maintenance Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Last Tested</div>
                        <div>{formatDate(selectedDevice.lastTested)}</div>
                        <div className="text-muted-foreground">Last Maintenance</div>
                        <div>{formatDate(selectedDevice.lastMaintenance)}</div>
                        <div className="text-muted-foreground">Next Test Due</div>
                        <div>{formatDate(new Date(new Date(selectedDevice.lastTested).setMonth(new Date(selectedDevice.lastTested).getMonth() + 3)))}</div>
                      </div>
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
                        <Button variant="outline" size="sm" disabled={!dashboardEnabled}>
                          <Bell className="h-4 w-4 mr-1" />
                          <span>Test Device</span>
                        </Button>
                        <Button variant="outline" size="sm" disabled={!dashboardEnabled}>
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Schedule Maintenance</span>
                        </Button>
                        <Button variant="outline" size="sm" disabled={!dashboardEnabled}>
                          <Download className="h-4 w-4 mr-1" />
                          <span>Export Data</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" disabled={!dashboardEnabled}>
                  <Edit className="h-4 w-4 mr-1" />
                  <span>Edit Device</span>
                </Button>
                <Button variant="destructive" disabled={!dashboardEnabled}>
                  <Trash className="h-4 w-4 mr-1" />
                  <span>Remove Device</span>
                </Button>
              </CardFooter>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Active Devices</h3>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold">
                  {devices.filter(d => d.status === "active").length}
                  <span className="text-sm text-muted-foreground ml-1">/ {devices.length}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round(devices.filter(d => d.status === "active").length / devices.length * 100)}% active
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
                  {devices.filter(d => d.battery !== null && d.battery < 30).length}
                  <span className="text-sm text-muted-foreground ml-1">/ {devices.filter(d => d.battery !== null).length}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Devices below 30% battery
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Testing Due</h3>
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold">
                  {devices.filter(d => daysSince(d.lastTested) > 90).length}
                  <span className="text-sm text-muted-foreground ml-1">/ {devices.length}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Devices due for testing
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>
                View and manage device maintenance schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Upcoming Maintenance</h3>
                  <Button variant="outline" size="sm" disabled={!dashboardEnabled}>
                    <Plus className="h-4 w-4 mr-1" />
                    <span>Schedule New</span>
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                    <div className="col-span-3">Device</div>
                    <div className="col-span-2">Last Maintenance</div>
                    <div className="col-span-2">Next Due</div>
                    <div className="col-span-3">Type</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    {devices.map(device => (
                      <div key={device.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                        <div className="col-span-3 font-medium">{device.name}</div>
                        <div className="col-span-2">{formatDate(device.lastMaintenance)}</div>
                        <div className="col-span-2">
                          {formatDate(new Date(new Date(device.lastMaintenance).setMonth(new Date(device.lastMaintenance).getMonth() + 6)))}
                        </div>
                        <div className="col-span-3">Scheduled Maintenance</div>
                        <div className="col-span-2">
                          <Button variant="outline" size="sm" disabled={!dashboardEnabled}>
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Schedule</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
              <CardDescription>
                View past maintenance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Recent Maintenance</h3>
                  <Button variant="outline" size="sm" disabled={!dashboardEnabled}>
                    <Download className="h-4 w-4 mr-1" />
                    <span>Export</span>
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                    <div className="col-span-3">Device</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Technician</div>
                    <div className="col-span-3">Notes</div>
                  </div>
                  <div className="divide-y">
                    {maintenanceHistory.map(record => (
                      <div key={record.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                        <div className="col-span-3 font-medium">{record.deviceName}</div>
                        <div className="col-span-2">{formatDate(record.date)}</div>
                        <div className="col-span-2">{record.type}</div>
                        <div className="col-span-2">{record.technician}</div>
                        <div className="col-span-3 text-sm text-muted-foreground truncate" title={record.notes}>
                          {record.notes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Testing</CardTitle>
              <CardDescription>
                Schedule and manage device testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Testing Schedule</h3>
                  <Button variant="outline" size="sm" disabled={!dashboardEnabled}>
                    <Plus className="h-4 w-4 mr-1" />
                    <span>Schedule Test</span>
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                    <div className="col-span-3">Device</div>
                    <div className="col-span-2">Last Tested</div>
                    <div className="col-span-2">Next Test</div>
                    <div className="col-span-3">Type</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    {devices.map(device => (
                      <div key={device.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                        <div className="col-span-3 font-medium">{device.name}</div>
                        <div className="col-span-2">{formatDate(device.lastTested)}</div>
                        <div className="col-span-2">
                          {formatDate(new Date(new Date(device.lastTested).setMonth(new Date(device.lastTested).getMonth() + 3)))}
                        </div>
                        <div className="col-span-3">Quarterly Test</div>
                        <div className="col-span-2">
                          <Button variant="outline" size="sm" disabled={!dashboardEnabled}>
                            <Bell className="h-4 w-4 mr-1" />
                            <span>Test Now</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test History</CardTitle>
              <CardDescription>
                View past test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Recent Tests</h3>
                  <Button variant="outline" size="sm" disabled={!dashboardEnabled}>
                    <Download className="h-4 w-4 mr-1" />
                    <span>View All</span>
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                    <div className="col-span-3">Device</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Result</div>
                    <div className="col-span-3">Tester</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    {testHistory.map(test => (
                      <div key={test.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                        <div className="col-span-3 font-medium">{test.deviceName}</div>
                        <div className="col-span-2">{formatDate(test.date)}</div>
                        <div className="col-span-2">
                          {test.result === 'pass' && <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Pass</Badge>}
                          {test.result === 'warning' && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Warning</Badge>}
                          {test.result === 'fail' && <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Fail</Badge>}
                        </div>
                        <div className="col-span-3">{test.tester}</div>
                        <div className="col-span-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>View Report</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>
                Configure warning device dashboard settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dashboard-enabled">Dashboard Status</Label>
                  <Switch 
                    id="dashboard-enabled" 
                    checked={dashboardEnabled} 
                    onCheckedChange={toggleDashboard}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable or disable the entire warning device dashboard
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked disabled={!dashboardEnabled} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch id="sms-notifications" defaultChecked disabled={!dashboardEnabled} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch id="push-notifications" defaultChecked disabled={!dashboardEnabled} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Auto-Refresh Interval</Label>
                <Select defaultValue="60" disabled={!dashboardEnabled}>
                  <SelectTrigger id="refresh-interval">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                    <SelectItem value="0">Manual refresh only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance-reminder">Maintenance Reminder Threshold</Label>
                <Select defaultValue="90" disabled={!dashboardEnabled}>
                  <SelectTrigger id="maintenance-reminder">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="battery-threshold">Low Battery Alert Threshold</Label>
                <Select defaultValue="20" disabled={!dashboardEnabled}>
                  <SelectTrigger id="battery-threshold">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="25">25%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!dashboardEnabled}>Save Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Integration</CardTitle>
              <CardDescription>
                Configure integration with other building systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bms-integration">Building Management System</Label>
                    <Switch id="bms-integration" defaultChecked disabled={!dashboardEnabled} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Integrate warning devices with the main building management system
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="security-integration">Security System</Label>
                    <Switch id="security-integration" defaultChecked disabled={!dashboardEnabled} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect warning devices with the security system
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hvac-integration">HVAC System</Label>
                    <Switch id="hvac-integration" defaultChecked disabled={!dashboardEnabled} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Integrate with HVAC for emergency ventilation control
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="access-integration">Access Control System</Label>
                    <Switch id="access-integration" defaultChecked disabled={!dashboardEnabled} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect with access control for emergency unlocking
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!dashboardEnabled}>Save Integration Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}