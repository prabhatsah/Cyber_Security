"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Button } from "@/shadcn/ui/button"
import { Badge } from "@/shadcn/ui/badge"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { useToast } from "../../../hooks/use-toast"
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { Control, Evidence } from "../types"

interface EvidenceManagerProps {
  controls: Control[]
}

const mockEvidence: Evidence[] = [
  {
    id: "1",
    controlId: "CTR1",
    fileName: "access-policy-2024.pdf",
    fileType: "application/pdf",
    fileSize: 1024576, // 1MB
    uploadDate: new Date("2024-03-15"),
    uploadedBy: "John Smith",
    evidenceType: "Policy Document",
    validFrom: new Date("2024-01-01"),
    validTo: new Date("2024-12-31"),
    tags: ["policy", "access-control"],
    status: "Approved",
    reviewedBy: "Sarah Johnson",
    reviewDate: new Date("2024-03-16"),
    reviewComments: "Compliant with current standards",
  }
]

export function EvidenceManager({ controls }: EvidenceManagerProps) {
  const { toast } = useToast()
  const [evidence, setEvidence] = useState<Evidence[]>(mockEvidence)
  const [selectedControl, setSelectedControl] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  const onDrop = async (acceptedFiles: File[]) => {
    if (!selectedControl) {
      toast({
        title: "Error",
        description: "Please select a control first",
        variant: "destructive",
      })
      return
    }

    const file = acceptedFiles[0]
    if (file.size > 26214400) { // 25MB
      toast({
        title: "Error",
        description: "File size must be less than 25MB",
        variant: "destructive",
      })
      return
    }

    const newEvidence: Evidence = {
      id: Date.now().toString(),
      controlId: selectedControl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadDate: new Date(),
      uploadedBy: "Current User",
      evidenceType: "Document",
      tags: [],
      status: "Pending",
    }

    setEvidence([...evidence, newEvidence])
    toast({
      title: "Evidence Uploaded",
      description: "The evidence has been uploaded and is pending review",
    })
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'video/mp4': ['.mp4'],
    },
    maxSize: 26214400, // 25MB
  })

  const filteredEvidence = evidence.filter(e => 
    e.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.evidenceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Evidence Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="control">Control</Label>
                <select
                  id="control"
                  className="w-full rounded-md border border-input px-3 py-2"
                  value={selectedControl}
                  onChange={(e) => setSelectedControl(e.target.value)}
                >
                  <option value="">Select a control...</option>
                  {controls.map((control) => (
                    <option key={control.id} value={control.id}>
                      {control.id} - {control.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <Label htmlFor="search">Search Evidence</Label>
                <Input
                  id="search"
                  placeholder="Search by filename, type, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                Maximum file size: 25MB
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Control</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvidence.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {item.fileName}
                      </div>
                    </TableCell>
                    <TableCell>{item.controlId}</TableCell>
                    <TableCell>{item.evidenceType}</TableCell>
                    <TableCell>{format(item.uploadDate, "MMM d, yyyy")}</TableCell>
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newStatus = item.status === "Pending" ? "Approved" : "Pending"
                            setEvidence(evidence.map(e =>
                              e.id === item.id ? { ...e, status: newStatus } : e
                            ))
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEvidence(evidence.map(e =>
                              e.id === item.id ? { ...e, status: "Rejected" } : e
                            ))
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}