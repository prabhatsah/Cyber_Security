"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Search, Scale, Download, FileStack } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Textarea } from "@/shadcn/ui/textarea"
import { useToast } from "../../hooks/use-toast"

interface Filing {
  id: string
  title: string
  regulator: string
  type: string
  dueDate: string
  status: string
  description: string
}

export default function RegulatoryAffairsPage() {
  const [filings, setFilings] = useState<Filing[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCreateFiling = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newFiling: Filing = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      regulator: formData.get("regulator") as string,
      type: formData.get("type") as string,
      dueDate: formData.get("dueDate") as string,
      status: "In Progress",
      description: formData.get("description") as string
    }

    setFilings([...filings, newFiling])
    setIsDialogOpen(false)
    toast({
      title: "Filing Created",
      description: "New regulatory filing has been created successfully."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Filing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Filing</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateFiling} className="space-y-4">
              <div className="space-y-2">
                <Label>Filing Title</Label>
                <Input name="title" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Regulator</Label>
                  <Select name="regulator" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select regulator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sec">SEC</SelectItem>
                      <SelectItem value="finra">FINRA</SelectItem>
                      <SelectItem value="dpa">Data Protection Authority</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Filing Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                      <SelectItem value="amendment">Amendment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input 
                  name="dueDate" 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  name="description" 
                  placeholder="Enter filing description..."
                  required 
                />
              </div>

              <Button type="submit" className="w-full">Create Filing</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Filings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
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
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Regulatory compliance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Pending response
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="filings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="filings">Regulatory Filings</TabsTrigger>
          <TabsTrigger value="changes">Regulatory Changes</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="filings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filing Status</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <FileStack className="h-4 w-4 mr-2" />
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
                    <Input placeholder="Search filings..." className="pl-8" />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filing</TableHead>
                    <TableHead>Regulator</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filings.map((filing) => (
                    <TableRow key={filing.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          {filing.title}
                        </div>
                      </TableCell>
                      <TableCell>{filing.regulator}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{filing.type}</Badge>
                      </TableCell>
                      <TableCell>{filing.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          {filing.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4" />
                        Annual Compliance Report
                      </div>
                    </TableCell>
                    <TableCell>SEC</TableCell>
                    <TableCell>
                      <Badge variant="outline">Annual</Badge>
                    </TableCell>
                    <TableCell>Apr 15, 2024</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        In Progress
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4" />
                        Quarterly Financial Report
                      </div>
                    </TableCell>
                    <TableCell>SEC</TableCell>
                    <TableCell>
                      <Badge variant="outline">Quarterly</Badge>
                    </TableCell>
                    <TableCell>Mar 31, 2024</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Submitted
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

        <TabsContent value="changes">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Change</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      New Privacy Requirements
                    </TableCell>
                    <TableCell>Data Protection Authority</TableCell>
                    <TableCell>
                      <Badge variant="destructive">High</Badge>
                    </TableCell>
                    <TableCell>Jun 1, 2024</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Implementation</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Plan</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Regulator</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INQ-2024-001</TableCell>
                    <TableCell>Data Processing Practices</TableCell>
                    <TableCell>Privacy Commission</TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>Apr 15, 2024</TableCell>
                    <TableCell>
                      <Badge>In Progress</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Respond</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Apr 15, 2024</TableCell>
                    <TableCell>Annual Compliance Filing</TableCell>
                    <TableCell>
                      <Badge variant="outline">Filing</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">High</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Upcoming</Badge>
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
      </Tabs>
    </div>
  )
}