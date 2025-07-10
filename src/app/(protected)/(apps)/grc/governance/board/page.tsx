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
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Users, Calendar, FileStack } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface Meeting {
  id: string
  title: string
  type: string
  date: string
  time: string
  location: string
  agenda: string[]
  attendees: string[]
  status: string
}

export default function BoardGovernancePage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCreateMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      agenda: (formData.get("agenda") as string).split("\n").filter(Boolean),
      attendees: (formData.get("attendees") as string).split(",").map(s => s.trim()),
      status: "Scheduled"
    }

    setMeetings([...meetings, newMeeting])
    setIsDialogOpen(false)
    toast({
      title: "Meeting Scheduled",
      description: "New board meeting has been scheduled successfully."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div className="space-y-2">
                <Label>Meeting Title</Label>
                <Input name="title" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meeting Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular Meeting</SelectItem>
                      <SelectItem value="special">Special Meeting</SelectItem>
                      <SelectItem value="committee">Committee Meeting</SelectItem>
                      <SelectItem value="emergency">Emergency Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select name="location" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boardroom">Main Boardroom</SelectItem>
                      <SelectItem value="conference">Conference Room A</SelectItem>
                      <SelectItem value="virtual">Virtual Meeting</SelectItem>
                      <SelectItem value="hybrid">Hybrid Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input name="date" type="date" required />
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input name="time" type="time" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Attendees</Label>
                <Input 
                  name="attendees" 
                  placeholder="Enter attendee names (comma-separated)"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>Agenda Items</Label>
                <Textarea 
                  name="agenda" 
                  placeholder="Enter agenda items (one per line)"
                  required 
                />
              </div>

              <Button type="submit" className="w-full">Schedule Meeting</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Apr 15, 2024</div>
            <p className="text-xs text-muted-foreground">
              Quarterly Review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              From last meeting
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
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
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="meetings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle>Board Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {meeting.title}
                        </div>
                      </TableCell>
                      <TableCell>{meeting.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{meeting.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          {meeting.status}
                        </div>
                      </TableCell>
                      <TableCell>{meeting.attendees.length} attendees</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Q1 Board Meeting
                      </div>
                    </TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>
                      <Badge variant="outline">Quarterly</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Completed
                      </div>
                    </TableCell>
                    <TableCell>8/9</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Minutes
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Risk Committee
                      </div>
                    </TableCell>
                    <TableCell>Apr 1, 2024</TableCell>
                    <TableCell>
                      <Badge variant="outline">Committee</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Scheduled
                      </div>
                    </TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Agenda
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Review Risk Framework
                    </TableCell>
                    <TableCell>Risk Committee</TableCell>
                    <TableCell>
                      <Badge variant="destructive">High</Badge>
                    </TableCell>
                    <TableCell>Apr 15, 2024</TableCell>
                    <TableCell>
                      <Badge variant="secondary">In Progress</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Update Board Charter
                    </TableCell>
                    <TableCell>Governance Committee</TableCell>
                    <TableCell>
                      <Badge>Medium</Badge>
                    </TableCell>
                    <TableCell>Apr 30, 2024</TableCell>
                    <TableCell>
                      <Badge variant="secondary">In Progress</Badge>
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

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Board Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <Input placeholder="Search documents..." />
                </div>
                <Button variant="outline">
                  <FileStack className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Board Charter
                      </div>
                    </TableCell>
                    <TableCell>Governance</TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>
                      <Badge variant="default">Approved</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Committee Structure
                      </div>
                    </TableCell>
                    <TableCell>Organization</TableCell>
                    <TableCell>Mar 10, 2024</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Draft</Badge>
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

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Board Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Committees</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        John Smith
                      </div>
                    </TableCell>
                    <TableCell>Chairman</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant="outline">Executive</Badge>
                        <Badge variant="outline">Governance</Badge>
                      </div>
                    </TableCell>
                    <TableCell>2022-2025</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Profile</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Sarah Johnson
                      </div>
                    </TableCell>
                    <TableCell>Director</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant="outline">Risk</Badge>
                        <Badge variant="outline">Audit</Badge>
                      </div>
                    </TableCell>
                    <TableCell>2023-2026</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Profile</Button>
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