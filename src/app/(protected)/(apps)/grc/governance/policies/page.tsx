"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Search, FileBox, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Textarea } from "@/shadcn/ui/textarea"
import { useToast } from "../../hooks/use-toast"

interface Policy {
  id: string
  title: string
  category: string
  owner: string
  version: string
  lastReview: string
  nextReview: string
  status: string
  description: string
  content: string
  approver: string
}

export default function CorporatePoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCreatePolicy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPolicy: Policy = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      owner: formData.get("owner") as string,
      version: "1.0",
      lastReview: new Date().toISOString().split('T')[0],
      nextReview: formData.get("nextReview") as string,
      status: "Draft",
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      approver: formData.get("approver") as string
    }

    setPolicies([...policies, newPolicy])
    setIsDialogOpen(false)
    toast({
      title: "Policy Created",
      description: "New policy has been created successfully."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div className="space-y-2">
                <Label>Policy Title</Label>
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
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="privacy">Privacy</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Policy Owner</Label>
                  <Select name="owner" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ciso">CISO</SelectItem>
                      <SelectItem value="cio">CIO</SelectItem>
                      <SelectItem value="hr-director">HR Director</SelectItem>
                      <SelectItem value="cfo">CFO</SelectItem>
                      <SelectItem value="coo">COO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Next Review Date</Label>
                  <Input 
                    name="nextReview" 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Approver</Label>
                  <Select name="approver" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceo">CEO</SelectItem>
                      <SelectItem value="ciso">CISO</SelectItem>
                      <SelectItem value="cio">CIO</SelectItem>
                      <SelectItem value="board">Board</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  name="description" 
                  placeholder="Enter policy description..."
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>Policy Content</Label>
                <Textarea 
                  name="content" 
                  placeholder="Enter policy content..."
                  required 
                  className="min-h-[200px]"
                />
              </div>

              <Button type="submit" className="w-full">Create Policy</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
            <p className="text-xs text-muted-foreground">
              Active policies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policies.filter(p => p.status === "Under Review").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policies.filter(p => new Date(p.nextReview) <= new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Within 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policies.filter(p => p.status === "Published").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active policies
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Policies</TabsTrigger>
          <TabsTrigger value="review">Under Review</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Policy Directory</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <FileBox className="h-4 w-4 mr-2" />
                    Bulk Update
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search policies..." className="pl-8" />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Last Review</TableHead>
                    <TableHead>Next Review</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {policy.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{policy.category}</Badge>
                      </TableCell>
                      <TableCell>{policy.owner}</TableCell>
                      <TableCell>{policy.lastReview}</TableCell>
                      <TableCell>{policy.nextReview}</TableCell>
                      <TableCell>
                        <Badge variant={
                          policy.status === "Published" ? "default" :
                          policy.status === "Draft" ? "secondary" :
                          "outline"
                        }>
                          {policy.status}
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
                        Information Security Policy
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Security</Badge>
                    </TableCell>
                    <TableCell>CISO</TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>Mar 15, 2025</TableCell>
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
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Policies Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Data Protection Policy
                    </TableCell>
                    <TableCell>Legal Team</TableCell>
                    <TableCell>Mar 10, 2024</TableCell>
                    <TableCell>Mar 24, 2024</TableCell>
                    <TableCell>
                      <Badge>In Review</Badge>
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

        <TabsContent value="archive">
          <Card>
            <CardHeader>
              <CardTitle>Policy Archive</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Active Period</TableHead>
                    <TableHead>Replaced By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Information Security Policy v1.0
                    </TableCell>
                    <TableCell>1.0</TableCell>
                    <TableCell>Jan 2023 - Dec 2023</TableCell>
                    <TableCell>Version 2.0</TableCell>
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
              <CardTitle>Policy Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Standard Policy Template
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Mar 01, 2024</TableCell>
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