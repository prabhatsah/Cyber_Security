"use client"

import { useState, useEffect } from "react"
import { Youtube as Cube, Layers, AlertTriangle, Bell, Eye, EyeOff, Thermometer, Droplets, Wind, Lightbulb, Lock, Zap, Maximize2, Minimize2, RotateCcw, Search, Filter, Settings, PanelLeft } from "lucide-react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog"
import { ThreeDViewer } from "../digital-twin/three-d/viewer"
import { IncidentCard } from "../digital-twin/three-d/incident-card"


// Mock incidents data
const incidentsData = [
  {
    id: 1,
    title: "High Temperature Alert",
    description: "Server room temperature exceeding threshold",
    severity: "critical",
    location: "Server Room",
    timestamp: "10:23 AM",
    status: "active",
    type: "temperature",
    coordinates: { x: 5, y: 2.5, z: -3 },
    reading: "29.5°C",
    threshold: "28°C"
  },
  {
    id: 2,
    title: "Low Water Pressure",
    description: "Water pressure below minimum threshold in Zone B",
    severity: "warning",
    location: "Zone B",
    timestamp: "09:15 AM",
    status: "active",
    type: "pressure",
    coordinates: { x: -4, y: 1, z: 2 },
    reading: "85 kPa",
    threshold: "90 kPa"
  },
  {
    id: 3,
    title: "Security Breach Attempt",
    description: "Unauthorized access attempt at main entrance",
    severity: "critical",
    location: "Main Entrance",
    timestamp: "02:13 AM",
    status: "resolved",
    type: "security",
    coordinates: { x: 0, y: 0, z: 8 },
    reading: "Failed authentication",
    threshold: "N/A"
  },
  {
    id: 4,
    title: "HVAC Filter Replacement",
    description: "Filter efficiency below threshold, replacement required",
    severity: "warning",
    location: "AHU-01",
    timestamp: "Yesterday",
    status: "active",
    type: "maintenance",
    coordinates: { x: -2, y: 3, z: -5 },
    reading: "65% efficiency",
    threshold: "75% efficiency"
  },
  {
    id: 5,
    title: "Power Fluctuation",
    description: "Voltage fluctuation detected in electrical panel",
    severity: "warning",
    location: "Main Distribution Panel",
    timestamp: "Yesterday",
    status: "active",
    type: "electrical",
    coordinates: { x: 7, y: 1, z: 4 },
    reading: "±8% variation",
    threshold: "±5% variation"
  }
]

// Mock sensor data
const sensorsData = [
  {
    id: 1,
    name: "Temperature Sensor 1",
    type: "temperature",
    location: "Server Room",
    value: 29.5,
    unit: "°C",
    status: "alert",
    coordinates: { x: 5, y: 2.5, z: -3 },
    icon: Thermometer
  },
  {
    id: 2,
    name: "Humidity Sensor 1",
    type: "humidity",
    location: "Server Room",
    value: 45,
    unit: "%",
    status: "normal",
    coordinates: { x: 5.5, y: 2.5, z: -3.5 },
    icon: Droplets
  },
  {
    id: 3,
    name: "Water Pressure Sensor 1",
    type: "pressure",
    location: "Zone B",
    value: 85,
    unit: "kPa",
    status: "alert",
    coordinates: { x: -4, y: 1, z: 2 },
    icon: Droplets
  },
  {
    id: 4,
    name: "Air Flow Sensor 1",
    type: "airflow",
    location: "AHU-01",
    value: 12.8,
    unit: "m³/min",
    status: "normal",
    coordinates: { x: -2, y: 3, z: -5 },
    icon: Wind
  },
  {
    id: 5,
    name: "Lighting Sensor 1",
    type: "lighting",
    location: "Zone C",
    value: 450,
    unit: "lux",
    status: "normal",
    coordinates: { x: 0, y: 2, z: 0 },
    icon: Lightbulb
  },
  {
    id: 6,
    name: "Security Sensor 1",
    type: "security",
    location: "Main Entrance",
    value: "Secured",
    unit: "",
    status: "normal",
    coordinates: { x: 0, y: 0, z: 8 },
    icon: Lock
  },
  {
    id: 7,
    name: "Power Sensor 1",
    type: "electrical",
    location: "Main Distribution Panel",
    value: "±8%",
    unit: "variation",
    status: "alert",
    coordinates: { x: 7, y: 1, z: 4 },
    icon: Zap
  }
]

const floors = [
  { value: 'all', label: 'All Floors' },
  { value: 'basement', label: 'Basement' },
  { value: '1', label: '1st Floor' },
  { value: '2', label: '2nd Floor' },
  { value: '3', label: '3rd Floor' },
  { value: '4', label: '4th Floor' },
  { value: 'roof', label: 'Roof' }
];

