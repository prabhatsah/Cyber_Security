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
import { Plus, Search, AlertTriangle, CheckCircle, Clock, Edit, Eye, Trash2 } from "lucide-react"
import { FindingSeverity, FindingStatus } from "../types"
import { useToast } from "../../hooks/use-toast"
import { v4 as uuidv4 } from 'uuid'

interface Finding {
  id: string
  title: string
  description: string
  severity: FindingSeverity
  status: FindingStatus
  dueDate: string
  owner: string
  assessment: string
  remediation?: string
}

const mockFindings: Finding[] = [
  {
    id: "F1",
    title: "Insufficient Access Controls",
    description: "Access control mechanisms do not enforce least privilege principle",
    severity: "High",
    status: "Open",
    dueDate: "2024-04-15",
    owner: "John Smith",
    assessment: "Annual Security Assessment",
    remediation: "Implement role-based access control and review access permissions"
  }
]

export function FindingsManager() {
  const { toast } = useToast()
  const [findings, setFindings] = useState<Finding[]>(mockFindings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)

  const handleCreateFinding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newFinding: Finding = {
      id: uuidv4(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      severity: formData.get("severity") as FindingSeverity,
      status: "Open",
      dueDate: formData.get("dueDate") as string,
      owner: formData.get("owner") as string,
      assessment: "Annual Security Assessment",
      remediation: formData.get("remediation") as string
    }

    setFindings([...findings, newFinding])
    setCreateDialogOpen(false)
    toast({
      title: "Finding Created",
      description: "New finding has been created successfully."
    })
  }

  const handleEditFinding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFinding) return

    const formData = new FormData(e.currentTarget)
    const updatedFinding: Finding = {
      ...selectedFinding,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      severity: formData.get("severity") as FindingSeverity,
      status: formData.get("status") as FindingStatus,
      dueDate: formData.get("dueDate") as string,
      owner: formData.get("owner") as string,
      remediation: formData.get("remediation") as string
    }

    setFindings(findings.map(f => f.id === selectedFinding.id ? updatedFinding : f))
    setEditDialogOpen(false)
    setSelectedFinding(null)
    toast({
      title: "Finding Updated",
      description: "Finding has been updated successfully."
    })
  }

  const handleDeleteFinding = (id: string) => {
    if (confirm("Are you sure you want to delete this finding?")) {
      setFindings(findings.filter(f => f.id !== id))
      toast({
        title: "Finding Deleted",
        description: "Finding has been deleted successfully."
      })
    }
  }

  const filteredFindings = findings.filter(finding => 
    (statusFilter === "all" || finding.status === statusFilter) &&
    (finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     finding.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusIcon = (status: FindingStatus) => {
    switch (status) {
      case "Closed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "In Remediation":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Open":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Findings</CardTitle>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Finding
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Finding</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateFinding}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity</Label>
                      <Select name="severity" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" name="dueDate" type="date" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remediation">Remediation Plan</Label>
                    <Textarea id="remediation" name="remediation" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner</Label>
                    <Select name="owner" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign owner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit">Create Finding</Button>
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
                placeholder="Search findings..."
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
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Remediation">In Remediation</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Finding</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assessment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFindings.map((finding) => (
              <TableRow key={finding.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(finding.status)}
                    {finding.title}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    finding.severity === "Critical" ? "destructive" :
                    finding.severity === "High" ? "default" :
                    finding.severity === "Medium" ? "secondary" :
                    "outline"
                  }>
                    {finding.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    finding.status === "Closed" ? "default" :
                    finding.status === "In Remediation" ? "secondary" :
                    "destructive"
                  }>
                    {finding.status}
                  </Badge>
                </TableCell>
                <TableCell>{finding.owner}</TableCell>
                <TableCell>{finding.dueDate}</TableCell>
                <TableCell>{finding.assessment}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFinding(finding)
                        setDetailsDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFinding(finding)
                        setEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFinding(finding.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Finding</DialogTitle>
            </DialogHeader>
            {selectedFinding && (
              <form onSubmit={handleEditFinding}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      name="title"
                      defaultValue={selectedFinding.title}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-severity">Severity</Label>
                      <Select name="severity" defaultValue={selectedFinding.severity}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select name="status" defaultValue={selectedFinding.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Remediation">In Remediation</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      defaultValue={selectedFinding.description}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-remediation">Remediation Plan</Label>
                    <Textarea
                      id="edit-remediation"
                      name="remediation"
                      defaultValue={selectedFinding.remediation}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-owner">Owner</Label>
                      <Select name="owner" defaultValue={selectedFinding.owner}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="John Smith">John Smith</SelectItem>
                          <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-dueDate">Due Date</Label>
                      <Input
                        id="edit-dueDate"
                        name="dueDate"
                        type="date"
                        defaultValue={selectedFinding.dueDate}
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

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Finding Details</DialogTitle>
            </DialogHeader>
            {selectedFinding && (
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <p className="text-sm mt-1">{selectedFinding.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Severity</Label>
                    <div className="mt-1">
                      <Badge variant={
                        selectedFinding.severity === "Critical" ? "destructive" :
                        selectedFinding.severity === "High" ? "default" :
                        selectedFinding.severity === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {selectedFinding.severity}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      <Badge variant={
                        selectedFinding.status === "Closed" ? "default" :
                        selectedFinding.status === "In Remediation" ? "secondary" :
                        "destructive"
                      }>
                        {selectedFinding.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{selectedFinding.description}</p>
                </div>

                <div>
                  <Label>Remediation Plan</Label>
                  <p className="text-sm mt-1">{selectedFinding.remediation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Owner</Label>
                    <p className="text-sm mt-1">{selectedFinding.owner}</p>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <p className="text-sm mt-1">{selectedFinding.dueDate}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}