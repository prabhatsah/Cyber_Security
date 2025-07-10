"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Textarea } from "@/shadcn/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Search, Download, Shield, Activity } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface Incident {
  id: string
  title: string
  type: string
  priority: string
  status: string
  owner: string
  reportedDate: string
  description: string
  affectedSystems: string[]
}

export default function IncidentResponsePage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleReportIncident = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newIncident: Incident = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      priority: formData.get("priority") as string,
      status: "Active",
      owner: formData.get("owner") as string,
      reportedDate: new Date().toISOString(),
      description: formData.get("description") as string,
      affectedSystems: (formData.get("affectedSystems") as string).split(",")
    }

    setIncidents([...incidents, newIncident])
    setIsDialogOpen(false)
    toast({
      title: "Incident Reported",
      description: "New incident has been reported and response team notified."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Report New Incident</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleReportIncident} className="space-y-4">
              <div className="space-y-2">
                <Label>Incident Title</Label>
                <Input name="title" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security">Security Incident</SelectItem>
                      <SelectItem value="system">System Outage</SelectItem>
                      <SelectItem value="network">Network Issue</SelectItem>
                      <SelectItem value="data">Data Breach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select name="priority" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Incident Owner</Label>
                <Select name="owner" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ir-team">IR Team</SelectItem>
                    <SelectItem value="soc-team">SOC Team</SelectItem>
                    <SelectItem value="it-team">IT Team</SelectItem>
                    <SelectItem value="network-team">Network Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Affected Systems</Label>
                <Input 
                  name="affectedSystems" 
                  placeholder="Enter affected systems (comma-separated)"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  name="description" 
                  placeholder="Provide a detailed description of the incident..."
                  required 
                />
              </div>

              <Button type="submit" className="w-full">Report Incident</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Currently open
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              High priority
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45min</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Within SLA
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Incidents</TabsTrigger>
          <TabsTrigger value="playbooks">Response Playbooks</TabsTrigger>
          <TabsTrigger value="teams">Response Teams</TabsTrigger>
          <TabsTrigger value="reports">Post-Mortems</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Incident Tracker</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Log
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search incidents..." className="pl-8" />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        System Outage
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Infrastructure</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">Critical</Badge>
                    </TableCell>
                    <TableCell>10 mins ago</TableCell>
                    <TableCell>IR Team</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-red-500" />
                        Active Response
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security Alert
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Security</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">High</Badge>
                    </TableCell>
                    <TableCell>1 hour ago</TableCell>
                    <TableCell>SOC Team</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Investigation
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playbooks">
          <Card>
            <CardHeader>
              <CardTitle>Response Playbooks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Playbook</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Last Tested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      System Outage Response
                    </TableCell>
                    <TableCell>Infrastructure</TableCell>
                    <TableCell>IR Team</TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>Feb 28, 2024</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Response Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>On Call</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      IR Team Alpha
                    </TableCell>
                    <TableCell>John Smith</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>Infrastructure</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>
                      <Badge variant="default">Available</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Contact</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Post-Mortem Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Root Cause</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Network Outage
                    </TableCell>
                    <TableCell>Mar 10, 2024</TableCell>
                    <TableCell>2h 15m</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Major</Badge>
                    </TableCell>
                    <TableCell>Hardware Failure</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Draft</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Report</Button>
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