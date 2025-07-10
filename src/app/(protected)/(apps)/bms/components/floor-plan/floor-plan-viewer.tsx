"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Button } from "@/shadcn/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Badge } from "@/shadcn/ui/badge"
import { Switch } from "@/shadcn/ui/switch"
import { Label } from "@/shadcn/ui/label"
import { Slider } from "@/shadcn/ui/slider"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/shadcn/ui/resizable"
import { ScrollArea } from "@/shadcn/ui/scroll-area"
import { Thermometer, Fan, Lightbulb, Activity, Zap, Lock, ChevronRight, Eye, Download, Share2, ZoomIn, ZoomOut, RotateCw, Move, Layers, Maximize2, PanelTopClose, Focus, Theater as Thermostat, Gauge, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip"

export function FloorPlanViewer() {
  const [floorLevel, setFloorLevel] = useState("floor-1")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showHvac, setShowHvac] = useState(true)
  const [showLighting, setShowLighting] = useState(true)
  const [showSecurity, setShowSecurity] = useState(true)
  const [showMeters, setShowMeters] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showAlerts, setShowAlerts] = useState(true)
  const [selectedSystem, setSelectedSystem] = useState("all")
  
  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 20)
    }
  }
  
  const handleZoomOut = () => {
    if (zoomLevel > 40) {
      setZoomLevel(zoomLevel - 20)
    }
  }
  
  const handleZoomReset = () => {
    setZoomLevel(100)
  }
  
  const deviceData = [
    { id: "ahu-1", type: "hvac", name: "AHU-1", status: "normal", value: "72°F", icon: Fan, position: { top: 25, left: 35 } },
    { id: "vav-101", type: "hvac", name: "VAV-101", status: "warning", value: "68°F", icon: Thermostat, position: { top: 45, left: 25 } },
    { id: "vav-102", type: "hvac", name: "VAV-102", status: "normal", value: "72°F", icon: Thermostat, position: { top: 45, left: 45 } },
    { id: "vav-103", type: "hvac", name: "VAV-103", status: "normal", value: "73°F", icon: Thermostat, position: { top: 45, left: 65 } },
    { id: "lt-zone1", type: "lighting", name: "LT-ZONE1", status: "normal", value: "On", icon: Lightbulb, position: { top: 30, left: 55 } },
    { id: "lt-zone2", type: "lighting", name: "LT-ZONE2", status: "normal", value: "Off", icon: Lightbulb, position: { top: 70, left: 70 } },
    { id: "lt-zone3", type: "lighting", name: "LT-ZONE3", status: "normal", value: "80%", icon: Lightbulb, position: { top: 70, left: 25 } },
    { id: "ac-door1", type: "security", name: "AC-DOOR1", status: "alarm", value: "Open", icon: Lock, position: { top: 85, left: 50 } },
    { id: "ac-door2", type: "security", name: "AC-DOOR2", status: "normal", value: "Closed", icon: Lock, position: { top: 15, left: 50 } },
    { id: "em-main", type: "meter", name: "EM-MAIN", status: "normal", value: "45.2 kW", icon: Zap, position: { top: 10, left: 20 } },
    { id: "em-hvac", type: "meter", name: "EM-HVAC", status: "normal", value: "22.8 kW", icon: Zap, position: { top: 10, left: 80 } },
  ]
  
  // Filter devices based on visibility settings and selected system
  const visibleDevices = deviceData.filter(device => {
    if (selectedSystem !== "all" && device.type !== selectedSystem) return false
    if (device.type === "hvac" && !showHvac) return false
    if (device.type === "lighting" && !showLighting) return false
    if (device.type === "security" && !showSecurity) return false
    if (device.type === "meter" && !showMeters) return false
    return true
  })
  
  // Only show alerts if alerts toggle is on
  const visibleAlerts = showAlerts ? deviceData.filter(device => device.status === "warning" || device.status === "alarm") : []
  
  const getStatusColor = (status) => {
    switch (status) {
      case "normal": return "bg-green-500"
      case "warning": return "bg-amber-500"
      case "alarm": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }
  
  const getDeviceIcon = (device) => {
    const IconComponent = device.icon
    
    let iconColor = "text-foreground"
    if (device.status === "warning") iconColor = "text-amber-500"
    if (device.status === "alarm") iconColor = "text-red-500"
    
    return <IconComponent className={`h-5 w-5 ${iconColor}`} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Floor Plan</h2>
          <p className="text-muted-foreground">
            Interactive building equipment and monitoring view
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={floorLevel} onValueChange={setFloorLevel}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="floor-1">1st Floor</SelectItem>
              <SelectItem value="floor-2">2nd Floor</SelectItem>
              <SelectItem value="floor-3">3rd Floor</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Live View
          </Button>
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="flex h-full flex-col">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium">Systems</h3>
            </div>
            <Tabs defaultValue="systems" className="flex-1">
              <div className="border-b px-4">
                <TabsList className="w-full">
                  <TabsTrigger value="systems" className="flex-1">Systems</TabsTrigger>
                  <TabsTrigger value="alerts" className="flex-1">Alerts</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="systems" className="flex-1 p-0">
                <ScrollArea className="h-[530px]">
                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium uppercase text-muted-foreground">
                        Visibility Controls
                      </Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Fan className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="show-hvac" className="text-sm">HVAC Systems</Label>
                          </div>
                          <Switch
                            id="show-hvac"
                            checked={showHvac}
                            onCheckedChange={setShowHvac}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Lightbulb className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="show-lighting" className="text-sm">Lighting</Label>
                          </div>
                          <Switch
                            id="show-lighting"
                            checked={showLighting}
                            onCheckedChange={setShowLighting}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="show-security" className="text-sm">Security</Label>
                          </div>
                          <Switch
                            id="show-security"
                            checked={showSecurity}
                            onCheckedChange={setShowSecurity}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="show-meters" className="text-sm">Meters</Label>
                          </div>
                          <Switch
                            id="show-meters"
                            checked={showMeters}
                            onCheckedChange={setShowMeters}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <PanelTopClose className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="show-labels" className="text-sm">Labels</Label>
                          </div>
                          <Switch
                            id="show-labels"
                            checked={showLabels}
                            onCheckedChange={setShowLabels}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="show-alerts" className="text-sm">Alerts</Label>
                          </div>
                          <Switch
                            id="show-alerts"
                            checked={showAlerts}
                            onCheckedChange={setShowAlerts}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-1.5">
                      <Label className="text-xs font-medium uppercase text-muted-foreground">
                        Filter By System
                      </Label>
                      <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select system" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Systems</SelectItem>
                          <SelectItem value="hvac">HVAC Only</SelectItem>
                          <SelectItem value="lighting">Lighting Only</SelectItem>
                          <SelectItem value="security">Security Only</SelectItem>
                          <SelectItem value="meter">Meters Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4 space-y-1.5">
                      <Label className="text-xs font-medium uppercase text-muted-foreground">
                        Equipment List
                      </Label>
                      <div className="space-y-2">
                        {visibleDevices.map((device) => (
                          <Button
                            key={device.id}
                            variant="ghost"
                            className="w-full justify-start px-2 py-1.5 h-auto"
                          >
                            <div className="flex items-center w-full">
                              <div className="mr-2">{getDeviceIcon(device)}</div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-medium">{device.name}</div>
                                <div className="text-xs text-muted-foreground">{device.value}</div>
                              </div>
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(device.status)}`} />
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="alerts" className="flex-1 p-0">
                <ScrollArea className="h-[530px]">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Active Alerts</h3>
                      <Badge variant="outline">{visibleAlerts.length}</Badge>
                    </div>
                    
                    {visibleAlerts.length > 0 ? (
                      <div className="space-y-3">
                        {visibleAlerts.map((alert) => (
                          <div key={alert.id} className="rounded-md border p-3">
                            <div className="flex items-start">
                              <div className={`mt-0.5 h-2 w-2 rounded-full ${getStatusColor(alert.status)}`} />
                              <div className="ml-2 space-y-1">
                                <div className="flex items-center gap-1">
                                  {getDeviceIcon(alert)}
                                  <span className="text-sm font-medium">{alert.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {alert.status === "warning" ? 
                                    "Value outside normal range" : 
                                    "Critical condition detected"}
                                </p>
                                <div className="flex items-center text-xs font-medium">
                                  <span>Current value: </span>
                                  <span className={alert.status === "warning" ? "text-amber-500 ml-1" : "text-red-500 ml-1"}>
                                    {alert.value}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-end space-x-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                Acknowledge
                              </Button>
                              <Button size="sm" className="h-7 px-2 text-xs">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                        <div className="flex flex-col items-center text-center">
                          <Activity className="h-10 w-10 text-muted-foreground/60" />
                          <h3 className="mt-4 text-sm font-medium">No Active Alerts</h3>
                          <p className="mt-2 text-xs text-muted-foreground">
                            All systems are operating normally
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={80}>
          <div className="flex h-full flex-col">
            <div className="border-b px-4 py-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Floor Plan: {floorLevel === "floor-1" ? "1st Floor" : floorLevel === "floor-2" ? "2nd Floor" : "3rd Floor"}</h3>
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom Out</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <span className="text-xs">{zoomLevel}%</span>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom In</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomReset}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset Zoom</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Move className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Pan</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Layers className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Layers</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fullscreen</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="relative flex-1 bg-muted/30">
              {/* Simulated floor plan - would be replaced with actual SVG floor plan */}
              <div
                className="absolute inset-0 m-auto h-[80%] w-[80%] overflow-hidden rounded-lg border-2 border-dashed border-muted"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                {/* Simple floor plan layout */}
                <div className="absolute inset-0 bg-background">
                  {/* Outer walls */}
                  <div className="absolute inset-0 border-8 border-muted-foreground/20 rounded-lg"></div>
                  
                  {/* Interior walls */}
                  <div className="absolute top-[10%] bottom-[10%] left-[50%] w-1 bg-muted-foreground/20"></div>
                  <div className="absolute top-[50%] right-[10%] left-[10%] h-1 bg-muted-foreground/20"></div>
                  <div className="absolute top-[10%] bottom-[50%] left-[25%] w-1 bg-muted-foreground/20"></div>
                  <div className="absolute top-[50%] bottom-[10%] left-[25%] w-1 bg-muted-foreground/20"></div>
                  <div className="absolute top-[50%] bottom-[10%] right-[25%] w-1 bg-muted-foreground/20"></div>
                  
                  {/* Room labels if showLabels is true */}
                  {showLabels && (
                    <>
                      <div className="absolute top-[25%] left-[12.5%] transform -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        Office 101
                      </div>
                      <div className="absolute top-[25%] left-[37.5%] transform -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        Office 102
                      </div>
                      <div className="absolute top-[25%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        Meeting Room
                      </div>
                      <div className="absolute top-[75%] left-[12.5%] transform -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        Break Room
                      </div>
                      <div className="absolute top-[75%] left-[37.5%] transform -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        Storage
                      </div>
                      <div className="absolute top-[75%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        Reception
                      </div>
                    </>
                  )}
                  
                  {/* Entrance */}
                  <div className="absolute bottom-0 left-[50%] h-2 w-10 transform -translate-x-1/2 bg-muted"></div>
                  
                  {/* Plot devices on the floor plan */}
                  {visibleDevices.map((device) => (
                    <TooltipProvider key={device.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={`absolute rounded-full p-1.5 ${
                              device.status === "normal" 
                                ? "bg-green-500/10"
                                : device.status === "warning"
                                ? "bg-amber-500/10"
                                : "bg-red-500/10"
                            }`}
                            style={{
                              top: `${device.position.top}%`,
                              left: `${device.position.left}%`,
                            }}
                          >
                            {getDeviceIcon(device)}
                            {showLabels && (
                              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] whitespace-nowrap">
                                {device.name}
                              </span>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="space-y-1">
                            <div className="font-medium">{device.name}</div>
                            <div className="text-xs">{device.value}</div>
                            <div className="flex items-center text-xs">
                              <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(device.status)} mr-1`}></span>
                              <span>
                                {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <span className="text-xs">Normal</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-xs">Warning</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                  <span className="text-xs">Alarm</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Gauge className="mr-2 h-4 w-4" />
                  View Metrics
                </Button>
                <Button size="sm">
                  <Focus className="mr-2 h-4 w-4" />
                  Select Equipment
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}