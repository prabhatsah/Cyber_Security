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
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Search, FileStack, Download } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface BCPlan {
  id: string
  name: string
  department: string
  type: string
  priority: string
  rto: string
  rpo: string
  owner: string
  description: string
  status: string
  lastReview: string
  nextReview: string
}

export default function BCPlanningPage() {
  const [plans, setPlans] = useState<BCPlan[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCreatePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPlan: BCPlan = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      department: formData.get("department") as string,
      type: formData.get("type") as string,
      priority: formData.get("priority") as string,
      rto: formData.get("rto") as string,
      rpo: formData.get("rpo") as string,
      owner: formData.get("owner") as string,
      description: formData.get("description") as string,
      status: "Draft",
      lastReview: new Date().toISOString().split('T')[0],
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    setPlans([...plans, newPlan])
    setIsDialogOpen(false)
    toast({
      title: "Plan Created",
      description: "New BCP plan has been created successfully."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New BCP Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input name="name" required />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select name="department" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business Process</SelectItem>
                      <SelectItem value="it">IT Systems</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                      <SelectItem value="emergency">Emergency Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recovery Time Objective (RTO)</Label>
                  <Select name="rto" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select RTO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0-4 hours</SelectItem>
                      <SelectItem value="4">4-8 hours</SelectItem>
                      <SelectItem value="8">8-24 hours</SelectItem>
                      <SelectItem value="24">24+ hours</SelectItem>
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
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Plan Owner</Label>
                <Input name="owner" required />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  name="description" 
                  placeholder="Provide a detailed description of the business continuity plan..."
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
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Across departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Within 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 days</div>
            <p className="text-xs text-muted-foreground">
              Since last test
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Overall readiness
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Business Continuity Plans</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <FileStack className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search plans..." className="pl-8" />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Review</TableHead>
                <TableHead>Next Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {plan.name}
                    </div>
                  </TableCell>
                  <TableCell>{plan.department}</TableCell>
                  <TableCell>{plan.owner}</TableCell>
                  <TableCell>{plan.lastReview}</TableCell>
                  <TableCell>{plan.nextReview}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{plan.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}