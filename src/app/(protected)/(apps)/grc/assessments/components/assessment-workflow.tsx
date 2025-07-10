"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Badge } from "@/shadcn/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Textarea } from "@/shadcn/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Input } from "@/shadcn/ui/input"
import { useDropzone } from "react-dropzone"
import { FileText, Upload, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface Evidence {
  id: string
  fileName: string
  controlId: string
  uploadedBy: string
  uploadDate: string
  status: "Pending" | "Approved" | "Rejected"
}

interface Control {
  id: string
  name: string
  status: string
  assignedTo: string
  dueDate: string
}

export function AssessmentWorkflow() {
  const { toast } = useToast()
  const [selectedControl, setSelectedControl] = useState<string | null>(null)
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false)
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [controls, setControls] = useState<Control[]>([
    {
      id: "A.5.1",
      name: "Information Security Policy",
      status: "In Progress",
      assignedTo: "John Smith",
      dueDate: "2024-04-15"
    }
  ])
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10485760, // 10MB
    onDrop: (acceptedFiles) => {
      const newEvidence: Evidence = {
        id: Date.now().toString(),
        fileName: acceptedFiles[0].name,
        controlId: selectedControl || "",
        uploadedBy: "Current User",
        uploadDate: new Date().toISOString().split('T')[0],
        status: "Pending"
      }
      setEvidence([...evidence, newEvidence])
      setEvidenceDialogOpen(false)
      toast({
        title: "Evidence Uploaded",
        description: "The evidence has been uploaded and is pending review."
      })
    }
  })

  const handleAssessmentSave = (formData: FormData) => {
    const controlId = selectedControl
    const status = formData.get("status") as string
    const results = formData.get("results") as string

    setControls(controls.map(control => 
      control.id === controlId
        ? { ...control, status }
        : control
    ))

    setSelectedControl(null)
    toast({
      title: "Assessment Saved",
      description: "The control assessment has been updated successfully."
    })
  }

  const handleReviewAction = (evidenceId: string, action: "approve" | "reject") => {
    setEvidence(evidence.map(e => 
      e.id === evidenceId
        ? { ...e, status: action === "approve" ? "Approved" : "Rejected" }
        : e
    ))
    toast({
      title: action === "approve" ? "Evidence Approved" : "Evidence Rejected",
      description: `The evidence has been ${action === "approve" ? "approved" : "rejected"}.`
    })
  }

  const handleViewEvidence = (evidenceItem: Evidence) => {
    setSelectedEvidence(evidenceItem)
    setReviewDialogOpen(true)
  }

  return (
    <div className="grid gap-4">
      <Tabs defaultValue="controls" className="space-y-4">
        <TabsList>
          <TabsTrigger value="controls">Control Testing</TabsTrigger>
          <TabsTrigger value="evidence">Evidence Collection</TabsTrigger>
          <TabsTrigger value="review">Review & Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle>Control Assessment Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {controls.map(control => (
                    <TableRow key={control.id}>
                      <TableCell className="font-medium">{control.id}</TableCell>
                      <TableCell>{control.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{control.status}</Badge>
                      </TableCell>
                      <TableCell>{control.assignedTo}</TableCell>
                      <TableCell>{control.dueDate}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedControl(control.id)}
                        >
                          Assess
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Evidence Repository</CardTitle>
                <Dialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Upload Evidence</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Evidence</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Control Reference</Label>
                        <Select value={selectedControl || ""} onValueChange={setSelectedControl}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control" />
                          </SelectTrigger>
                          <SelectContent>
                            {controls.map(control => (
                              <SelectItem key={control.id} value={control.id}>
                                {control.id} - {control.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Describe the evidence..." />
                      </div>

                      <div
                        {...getRootProps()}
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
                      >
                        <input {...getInputProps()} />
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Drag and drop evidence files here, or click to select
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports PDF, DOC, DOCX, JPG, PNG up to 10MB
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Control</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidence.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {item.fileName}
                        </div>
                      </TableCell>
                      <TableCell>{item.controlId}</TableCell>
                      <TableCell>{item.uploadedBy}</TableCell>
                      <TableCell>{item.uploadDate}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === "Approved" ? "default" :
                          item.status === "Rejected" ? "destructive" :
                          "secondary"
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEvidence(item)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Review Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidence.filter(e => e.status === "Pending").map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          {item.fileName}
                        </div>
                      </TableCell>
                      <TableCell>Evidence Review</TableCell>
                      <TableCell>{item.uploadedBy}</TableCell>
                      <TableCell>{item.uploadDate}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">High</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReviewAction(item.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReviewAction(item.id, "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Control Assessment Dialog */}
      {selectedControl && (
        <Dialog open={!!selectedControl} onOpenChange={() => setSelectedControl(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Control Assessment: {selectedControl}</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleAssessmentSave(new FormData(e.currentTarget))
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Test Procedures</Label>
                  <Textarea
                    name="procedures"
                    placeholder="Document your test procedures..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Results</Label>
                  <Textarea
                    name="results"
                    placeholder="Document your test results..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select name="status">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliant">Compliant</SelectItem>
                      <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                      <SelectItem value="partial">Partially Compliant</SelectItem>
                      <SelectItem value="na">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedControl(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Assessment</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Evidence Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Evidence Review</DialogTitle>
          </DialogHeader>
          {selectedEvidence && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>File Name</Label>
                  <p className="text-sm mt-1">{selectedEvidence.fileName}</p>
                </div>
                <div>
                  <Label>Control Reference</Label>
                  <p className="text-sm mt-1">{selectedEvidence.controlId}</p>
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={
                    selectedEvidence.status === "Approved" ? "default" :
                    selectedEvidence.status === "Rejected" ? "destructive" :
                    "secondary"
                  }>
                    {selectedEvidence.status}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleReviewAction(selectedEvidence.id, "reject")}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleReviewAction(selectedEvidence.id, "approve")}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}