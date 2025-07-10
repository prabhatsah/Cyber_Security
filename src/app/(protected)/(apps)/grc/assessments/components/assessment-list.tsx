"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Textarea } from "@/shadcn/ui/textarea"
import { Plus, Search, FileText, CheckCircle, Clock, AlertTriangle, Trash2, Edit, Eye } from "lucide-react"
import { Assessment, AssessmentStatus } from "../types"
import { v4 as uuidv4 } from 'uuid'

const mockAssessments: Assessment[] = [
  {
    id: "1",
    title: "Annual Security Assessment",
    description: "Comprehensive review of security controls",
    scope: "All critical systems",
    framework: "ISO 27001",
    status: "In Progress",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-04-01"),
    assessors: ["John Smith", "Sarah Johnson"],
    controlOwners: ["Mike Brown", "Emily Davis"],
    progress: 65,
    lastUpdated: new Date("2024-03-15"),
    findings: [],
    controls: []
  }
]

export function AssessmentList() {
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleCreateAssessment = (formData: FormData) => {
    const newAssessment: Assessment = {
      id: uuidv4(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      scope: formData.get("scope") as string,
      framework: formData.get("framework") as string,
      status: "Draft",
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      assessors: [],
      controlOwners: [],
      progress: 0,
      lastUpdated: new Date(),
      findings: [],
      controls: []
    }

    setAssessments([...assessments, newAssessment])
    setIsDialogOpen(false)
  }

  const handleEditAssessment = (formData: FormData) => {
    if (!selectedAssessment) return

    const updatedAssessment: Assessment = {
      ...selectedAssessment,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      scope: formData.get("scope") as string,
      framework: formData.get("framework") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      lastUpdated: new Date()
    }

    setAssessments(assessments.map(a => 
      a.id === selectedAssessment.id ? updatedAssessment : a
    ))
    setIsEditDialogOpen(false)
    setSelectedAssessment(null)
  }

  const handleDeleteAssessment = (id: string) => {
    if (confirm("Are you sure you want to delete this assessment?")) {
      setAssessments(assessments.filter(a => a.id !== id))
    }
  }

  const getStatusIcon = (status: AssessmentStatus) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Under Review":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredAssessments = assessments
    .filter(assessment => 
      (statusFilter === "all" || assessment.status === statusFilter) &&
      (assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       assessment.framework.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Assessment Projects</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Assessment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Assessment</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleCreateAssessment(new FormData(e.currentTarget))
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="framework">Framework</Label>
                      <Select name="framework" defaultValue="iso27001">
                        <SelectTrigger>
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="iso27001">ISO 27001</SelectItem>
                          <SelectItem value="nist">NIST CSF</SelectItem>
                          <SelectItem value="pci">PCI DSS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scope">Scope</Label>
                    <Textarea id="scope" name="scope" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" name="startDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" name="endDate" type="date" required />
                    </div>
                  </div>

                  <Button type="submit">Create Assessment</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(assessment.status)}
                    {assessment.title}
                  </div>
                </TableCell>
                <TableCell>{assessment.framework}</TableCell>
                <TableCell>
                  <Badge variant={
                    assessment.status === "Completed" ? "default" :
                    assessment.status === "In Progress" ? "secondary" :
                    "outline"
                  }>
                    {assessment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${assessment.progress}%` }}
                    />
                  </div>
                </TableCell>
                <TableCell>{assessment.startDate.toLocaleDateString()}</TableCell>
                <TableCell>{assessment.endDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAssessment(assessment)
                        setIsDetailsDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAssessment(assessment)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAssessment(assessment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Assessment Details</DialogTitle>
            </DialogHeader>
            {selectedAssessment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <p className="text-sm mt-1">{selectedAssessment.title}</p>
                  </div>
                  <div>
                    <Label>Framework</Label>
                    <p className="text-sm mt-1">{selectedAssessment.framework}</p>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{selectedAssessment.description}</p>
                </div>

                <div>
                  <Label>Scope</Label>
                  <p className="text-sm mt-1">{selectedAssessment.scope}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <p className="text-sm mt-1">{selectedAssessment.startDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <p className="text-sm mt-1">{selectedAssessment.endDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <Label>Progress</Label>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${selectedAssessment.progress}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">{selectedAssessment.progress}% Complete</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Assessment</DialogTitle>
            </DialogHeader>
            {selectedAssessment && (
              <form onSubmit={(e) => {
                e.preventDefault()
                handleEditAssessment(new FormData(e.currentTarget))
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        name="title"
                        defaultValue={selectedAssessment.title}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-framework">Framework</Label>
                      <Select name="framework" defaultValue={selectedAssessment.framework}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="iso27001">ISO 27001</SelectItem>
                          <SelectItem value="nist">NIST CSF</SelectItem>
                          <SelectItem value="pci">PCI DSS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      defaultValue={selectedAssessment.description}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-scope">Scope</Label>
                    <Textarea
                      id="edit-scope"
                      name="scope"
                      defaultValue={selectedAssessment.scope}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-startDate">Start Date</Label>
                      <Input
                        id="edit-startDate"
                        name="startDate"
                        type="date"
                        defaultValue={selectedAssessment.startDate.toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-endDate">End Date</Label>
                      <Input
                        id="edit-endDate"
                        name="endDate"
                        type="date"
                        defaultValue={selectedAssessment.endDate.toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}