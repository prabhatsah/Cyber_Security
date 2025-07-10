"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Switch } from "@/shadcn/ui/switch"
import { Label } from "@/shadcn/ui/label"
import { Input } from "@/shadcn/ui/input"
import { Textarea } from "@/shadcn/ui/textarea"
import { Slider } from "@/shadcn/ui/slider"
import { Button } from "@/shadcn/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shadcn/ui/select"
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/shadcn/ui/form"
import { Checkbox } from "@/shadcn/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group"
import { 
  Thermometer, 
  Lightbulb, 
  Fan, 
  Lock, 
  Waves, 
  ToggleLeft, 
  Network, 
  Router, 
  Cog,
  Code,
  HelpCircle,
  Share2,
  Save,
  Cpu,
  AlertTriangle,
  Info
} from "lucide-react"
import { Badge } from "@/shadcn/ui/badge"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip"
import { ScrollArea } from "@/shadcn/ui/scroll-area"

interface SystemOption {
  id: string
  name: string
  description: string
  icon: React.ElementType
  enabled: boolean
  integration: string
  protocolOptions: string[]
}

export function SystemsConfig() {
  const [hvacOptions, setHvacOptions] = useState({
    hasVav: true,
    hasFcus: true,
    hasAhu: true,
    hasChillers: false,
    hasCoolingTowers: false,
    hasBoilers: true,
  })
  
  const [lightingOptions, setLightingOptions] = useState({
    hasDaylight: true,
    hasOccupancy: true,
    hasScheduling: true,
    hasDimming: true,
    hasRgb: false,
  })

  const [systems, setSystems] = useState<SystemOption[]>([
    {
      id: "hvac",
      name: "HVAC System",
      description: "Heating, ventilation, and air conditioning controls",
      icon: Thermometer,
      enabled: true,
      integration: "bacnet",
      protocolOptions: ["BACnet/IP", "Modbus", "LON", "Proprietary"]
    },
    {
      id: "lighting",
      name: "Lighting Controls",
      description: "Smart lighting controls and management",
      icon: Lightbulb,
      enabled: true,
      integration: "bacnet",
      protocolOptions: ["BACnet/IP", "DALI", "KNX", "Zigbee", "Proprietary"]
    },
    {
      id: "access",
      name: "Access Control",
      description: "Security and access management",
      icon: Lock,
      enabled: true,
      integration: "proprietary",
      protocolOptions: ["BACnet/IP", "OSDP", "Wiegand", "REST API", "Proprietary"]
    },
    {
      id: "airquality",
      name: "Air Quality",
      description: "Indoor air quality monitoring and control",
      icon: Waves,
      enabled: false,
      integration: "bacnet",
      protocolOptions: ["BACnet/IP", "Modbus", "REST API", "Proprietary"]
    },
    {
      id: "energymeters",
      name: "Energy Meters",
      description: "Power and energy consumption monitoring",
      icon: ToggleLeft,
      enabled: true,
      integration: "modbus",
      protocolOptions: ["BACnet/IP", "Modbus", "M-Bus", "Proprietary"]
    },
  ])
  
  const [networkSettings, setNetworkSettings] = useState({
    networkType: "dedicated",
    ipRangeStart: "192.168.1.1",
    ipRangeEnd: "192.168.1.254",
    subnet: "255.255.255.0",
    scanSpeed: 50,
    useDhcp: true,
    port: 47808,
    timeout: 5000,
    retries: 3
  })
  
  const [parserSettings, setParserSettings] = useState({
    delimiter: ".",
    customRegex: "",
    parseMode: "standard",
    ignorePrefixes: "",
    useAiTagging: true,
    useProjectHaystack: true,
    confidenceThreshold: 85
  })
  
  const handleSystemToggle = (id: string, enabled: boolean) => {
    setSystems(systems.map(system => 
      system.id === id ? { ...system, enabled } : system
    ))
  }
  
  const handleIntegrationChange = (id: string, integration: string) => {
    setSystems(systems.map(system => 
      system.id === id ? { ...system, integration } : system
    ))
  }
  
  const handleHvacOptionChange = (option: keyof typeof hvacOptions, checked: boolean) => {
    setHvacOptions({
      ...hvacOptions,
      [option]: checked
    })
  }
  
  const handleLightingOptionChange = (option: keyof typeof lightingOptions, checked: boolean) => {
    setLightingOptions({
      ...lightingOptions,
      [option]: checked
    })
  }
  
  const handleParserSettingChange = (setting: keyof typeof parserSettings, value: any) => {
    setParserSettings({
      ...parserSettings,
      [setting]: value
    })
  }
  
  const handleNetworkSettingChange = (setting: keyof typeof networkSettings, value: any) => {
    setNetworkSettings({
      ...networkSettings,
      [setting]: value
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="systems" className="space-y-4">
        <TabsList>
          <TabsTrigger value="systems">Building Systems</TabsTrigger>
          <TabsTrigger value="discovery">Device Discovery</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="systems" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {systems.map((system) => (
              <Card key={system.id} className={`transition-all duration-200 ${!system.enabled ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-md ${system.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <system.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{system.name}</CardTitle>
                        <CardDescription>{system.description}</CardDescription>
                      </div>
                    </div>
                    <Switch 
                      checked={system.enabled}
                      onCheckedChange={(checked) => handleSystemToggle(system.id, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`space-y-4 ${!system.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="space-y-2">
                      <Label htmlFor={`${system.id}-integration`}>Integration Type</Label>
                      <Select 
                        disabled={!system.enabled}
                        value={system.integration}
                        onValueChange={(value) => handleIntegrationChange(system.id, value)}
                      >
                        <SelectTrigger id={`${system.id}-integration`}>
                          <SelectValue placeholder="Select integration type" />
                        </SelectTrigger>
                        <SelectContent>
                          {system.protocolOptions.map((option) => (
                            <SelectItem key={option.toLowerCase().replace(/\W/g, '')} value={option.toLowerCase().replace(/\W/g, '')}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {system.id === "hvac" && system.enabled && (
                      <div className="space-y-3 pt-2">
                        <Label className="text-sm font-medium">HVAC Equipment Types</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="vav-option"
                              checked={hvacOptions.hasVav}
                              onCheckedChange={(checked) => 
                                handleHvacOptionChange('hasVav', checked as boolean)
                              }
                            />
                            <Label htmlFor="vav-option" className="text-sm font-normal">VAV Boxes</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="fcu-option"
                              checked={hvacOptions.hasFcus}
                              onCheckedChange={(checked) => 
                                handleHvacOptionChange('hasFcus', checked as boolean)
                              }
                            />
                            <Label htmlFor="fcu-option" className="text-sm font-normal">FCUs</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="ahu-option"
                              checked={hvacOptions.hasAhu}
                              onCheckedChange={(checked) => 
                                handleHvacOptionChange('hasAhu', checked as boolean)
                              }
                            />
                            <Label htmlFor="ahu-option" className="text-sm font-normal">AHUs</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="chillers-option"
                              checked={hvacOptions.hasChillers}
                              onCheckedChange={(checked) => 
                                handleHvacOptionChange('hasChillers', checked as boolean)
                              }
                            />
                            <Label htmlFor="chillers-option" className="text-sm font-normal">Chillers</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="cooling-towers-option"
                              checked={hvacOptions.hasCoolingTowers}
                              onCheckedChange={(checked) => 
                                handleHvacOptionChange('hasCoolingTowers', checked as boolean)
                              }
                            />
                            <Label htmlFor="cooling-towers-option" className="text-sm font-normal">Cooling Towers</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="boilers-option"
                              checked={hvacOptions.hasBoilers}
                              onCheckedChange={(checked) => 
                                handleHvacOptionChange('hasBoilers', checked as boolean)
                              }
                            />
                            <Label htmlFor="boilers-option" className="text-sm font-normal">Boilers</Label>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {system.id === "lighting" && system.enabled && (
                      <div className="space-y-3 pt-2">
                        <Label className="text-sm font-medium">Lighting Features</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="daylight-option"
                              checked={lightingOptions.hasDaylight}
                              onCheckedChange={(checked) => 
                                handleLightingOptionChange('hasDaylight', checked as boolean)
                              }
                            />
                            <Label htmlFor="daylight-option" className="text-sm font-normal">Daylight Harvesting</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="occupancy-option"
                              checked={lightingOptions.hasOccupancy}
                              onCheckedChange={(checked) => 
                                handleLightingOptionChange('hasOccupancy', checked as boolean)
                              }
                            />
                            <Label htmlFor="occupancy-option" className="text-sm font-normal">Occupancy Sensing</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="scheduling-option"
                              checked={lightingOptions.hasScheduling}
                              onCheckedChange={(checked) => 
                                handleLightingOptionChange('hasScheduling', checked as boolean)
                              }
                            />
                            <Label htmlFor="scheduling-option" className="text-sm font-normal">Scheduling</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="dimming-option"
                              checked={lightingOptions.hasDimming}
                              onCheckedChange={(checked) => 
                                handleLightingOptionChange('hasDimming', checked as boolean)
                              }
                            />
                            <Label htmlFor="dimming-option" className="text-sm font-normal">Dimming Control</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="rgb-option"
                              checked={lightingOptions.hasRgb}
                              onCheckedChange={(checked) => 
                                handleLightingOptionChange('hasRgb', checked as boolean)
                              }
                            />
                            <Label htmlFor="rgb-option" className="text-sm font-normal">RGB/Tunable White</Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="discovery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">BACnet/IP Network Configuration</CardTitle>
              <CardDescription>
                Configure network settings for BACnet device discovery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="mb-4">
                    <Label className="text-sm font-medium">Network Type</Label>
                    <RadioGroup 
                      defaultValue={networkSettings.networkType}
                      onValueChange={(value) => handleNetworkSettingChange('networkType', value)}
                      className="flex flex-col space-y-1 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dedicated" id="dedicated" />
                        <Label htmlFor="dedicated" className="font-normal">Dedicated BACnet Network</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shared" id="shared" />
                        <Label htmlFor="shared" className="font-normal">Shared IT Network</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vlan" id="vlan" />
                        <Label htmlFor="vlan" className="font-normal">VLAN Segregated</Label>
                      </div>
                    </RadioGroup>
                  </div>
                    
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id="use-dhcp" 
                      checked={networkSettings.useDhcp}
                      onCheckedChange={(checked) => 
                        handleNetworkSettingChange('useDhcp', checked as boolean)
                      }
                    />
                    <Label htmlFor="use-dhcp">Use DHCP</Label>
                  </div>
                  
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${networkSettings.useDhcp ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="space-y-2">
                      <Label htmlFor="ip-range-start">IP Range Start</Label>
                      <Input 
                        id="ip-range-start"
                        value={networkSettings.ipRangeStart}
                        onChange={(e) => handleNetworkSettingChange('ipRangeStart', e.target.value)}
                        placeholder="192.168.1.1"
                        disabled={networkSettings.useDhcp}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ip-range-end">IP Range End</Label>
                      <Input 
                        id="ip-range-end"
                        value={networkSettings.ipRangeEnd}
                        onChange={(e) => handleNetworkSettingChange('ipRangeEnd', e.target.value)}
                        placeholder="192.168.1.254"
                        disabled={networkSettings.useDhcp}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subnet">Subnet Mask</Label>
                      <Input 
                        id="subnet"
                        value={networkSettings.subnet}
                        onChange={(e) => handleNetworkSettingChange('subnet', e.target.value)}
                        placeholder="255.255.255.0"
                        disabled={networkSettings.useDhcp}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="scan-speed">Scan Speed</Label>
                      <span className="text-xs text-muted-foreground">{networkSettings.scanSpeed}%</span>
                    </div>
                    <Slider
                      id="scan-speed"
                      min={10}
                      max={100}
                      step={5}
                      value={[networkSettings.scanSpeed]}
                      onValueChange={(value) => handleNetworkSettingChange('scanSpeed', value[0])}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Slower (more reliable)</span>
                      <span className="text-xs text-muted-foreground">Faster</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bacnet-port">BACnet Port</Label>
                      <Input 
                        id="bacnet-port"
                        type="number"
                        value={networkSettings.port}
                        onChange={(e) => handleNetworkSettingChange('port', parseInt(e.target.value))}
                        placeholder="47808"
                      />
                      <p className="text-xs text-muted-foreground">Default is 47808 (BAC0)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeout">Timeout (ms)</Label>
                      <Input 
                        id="timeout"
                        type="number"
                        value={networkSettings.timeout}
                        onChange={(e) => handleNetworkSettingChange('timeout', parseInt(e.target.value))}
                        placeholder="5000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="retries">Retries</Label>
                      <Input 
                        id="retries"
                        type="number"
                        min={1}
                        max={10}
                        value={networkSettings.retries}
                        onChange={(e) => handleNetworkSettingChange('retries', parseInt(e.target.value))}
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center pt-4 border-t">
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Test Network Connectivity</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Verify BACnet/IP network accessibility before starting discovery
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  <Network className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discovery Preview</CardTitle>
              <CardDescription>
                Example of discovered devices and data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 border rounded-md bg-muted/40 space-x-4">
                <div className="flex flex-col items-center">
                  <Router className="h-12 w-12 text-muted-foreground mb-2" />
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                    BACnet Router
                  </Badge>
                  <span className="text-xs text-muted-foreground mt-2">Device ID: 123456</span>
                </div>
                
                <div className="h-px w-8 bg-border"></div>
                
                <div className="flex flex-col items-center">
                  <Cpu className="h-12 w-12 text-muted-foreground mb-2" />
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                    BACnet Controller
                  </Badge>
                  <span className="text-xs text-muted-foreground mt-2">Device ID: 789012</span>
                </div>
                
                <div className="h-px w-8 bg-border"></div>
                
                <div className="flex flex-col items-center">
                  <Fan className="h-12 w-12 text-muted-foreground mb-2" />
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                    BACnet Device
                  </Badge>
                  <span className="text-xs text-muted-foreground mt-2">24 Data Points</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Info className="mr-2 h-4 w-4" />
                  <span>Discovery will scan the network when you complete onboarding</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        The system will automatically discover and index BACnet devices 
                        and their data points based on the configuration.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">BACnet Object Parsing Configuration</CardTitle>
              <CardDescription>
                Configure how BACnet object names are parsed into a hierarchical structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delimiter">Delimiter Character</Label>
                    <div className="relative">
                      <Input 
                        id="delimiter"
                        value={parserSettings.delimiter}
                        onChange={(e) => handleParserSettingChange('delimiter', e.target.value)}
                        placeholder="."
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute right-0 top-0 h-full"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              The character used to separate hierarchical components in BACnet object names. 
                              Common delimiters include ".", "_", "-", or ":".
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Example: "Floor1.AHU1.ZoneTemp" uses "." as delimiter
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parse-mode">Parsing Mode</Label>
                    <Select
                      value={parserSettings.parseMode}
                      onValueChange={(value) => handleParserSettingChange('parseMode', value)}
                    >
                      <SelectTrigger id="parse-mode">
                        <SelectValue placeholder="Select parsing mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (Floor > System > Equipment > Point)</SelectItem>
                        <SelectItem value="custom">Custom Regex Pattern</SelectItem>
                        <SelectItem value="haystack">Project Haystack Compatible</SelectItem>
                        <SelectItem value="ashrae">ASHRAE 223P Compatible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {parserSettings.parseMode === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-regex">Custom Regex Pattern</Label>
                    <Input 
                      id="custom-regex"
                      value={parserSettings.customRegex}
                      onChange={(e) => handleParserSettingChange('customRegex', e.target.value)}
                      placeholder="^(\w+)\.(\w+)\.(\w+)$"
                    />
                    <p className="text-xs text-muted-foreground">
                      Define capture groups for (Floor)(System)(Equipment)(Point)
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="ignore-prefixes">Ignore Prefixes</Label>
                  <Input 
                    id="ignore-prefixes"
                    value={parserSettings.ignorePrefixes}
                    onChange={(e) => handleParserSettingChange('ignorePrefixes', e.target.value)}
                    placeholder="BMS,CTRL,SYS"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of prefixes to ignore during parsing
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Tagging Configuration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ai-tagging">AI-Assisted Tagging</Label>
                      <p className="text-xs text-muted-foreground">
                        Use AI to automatically apply semantic tags to data points
                      </p>
                    </div>
                    <Switch 
                      id="ai-tagging"
                      checked={parserSettings.useAiTagging}
                      onCheckedChange={(checked) => 
                        handleParserSettingChange('useAiTagging', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="haystack-tagging">Project Haystack Tags</Label>
                      <p className="text-xs text-muted-foreground">
                        Apply standard Project Haystack tags to data points
                      </p>
                    </div>
                    <Switch 
                      id="haystack-tagging"
                      checked={parserSettings.useProjectHaystack}
                      onCheckedChange={(checked) => 
                        handleParserSettingChange('useProjectHaystack', checked)
                      }
                    />
                  </div>
                  
                  <div className={`space-y-2 ${!parserSettings.useAiTagging ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="confidence-threshold">AI Confidence Threshold</Label>
                      <span className="text-xs text-muted-foreground">{parserSettings.confidenceThreshold}%</span>
                    </div>
                    <Slider
                      id="confidence-threshold"
                      min={50}
                      max={99}
                      step={1}
                      disabled={!parserSettings.useAiTagging}
                      value={[parserSettings.confidenceThreshold]}
                      onValueChange={(value) => handleParserSettingChange('confidenceThreshold', value[0])}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">More tags (less accurate)</span>
                      <span className="text-xs text-muted-foreground">Fewer tags (more accurate)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-4">Example Parsing Result</h4>
                <div className="rounded-md border bg-card p-4">
                  <div className="text-sm mb-3">
                    <span className="font-mono text-muted-foreground">Input:</span> 
                    <span className="font-mono font-medium ml-2">Floor1.AHU2.DischargeAir.Temperature</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <span className="w-24 text-muted-foreground">Floor:</span>
                        <Badge variant="outline" className="font-mono">Floor1</Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-muted-foreground">System:</span>
                        <Badge variant="outline" className="font-mono">AHU</Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-muted-foreground">Equipment:</span>
                        <Badge variant="outline" className="font-mono">AHU2</Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-muted-foreground">Measurement:</span>
                        <Badge variant="outline" className="font-mono">DischargeAir.Temperature</Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm mt-3">
                      <span className="font-mono text-muted-foreground">AI Tags:</span> 
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">temp</Badge>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">discharge</Badge>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">air</Badge>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">ahu</Badge>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">sensor</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Data Hierarchy Preview</CardTitle>
                  <CardDescription>
                    How parsed data will be organized in the system
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Export Schema
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <div className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Thermometer className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <h4 className="text-sm font-medium">Floor</h4>
                      <p className="text-xs text-muted-foreground">Physical level</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-px w-8 bg-border"></div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Fan className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <h4 className="text-sm font-medium">System</h4>
                      <p className="text-xs text-muted-foreground">Functional group</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-px w-8 bg-border"></div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Cog className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <h4 className="text-sm font-medium">Equipment</h4>
                      <p className="text-xs text-muted-foreground">Physical device</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-px w-8 bg-border"></div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Code className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <h4 className="text-sm font-medium">Data Point</h4>
                      <p className="text-xs text-muted-foreground">Value + metadata</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 ml-3">
                  <div className="mb-1 font-medium text-sm">Example Structure</div>
                  <div className="ml-4 border-l pl-4 text-sm space-y-2">
                    <div>
                      <span className="font-medium">Floor 1</span>
                      <div className="ml-4 border-l pl-4 text-sm space-y-2 mt-1">
                        <div>
                          <span className="font-medium">HVAC</span>
                          <div className="ml-4 border-l pl-4 text-sm space-y-2 mt-1">
                            <div>
                              <span className="font-medium">AHU-1</span>
                              <div className="ml-4 border-l pl-4 text-sm space-y-1 mt-1">
                                <div className="text-muted-foreground">Supply Air Temperature: <span className="text-foreground">72.3 °F</span></div>
                                <div className="text-muted-foreground">Return Air Temperature: <span className="text-foreground">75.1 °F</span></div>
                                <div className="text-muted-foreground">Fan Status: <span className="text-foreground">On</span></div>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">VAV-101</span>
                              <div className="ml-4 border-l pl-4 text-sm space-y-1 mt-1">
                                <div className="text-muted-foreground">Zone Temperature: <span className="text-foreground">73.5 °F</span></div>
                                <div className="text-muted-foreground">Damper Position: <span className="text-foreground">45%</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Lighting</span>
                          <div className="ml-4 border-l pl-4 text-sm space-y-1 mt-1">
                            <div className="text-muted-foreground">Zone 1A Status: <span className="text-foreground">On</span></div>
                            <div className="text-muted-foreground">Zone 1B Level: <span className="text-foreground">80%</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                  <span>Structured data hierarchy will be built after scanning and parsing.</span>
                </div>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}