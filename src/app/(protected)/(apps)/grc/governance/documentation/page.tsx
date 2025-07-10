"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Search, FileStack, Download, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Textarea } from "@/shadcn/ui/textarea"
import { useToast } from "../../hooks/use-toast"

interface Document {
  id: string
  title: string
  category: string
  owner: string
  version: string
  lastModified: string
  status: string
  description: string
}

export default function DocumentationPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCreateDocument = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newDocument: Document = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      owner: formData.get("owner") as string,
      version: "1.0",
      lastModified: new Date().toISOString().split('T')[0],
      status: "Draft",
      description: formData.get("description") as string
    }

    setDocuments([...documents, newDocument])
    setIsDialogOpen(false)
    toast({
      title: "Document Created",
      description: "New document has been created successfully."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div className="space-y-2">
                <Label>Document Title</Label>
                <Input name="title" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="guideline">Guideline</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Document Owner</Label>
                  <Select name="owner" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliance">Compliance Team</SelectItem>
                      <SelectItem value="security">Security Team</SelectItem>
                      <SelectItem value="risk">Risk Team</SelectItem>
                      <SelectItem value="legal">Legal Team</SelectItem>
                      <SelectItem value="it">IT Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  name="description" 
                  placeholder="Enter document description..."
                  required 
                />
              </div>

              <Button type="submit" className="w-full">Create Document</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Pending approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updates Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Due for revision
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="library" className="space-y-4">
        <TabsList>
          <TabsTrigger value="library">Document Library</TabsTrigger>
          <TabsTrigger value="review">Review Queue</TabsTrigger>
          <TabsTrigger value="versions">Version Control</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Document Repository</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search documents..." className="pl-8" />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {doc.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell>{doc.owner}</TableCell>
                      <TableCell>{doc.lastModified}</TableCell>
                      <TableCell>{doc.version}</TableCell>
                      <TableCell>
                        <Badge variant={
                          doc.status === "Published" ? "default" :
                          doc.status === "Draft" ? "secondary" :
                          "outline"
                        }>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Risk Management Framework
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Framework</Badge>
                    </TableCell>
                    <TableCell>Risk Team</TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>2.1</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Published
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Compliance Procedures
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Procedure</Badge>
                    </TableCell>
                    <TableCell>Compliance</TableCell>
                    <TableCell>Mar 10, 2024</TableCell>
                    <TableCell>1.8</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Under Review
                      </div>
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

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Documents Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Compliance Procedures v1.8
                    </TableCell>
                    <TableCell>John Smith</TableCell>
                    <TableCell>Sarah Johnson</TableCell>
                    <TableCell>Mar 20, 2024</TableCell>
                    <TableCell>
                      <Badge variant="secondary">In Review</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Review</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Risk Management Framework
                    </TableCell>
                    <TableCell>2.1</TableCell>
                    <TableCell>Risk Team</TableCell>
                    <TableCell>Updated risk assessment criteria</TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Compare</Button>
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
              <CardTitle>Document Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Standard Operating Procedure
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Procedure</Badge>
                    </TableCell>
                    <TableCell>Mar 01, 2024</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Use Template</Button>
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