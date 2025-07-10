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
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Download, FileStack, Search } from "lucide-react"
import { useToast } from "../hooks/use-toast"

interface Report {
  id: string
  title: string
  type: string
  frequency: string
  recipient: string
  dueDate: string
  status: string
  description: string
}

interface Template {
  id: string
  name: string
  category: string
  sections: string[]
  lastUpdated: string
  usageCount: number
  status: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Standard Audit Report",
      category: "Audit",
      sections: ["Executive Summary", "Findings", "Recommendations", "Action Items"],
      lastUpdated: "2024-03-15",
      usageCount: 12,
      status: "Active"
    },
    {
      id: "2",
      name: "Regulatory Filing Template",
      category: "Regulatory",
      sections: ["Compliance Statement", "Control Assessment", "Evidence", "Attestation"],
      lastUpdated: "2024-03-10",
      usageCount: 8,
      status: "Review Required"
    }
  ])
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCreateReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newReport: Report = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      frequency: formData.get("frequency") as string,
      recipient: formData.get("recipient") as string,
      dueDate: formData.get("dueDate") as string,
      status: "Draft",
      description: formData.get("description") as string
    }

    setReports([...reports, newReport])
    setIsReportDialogOpen(false)
    toast({
      title: "Report Created",
      description: "New report has been created successfully."
    })
  }

  const handleCreateTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      sections: (formData.get("sections") as string).split("\n").filter(Boolean),
      lastUpdated: new Date().toISOString().split('T')[0],
      usageCount: 0,
      status: "Active"
    }

    setTemplates([...templates, newTemplate])
    setIsTemplateDialogOpen(false)
    toast({
      title: "Template Created",
      description: "New report template has been created successfully."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex flex-row-reverse">
        <div className="flex flex-row gap-3">
          <div>
            <Button variant="outline" className="ml-auto" onClick={() => { setIsTemplateDialogOpen(true) }}>
              <FileStack className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>
          <div>
            <Button onClick={() => { setIsReportDialogOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between space-y-2">
        <div className="flex gap-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            {/* <DialogTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <FileStack className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Report Template</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input name="name" required />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audit">Audit Report</SelectItem>
                      <SelectItem value="regulatory">Regulatory Filing</SelectItem>
                      <SelectItem value="compliance">Compliance Report</SelectItem>
                      <SelectItem value="risk">Risk Report</SelectItem>
                      <SelectItem value="executive">Executive Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sections (one per line)</Label>
                  <Textarea
                    name="sections"
                    placeholder="Enter report sections..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">Create Template</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            {/* <DialogTrigger asChild>
              <Button >
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateReport} className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Title</Label>
                  <Input name="title" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regulatory">Regulatory Report</SelectItem>
                        <SelectItem value="audit">Audit Report</SelectItem>
                        <SelectItem value="compliance">Compliance Report</SelectItem>
                        <SelectItem value="risk">Risk Report</SelectItem>
                        <SelectItem value="executive">Executive Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select name="frequency" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">One-time</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recipient</Label>
                    <Select name="recipient" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regulator">Regulator</SelectItem>
                        <SelectItem value="auditor">External Auditor</SelectItem>
                        <SelectItem value="board">Board of Directors</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="stakeholders">Stakeholders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input name="dueDate" type="date" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    placeholder="Enter report description..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">Create Report</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              Active reports
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => new Date(r.dueDate) <= new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === "In Progress").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Being prepared
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              Available templates
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Report Library</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <FileStack className="h-4 w-4 mr-2" />
                    Bulk Generate
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search reports..." className="pl-8" />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {report.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>{report.recipient}</TableCell>
                      <TableCell>{report.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant={
                          report.status === "Completed" ? "default" :
                            report.status === "In Progress" ? "secondary" :
                              "outline"
                        }>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Generate</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Quarterly Compliance Report
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Compliance</Badge>
                    </TableCell>
                    <TableCell>Board of Directors</TableCell>
                    <TableCell>Apr 15, 2024</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        In Progress
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Generate</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulatory">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Regulator</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Annual Compliance Report
                    </TableCell>
                    <TableCell>Financial Authority</TableCell>
                    <TableCell>Annually</TableCell>
                    <TableCell>Dec 31, 2024</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Planned</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Prepare</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Audit Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Findings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      IT Security Audit Report
                    </TableCell>
                    <TableCell>Internal</TableCell>
                    <TableCell>Q1 2024</TableCell>
                    <TableCell>
                      <Badge>5 Findings</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Complete</Badge>
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

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {template.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.category}</Badge>
                      </TableCell>
                      <TableCell>{template.lastUpdated}</TableCell>
                      <TableCell>{template.usageCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {template.status === "Active" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          {template.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Use Template</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}