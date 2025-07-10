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
import { GraduationCap, Plus, Search, FileText, Download } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface Training {
  id: string
  title: string
  type: string
  department: string
  dueDate: string
  status: string
  completion: number
  assignedUsers: number
}

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddTraining = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newTraining: Training = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      department: formData.get("department") as string,
      dueDate: formData.get("dueDate") as string,
      status: "Active",
      completion: 0,
      assignedUsers: 0
    }

    setTrainings([...trainings, newTraining])
    setIsDialogOpen(false)
    toast({
      title: "Training Created",
      description: "New training module has been created."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Training
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Training</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTraining} className="space-y-4">
              <div className="space-y-2">
                <Label>Training Title</Label>
                <Input name="title" required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select name="department" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input name="dueDate" type="date" required />
              </div>
              <Button type="submit" className="w-full">Create Training</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Average completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Training Modules</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search trainings..." className="pl-8" />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Security Awareness Training
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Security</Badge>
                </TableCell>
                <TableCell>All Departments</TableCell>
                <TableCell>Apr 15, 2024</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2"
                        style={{ width: "85%" }}
                      />
                    </div>
                    <span className="text-sm">85%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">Active</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Data Privacy Essentials
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Compliance</Badge>
                </TableCell>
                <TableCell>IT</TableCell>
                <TableCell>Apr 30, 2024</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2"
                        style={{ width: "45%" }}
                      />
                    </div>
                    <span className="text-sm">45%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">In Progress</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}