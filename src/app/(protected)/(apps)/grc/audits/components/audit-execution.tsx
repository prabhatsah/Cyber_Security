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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { CheckCircle, Clock, FileText, Plus, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface Evidence {
  id: string
  type: string
  description: string
  fileName: string
  uploadDate: string
  status: string
}

interface Interview {
  id: string
  interviewee: string
  role: string
  date: string
  status: string
  notes: string
}

export function AuditExecution() {
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newEvidence = acceptedFiles.map(file => ({
        id: Date.now().toString(),
        type: "Document",
        description: file.name,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        status: "Pending Review"
      }))
      setEvidence([...evidence, ...newEvidence])
    }
  })

  const handleAddInterview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newInterview: Interview = {
      id: Date.now().toString(),
      interviewee: formData.get("interviewee") as string,
      role: formData.get("role") as string,
      date: formData.get("date") as string,
      status: "Scheduled",
      notes: formData.get("notes") as string
    }

    setInterviews([...interviews, newInterview])
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="evidence">
        <TabsList>
          <TabsTrigger value="evidence">Evidence Collection</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="procedures">Audit Procedures</TabsTrigger>
        </TabsList>

        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <CardTitle>Evidence Repository</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-4"
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop evidence files here, or click to select
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evidence</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidence.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {item.fileName}
                        </div>
                      </TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{new Date(item.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.status}</Badge>
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
        </TabsContent>

        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interview Schedule</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Interview
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule New Interview</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddInterview} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Interviewee Name</Label>
                        <Input name="interviewee" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input name="role" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input name="date" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea name="notes" />
                      </div>
                      <Button type="submit">Schedule</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Interviewee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell>{interview.interviewee}</TableCell>
                      <TableCell>{interview.role}</TableCell>
                      <TableCell>{interview.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{interview.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Notes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures">
          <Card>
            <CardHeader>
              <CardTitle>Audit Procedures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">1. Pre-Audit Phase</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Review audit scope and objectives</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Gather preliminary documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Schedule key stakeholder meetings</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">2. Fieldwork Phase</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Conduct interviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Review documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Perform testing procedures</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">3. Reporting Phase</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Document findings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Prepare draft report</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Review with stakeholders</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}