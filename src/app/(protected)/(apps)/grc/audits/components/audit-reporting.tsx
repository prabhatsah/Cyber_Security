"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Textarea } from "@/shadcn/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { AlertTriangle, Download, FileText, Plus } from "lucide-react"

interface Finding {
  id: string
  title: string
  description: string
  severity: string
  recommendation: string
  owner: string
  dueDate: string
  status: string
}

export function AuditReporting() {
  const [findings, setFindings] = useState<Finding[]>([])

  const handleAddFinding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newFinding: Finding = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      severity: formData.get("severity") as string,
      recommendation: formData.get("recommendation") as string,
      owner: formData.get("owner") as string,
      dueDate: formData.get("dueDate") as string,
      status: "Open"
    }

    setFindings([...findings, newFinding])
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Findings</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Finding
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Finding</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddFinding} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Finding Title</Label>
                    <Input name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select name="severity" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
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
                    <Label>Recommendation</Label>
                    <Textarea name="recommendation" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Owner</Label>
                      <Input name="owner" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input name="dueDate" type="date" required />
                    </div>
                  </div>
                  <Button type="submit">Add Finding</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Finding</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {findings.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      {finding.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      finding.severity === "critical" ? "destructive" :
                      finding.severity === "high" ? "default" :
                      "secondary"
                    }>{finding.severity}</Badge>
                  </TableCell>
                  <TableCell>{finding.owner}</TableCell>
                  <TableCell>{finding.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{finding.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="executive">Executive Summary</SelectItem>
                    <SelectItem value="findings">Findings Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="word">Word Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recipients</Label>
              <Input placeholder="Enter email addresses (comma-separated)" />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button>Generate & Send</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}