export default function DigitalTwinPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [incidents, setIncidents] = useState(incidentsData)
  const [sensors, setSensors] = useState(sensorsData)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [viewMode, setViewMode] = useState("3d")
  const [showLabels, setShowLabels] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState("all")
  const [selectedSystems, setSelectedSystems] = useState({
    hvac: true,
    electrical: true,
    plumbing: true,
    security: true,
    lighting: true
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Filter incidents based on search and filters
  const filteredIncidents = incidents.filter(incident => {
    // Search filter
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Severity filter
    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter
    
    // Type filter
    const matchesType = typeFilter === "all" || incident.type === typeFilter
    
    // Status filter
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    
    return matchesSearch && matchesSeverity && matchesType && matchesStatus
  })

  // Handle incident selection
  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident)
  }

  // Handle incident resolution
  const handleResolveIncident = (id) => {
    setIncidents(incidents.map(incident => 
      incident.id === id ? { ...incident, status: "resolved" } : incident
    ))
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({ ...selectedIncident, status: "resolved" })
    }
  }

  // Toggle system visibility
  const toggleSystem = (system) => {
    setSelectedSystems({
      ...selectedSystems,
      [system]: !selectedSystems[system]
    })
  }

  // Toggle focus mode
  const toggleFocusMode = () => {
    setFocusMode(!focusMode)
  }

  // Toggle labels visibility
  const toggleLabels = () => {
    setShowLabels(!showLabels)
  }

  // Reset camera position
  const resetCamera = () => {
    // This will be handled by the ThreeDViewer component
    // We just need to trigger a re-render with the same props
    const tempViewMode = viewMode
    setViewMode("reset")
    setTimeout(() => {
      setViewMode(tempViewMode)
    }, 10)
  }

  // Open settings dialog
  const openSettings = () => {
    setIsSettingsOpen(true)
  }

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowSidebar(false)
      } else {
        setShowSidebar(true)
      }
    }
    
    // Initial check
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-full lg:w-80 border-r bg-card overflow-auto lg:h-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Digital Twin</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSidebar(false)}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="incidents" className="p-4">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>

            <TabsContent value="incidents" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => (
                    <IncidentCard 
                      key={incident.id} 
                      incident={incident} 
                      isSelected={selectedIncident?.id === incident.id}
                      onSelect={() => handleIncidentSelect(incident)}
                      onResolve={() => handleResolveIncident(incident.id)}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No incidents match your filters
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="layers" className="space-y-4">
              <div className="space-y-2">
                <Label>Floor</Label>
                <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {floors.map((floor) => (
                    <SelectItem key={floor.value} value={floor.value}>
                      {floor.label}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Systems</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <span>HVAC System</span>
                    </div>
                    <Switch 
                      checked={selectedSystems.hvac} 
                      onCheckedChange={() => toggleSystem('hvac')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span>Electrical System</span>
                    </div>
                    <Switch 
                      checked={selectedSystems.electrical} 
                      onCheckedChange={() => toggleSystem('electrical')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <span>Plumbing System</span>
                    </div>
                    <Switch 
                      checked={selectedSystems.plumbing} 
                      onCheckedChange={() => toggleSystem('plumbing')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span>Security System</span>
                    </div>
                    <Switch 
                      checked={selectedSystems.security} 
                      onCheckedChange={() => toggleSystem('security')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                      <span>Lighting System</span>
                    </div>
                    <Switch 
                      checked={selectedSystems.lighting} 
                      onCheckedChange={() => toggleSystem('lighting')} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Display Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Show Labels</span>
                    <Switch 
                      checked={showLabels} 
                      onCheckedChange={setShowLabels} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Focus Mode</span>
                    <Switch 
                      checked={focusMode} 
                      onCheckedChange={setFocusMode} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-2 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!showSidebar && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSidebar(true)}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center border rounded-md">
              <Button 
                variant={viewMode === "3d" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("3d")}
                className="rounded-r-none"
              >
                <Cube className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">3D</span>
              </Button>
              <Button 
                variant={viewMode === "2d" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("2d")}
                className="rounded-l-none"
              >
                <Layers className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">2D</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={resetCamera}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFocusMode}>
              {focusMode ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={toggleLabels}>
              {showLabels ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={openSettings}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="flex-1 relative">
          <ThreeDViewer 
            incidents={incidents}
            sensors={sensors}
            selectedIncident={selectedIncident}
            onIncidentSelect={handleIncidentSelect}
            showLabels={showLabels}
            focusMode={focusMode}
            selectedFloor={selectedFloor}
            selectedSystems={selectedSystems}
            viewMode={viewMode}
            
          />

          {/* Incident details overlay */}
          {selectedIncident && (
            <div className="absolute bottom-4 right-4 w-full sm:w-80 px-4 sm:px-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full w-3 h-3 ${
                        selectedIncident.severity === "critical" 
                          ? "bg-red-500" 
                          : selectedIncident.severity === "warning"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`} />
                      <CardTitle className="text-base">{selectedIncident.title}</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => setSelectedIncident(null)}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{selectedIncident.location}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <p>{selectedIncident.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Reading:</span>
                        <span className="ml-1 font-medium">{selectedIncident.reading}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Threshold:</span>
                        <span className="ml-1 font-medium">{selectedIncident.threshold}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <span className="ml-1">{selectedIncident.timestamp}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`ml-1 capitalize ${
                          selectedIncident.status === "active" 
                            ? "text-red-500" 
                            : "text-green-500"
                        }`}>
                          {selectedIncident.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    {selectedIncident.status === "active" && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleResolveIncident(selectedIncident.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
      

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Digital Twin Settings</DialogTitle>
            <DialogDescription>
              Configure visualization and interaction settings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="render-quality">Render Quality</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="render-quality">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Better Performance)</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High (Better Quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="camera-speed">Camera Speed</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="camera-speed">
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-rotate">Auto Rotate</Label>
                <Switch id="auto-rotate" />
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically rotate the model when idle
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid">Show Grid</Label>
                <Switch id="show-grid" defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                Display the reference grid under the model
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-shadows">Show Shadows</Label>
                <Switch id="show-shadows" defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                Enable realistic shadows (may affect performance)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsSettingsOpen(false)}>Apply Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}