"use client"

import { useState } from "react"
import { 
  Save, 
  RefreshCw, 
  Settings, 
  Database, 
  Server, 
  Network, 
  Shield, 
  Bell, 
  Clock
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
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb"

export default function ConfigPage() {
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [loggingLevel, setLoggingLevel] = useState("info")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  
  return (
    
    <div className="space-y-6">
      {/* <RenderAppBreadcrumb
                    breadcrumb={{ level: 2, title: "Alarm & Events", href: "/bms/alarms" }}
                   
                  /> */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Configuration</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
          <Button variant="default" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" defaultValue="Building Management System" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Building Location</Label>
                  <Input id="location" defaultValue="Main Campus" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <Switch 
                    id="maintenance-mode" 
                    checked={maintenanceMode} 
                    onCheckedChange={setMaintenanceMode} 
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the system will be in read-only mode for regular users
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Apply Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Current system status and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Software Version</h3>
                  <p className="text-sm text-muted-foreground">v2.5.3 (Build 1234)</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Last Updated</h3>
                  <p className="text-sm text-muted-foreground">April 15, 2025</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">System Uptime</h3>
                  <p className="text-sm text-muted-foreground">32 days, 7 hours</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">License Status</h3>
                  <p className="text-sm text-green-500">Active (Enterprise)</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Check for Updates</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Configuration</CardTitle>
              <CardDescription>
                Configure database connection and backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Database Host</Label>
                  <Input id="db-host" defaultValue="localhost" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">Database Port</Label>
                  <Input id="db-port" defaultValue="5432" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">Database Name</Label>
                  <Input id="db-name" defaultValue="bms_production" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-user">Database User</Label>
                  <Input id="db-user" defaultValue="bms_admin" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select backup frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                <Input id="backup-retention" type="number" defaultValue="30" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="gap-2">
                <Database className="h-4 w-4" />
                <span>Test Connection</span>
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                <span>Save & Apply</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
              <CardDescription>
                Configure network and connectivity options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="http-port">HTTP Port</Label>
                  <Input id="http-port" defaultValue="80" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="https-port">HTTPS Port</Label>
                  <Input id="https-port" defaultValue="443" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-port">API Port</Label>
                  <Input id="api-port" defaultValue="8080" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modbus-port">Modbus Port</Label>
                  <Input id="modbus-port" defaultValue="502" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ssl-enabled">Enable SSL/TLS</Label>
                  <Switch id="ssl-enabled" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Secure all communications with SSL/TLS encryption
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remote-access">Remote Access</Label>
                  <Switch id="remote-access" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Allow remote access to the system
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Apply Network Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure system security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <Select defaultValue="strong">
                  <SelectTrigger id="password-policy">
                    <SelectValue placeholder="Select password policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                    <SelectItem value="standard">Standard (8+ chars, mixed case)</SelectItem>
                    <SelectItem value="strong">Strong (8+ chars, mixed case, numbers, symbols)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <Switch id="two-factor" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Require two-factor authentication for all users
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ip-restriction">IP Address Restriction</Label>
                  <Switch id="ip-restriction" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Restrict access to specific IP addresses
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logging-level">Audit Logging Level</Label>
                <Select value={loggingLevel} onValueChange={setLoggingLevel}>
                  <SelectTrigger id="logging-level">
                    <SelectValue placeholder="Select logging level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error Only</SelectItem>
                    <SelectItem value="warning">Warning & Error</SelectItem>
                    <SelectItem value="info">Info, Warning & Error</SelectItem>
                    <SelectItem value="debug">Debug (All Events)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Apply Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                  <Switch 
                    id="notifications-enabled" 
                    checked={notificationsEnabled} 
                    onCheckedChange={setNotificationsEnabled} 
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable or disable all system notifications
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Methods</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked disabled={!notificationsEnabled} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch id="sms-notifications" defaultChecked disabled={!notificationsEnabled} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch id="push-notifications" defaultChecked disabled={!notificationsEnabled} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Events</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="alarm-notifications">Alarms & Alerts</Label>
                    <Switch id="alarm-notifications" defaultChecked disabled={!notificationsEnabled} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-notifications">System Events</Label>
                    <Switch id="system-notifications" defaultChecked disabled={!notificationsEnabled} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="user-notifications">User Actions</Label>
                    <Switch id="user-notifications" defaultChecked disabled={!notificationsEnabled} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-schedule">Quiet Hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet-start" className="text-xs">Start Time</Label>
                    <Input id="quiet-start" type="time" defaultValue="22:00" disabled={!notificationsEnabled} />
                  </div>
                  <div>
                    <Label htmlFor="quiet-end" className="text-xs">End Time</Label>
                    <Input id="quiet-end" type="time" defaultValue="07:00" disabled={!notificationsEnabled} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" disabled={!notificationsEnabled}>Apply Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}