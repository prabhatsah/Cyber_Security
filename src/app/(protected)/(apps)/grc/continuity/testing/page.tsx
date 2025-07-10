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
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Search, Download, ClipboardCheck } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface BCTest {
  id: string
  name: string
  type: string
  scope: string
  date: string
  participants: string[]
  objectives: string[]
  status: string
}

export default function BCTestingPage() {
  const [tests, setTests] = useState<BCTest[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleScheduleTest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newTest: BCTest = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      scope: formData.get("scope") as string,
      date: formData.get("date") as string,
      participants: (formData.get("participants") as string).split(","),
      objectives: (formData.get("objectives") as string).split("\n").filter(Boolean),
      status: "Scheduled"
    }

    setTests([...tests, newTest])
    setIsDialogOpen(false)
    toast({
      title: "Test Scheduled",
      description: "New BC/DR test has been scheduled successfully."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Test</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleScheduleTest} className="space-y-4">
              <div className="space-y-2">
                <Label>Test Name</Label>
                <Input name="name" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tabletop">Tabletop Exercise</SelectItem>
                      <SelectItem value="functional">Functional Exercise</SelectItem>
                      <SelectItem value="full-scale">Full-Scale DR Test</SelectItem>
                      <SelectItem value="technical">Technical Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Scope</Label>
                  <Select name="scope" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Systems</SelectItem>
                      <SelectItem value="critical">Critical Systems</SelectItem>
                      <SelectItem value="it">IT Systems</SelectItem>
                      <SelectItem value="network">Network Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test Date</Label>
                  <Input name="date" type="date" required />
                </div>

                <div className="space-y-2">
                  <Label>Participants</Label>
                  <Input 
                    name="participants" 
                    placeholder="Enter participants (comma-separated)"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Test Objectives</Label>
                <Textarea 
                  name="objectives" 
                  placeholder="Enter test objectives (one per line)"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea 
                  name="notes" 
                  placeholder="Enter any additional notes or requirements..."
                />
              </div>

              <Button type="submit" className="w-full">Schedule Test</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planned Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Next 90 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Last 12 months
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Systems tested
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 days</div>
            <p className="text-xs text-muted-foreground">
              Since last test
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Test Schedule</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Test Calendar</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Schedule
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tests..." className="pl-8" />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4" />
                        Full DR Exercise
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Full Scale</Badge>
                    </TableCell>
                    <TableCell>All Systems</TableCell>
                    <TableCell>Apr 15, 2024</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Scheduled
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4" />
                        Tabletop Exercise
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Simulation</Badge>
                    </TableCell>
                    <TableCell>IT Systems</TableCell>
                    <TableCell>Mar 30, 2024</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Completed
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Results</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Issues Found</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Tabletop Exercise
                    </TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>4 hours</TableCell>
                    <TableCell>95%</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Badge variant="default">Passed</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Report</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle>Test Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Systems</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Data Center Failover
                    </TableCell>
                    <TableCell>Infrastructure</TableCell>
                    <TableCell>Core Systems</TableCell>
                    <TableCell>Feb 15, 2024</TableCell>
                    <TableCell>90%</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
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

        <TabsContent value="coverage">
          <Card>
            <CardHeader>
              <CardTitle>Test Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System/Process</TableHead>
                    <TableHead>Last Test</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Core Banking
                    </TableCell>
                    <TableCell>Mar 01, 2024</TableCell>
                    <TableCell>
                      <Badge variant="outline">Full DR</Badge>
                    </TableCell>
                    <TableCell>95%</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>
                      <Badge variant="default">Compliant</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Details</Button>
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