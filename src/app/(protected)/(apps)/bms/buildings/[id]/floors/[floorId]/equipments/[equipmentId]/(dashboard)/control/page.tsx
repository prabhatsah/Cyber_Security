"use client"

import { useState } from "react"
import {
  Thermometer,
  Droplets,
  Wind,
  Lightbulb,
  Power,
  Lock,
  Unlock,
  AlertTriangle,
  Check,
  Save
} from "lucide-react"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Slider } from "@/shadcn/ui/slider"
import { Switch } from "@/shadcn/ui/switch"
import { Label } from "@/shadcn/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"
import TemperatureTab from "./components/temperature-tab"
import PressureTab from "./components/pressure-tab"
import Co2Tab from "./components/co2-tab"
import { useHvac } from "../context/HvacContext" // adjust the path accordingly


export default function ControlPage() {

  // Lighting controls
  const [lightingZone, setLightingZone] = useState("all")
  const [brightness, setBrightness] = useState(75)
  const [lightingMode, setLightingMode] = useState("auto")
  const [lightingPower, setLightingPower] = useState(true)

  // Security controls
  const [securityMode, setSecurityMode] = useState("armed")
  const [doorsLocked, setDoorsLocked] = useState(true)
  const [cameraActive, setCameraActive] = useState(true)
  const [motionDetection, setMotionDetection] = useState(true)

  // Access controls
  const [accessZone, setAccessZone] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Control Interface</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Override</span>
          </Button>
          <Button variant="default" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="temperature" className="space-y-4">
        <TabsList>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="pressure">Pressure</TabsTrigger>
          <TabsTrigger value="co2">CO2</TabsTrigger>
          {/* <TabsTrigger value="lighting">Lighting</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger> */}
        </TabsList>

        <TabsContent value="temperature" className="space-y-4">
          <TemperatureTab />
        </TabsContent>

        {/* Pressure table content */}
        <TabsContent value="pressure" className="space-y-4">
          <PressureTab />
        </TabsContent>

        {/* CO2 table content */}
        <TabsContent value="co2" className="space-y-4"> 
          <Co2Tab /> 
        </TabsContent>

        <TabsContent value="lighting" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lighting Control</CardTitle>
                    <CardDescription>
                      Adjust lighting settings
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="lighting-power">Power</Label>
                    <Switch
                      id="lighting-power"
                      checked={lightingPower}
                      onCheckedChange={setLightingPower}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Brightness</Label>
                    <span className="text-2xl font-bold">{brightness}%</span>
                  </div>
                  <Slider
                    value={[brightness]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setBrightness(value[0])}
                    disabled={!lightingPower}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lighting-mode">Mode</Label>
                    <Select
                      value={lightingMode}
                      onValueChange={setLightingMode}
                      disabled={!lightingPower}
                    >
                      <SelectTrigger id="lighting-mode">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto (Occupancy)</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="schedule">Scheduled</SelectItem>
                        <SelectItem value="daylight">Daylight Sensing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lighting-zone">Zone</Label>
                    <Select
                      value={lightingZone}
                      onValueChange={setLightingZone}
                      disabled={!lightingPower}
                    >
                      <SelectTrigger id="lighting-zone">
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        <SelectItem value="zone-a">Zone A (Offices)</SelectItem>
                        <SelectItem value="zone-b">Zone B (Meeting Rooms)</SelectItem>
                        <SelectItem value="zone-c">Zone C (Common Areas)</SelectItem>
                        <SelectItem value="zone-d">Zone D (Technical)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" disabled={!lightingPower}>Reset</Button>
                <Button disabled={!lightingPower}>Apply</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scene Control</CardTitle>
                <CardDescription>
                  Preset lighting configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-20 flex flex-col gap-1">
                    <Lightbulb className="h-5 w-5" />
                    <span>Working</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-1">
                    <Lightbulb className="h-5 w-5" />
                    <span>Presentation</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-1">
                    <Lightbulb className="h-5 w-5" />
                    <span>Evening</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-1">
                    <Lightbulb className="h-5 w-5" />
                    <span>Night</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Create New Scene</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Security System</CardTitle>
                    <CardDescription>
                      Control building security
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${securityMode === "armed" ? "text-green-500" : "text-amber-500"}`}>
                      {securityMode === "armed" ? "Armed" : "Disarmed"}
                    </span>
                  </div>
                </div>
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
                      <span>Door Locks</span>
                    </div>
                    <Switch
                      checked={doorsLocked}
                      onCheckedChange={setDoorsLocked}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-muted-foreground" />
                      <span>Cameras</span>
                    </div>
                    <Switch
                      checked={cameraActive}
                      onCheckedChange={setCameraActive}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                      <span>Motion Detection</span>
                    </div>
                    <Switch
                      checked={motionDetection}
                      onCheckedChange={setMotionDetection}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Emergency Override</Button>
                <Button>Apply Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Zones</CardTitle>
                <CardDescription>
                  Zone-specific security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <span>Zone A (Offices)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Secured</span>
                      <Switch checked={true} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <span>Zone B (Meeting Rooms)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Secured</span>
                      <Switch checked={true} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <span>Zone C (Common Areas)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-amber-500">Open</span>
                      <Switch checked={false} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <span>Zone D (Technical)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Secured</span>
                      <Switch checked={true} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Secure All Zones</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>
                Manage building access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Access control interface will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}