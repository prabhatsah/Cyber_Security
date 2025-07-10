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
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Search, Download, Laptop, Server, Database } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface RecoveryPlan {
  id: string
  name: string
  system: string
  rto: string
  rpo: string
  priority: string
  owner: string
  description: string
  status: string
  lastTest: string
  nextTest: string
}

export default function DisasterRecoveryPage() {
  const [plans, setPlans] = useState<RecoveryPlan[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCreatePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPlan: RecoveryPlan = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      system: formData.get("system") as string,
      rto: formData.get("rto") as string,
      rpo: formData.get("rpo") as string,
      priority: formData.get("priority") as string,
      owner: formData.get("owner") as string,
      description: formData.get("description") as string,
      status: "Draft",
      lastTest: "-",
      nextTest: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    setPlans([...plans, newPlan])
    setIsDialogOpen(false)
    toast({
      title: "Plan Created",
      description: "New recovery plan has been created successfully."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Recovery Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Recovery Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input name="name" required />
                </div>
                <div className="space-y-2">
                  <Label>System</Label>
                  <Select name="system" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="core">Core Banking System</SelectItem>
                      <SelectItem value="payments">Payment Processing</SelectItem>
                      <SelectItem value="crm">CRM System</SelectItem>
                      <SelectItem value="email">Email System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recovery Time Objective (RTO)</Label>
                  <Select name="rto" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select RTO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0-2 hours</SelectItem>
                      <SelectItem value="2">2-4 hours</SelectItem>
                      <SelectItem value="4">4-8 hours</SelectItem>
                      <SelectItem value="8">8-24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Recovery Point Objective (RPO)</Label>
                  <Select name="rpo" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select RPO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority Level</Label>
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
                <div className="space-y-2">
                  <Label>Plan Owner</Label>
                  <Input name="owner" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  name="description" 
                  placeholder="Provide a detailed description of the recovery plan..."
                  required 
                />
              </div>

              <Button type="submit" className="w-full">Create Plan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Active plans
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average RTO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4h</div>
            <p className="text-xs text-muted-foreground">
              Recovery time objective
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average RPO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15min</div>
            <p className="text-xs text-muted-foreground">
              Recovery point objective
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30 days</div>
            <p className="text-xs text-muted-foreground">
              Since last DR test
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Recovery Plans</TabsTrigger>
          <TabsTrigger value="systems">Critical Systems</TabsTrigger>
          <TabsTrigger value="backups">Backup Status</TabsTrigger>
          <TabsTrigger value="tests">DR Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Disaster Recovery Plans</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Plans
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search recovery plans..." className="pl-8" />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>RTO</TableHead>
                    <TableHead>RPO</TableHead>
                    <TableHead>Last Test</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Core Banking Recovery
                      </div>
                    </TableCell>
                    <TableCell>Banking Platform</TableCell>
                    <TableCell>2 hours</TableCell>
                    <TableCell>5 minutes</TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Verified
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Plan</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Data Warehouse Recovery
                      </div>
                    </TableCell>
                    <TableCell>Analytics Platform</TableCell>
                    <TableCell>4 hours</TableCell>
                    <TableCell>1 hour</TableCell>
                    <TableCell>Mar 01, 2024</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Test Due
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Plan</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="systems">
          <Card>
            <CardHeader>
              <CardTitle>Critical Systems Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    <TableHead>Criticality</TableHead>
                    <TableHead>Primary Site</TableHead>
                    <TableHead>DR Site</TableHead>
                    <TableHead>Replication</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4" />
                        Core Banking System
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">Critical</Badge>
                    </TableCell>
                    <TableCell>DC1</TableCell>
                    <TableCell>DC2</TableCell>
                    <TableCell>
                      <Badge variant="default">Active-Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Healthy
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <CardTitle>Backup Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Last Backup</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Core Database
                    </TableCell>
                    <TableCell>Full + Incremental</TableCell>
                    <TableCell>Daily</TableCell>
                    <TableCell>2 hours ago</TableCell>
                    <TableCell>2.5 TB</TableCell>
                    <TableCell>
                      <Badge variant="default">Success</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Logs</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>DR Test Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Systems</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Q2 Full DR Test
                    </TableCell>
                    <TableCell>All Critical Systems</TableCell>
                    <TableCell>
                      <Badge variant="outline">Full Failover</Badge>
                    </TableCell>
                    <TableCell>Apr 15, 2024</TableCell>
                    <TableCell>8 hours</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Planned</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Plan</Button>
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