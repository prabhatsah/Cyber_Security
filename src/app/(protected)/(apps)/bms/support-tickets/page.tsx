"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Bell,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle,
  Download,
  FileText,
  Tag,
  MessageSquare,
  User,
  Calendar,
  ArrowUpDown
} from "lucide-react"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Badge } from "@/shadcn/ui/badge"
import { Progress } from "@/shadcn/ui/progress"
import { Textarea } from "@/shadcn/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu"
import SupportTicketTable from './components/SupportTicketTable'

// Mock ticket data
const ticketData = [
  {
    id: 1,
    subject: "HVAC system not responding to temperature changes",
    customer: "John Smith",
    email: "john.smith@example.com",
    category: "Technical",
    priority: "High",
    status: "Open",
    createdAt: "2025-04-15T10:23:00",
    assignedTo: "Sarah Johnson",
    description: "The HVAC system in Zone B is not responding to temperature adjustments from the control panel. We've tried restarting the system but the issue persists."
  },
  {
    id: 2,
    subject: "Billing discrepancy on monthly statement",
    customer: "Emily Davis",
    email: "emily.davis@example.com",
    category: "Billing",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2025-04-14T09:15:00",
    assignedTo: "James Wilson",
    description: "There appears to be a discrepancy on our monthly statement. We were charged for premium support but we're on the standard plan."
  },
  {
    id: 3,
    subject: "Request for additional user licenses",
    customer: "Michael Brown",
    email: "michael.brown@example.com",
    category: "Service",
    priority: "Low",
    status: "Open",
    createdAt: "2025-04-13T14:32:00",
    assignedTo: "Lisa Anderson",
    description: "We need to add 5 additional user licenses to our account. Please provide a quote and timeline for activation."
  },
  {
    id: 4,
    subject: "Security system false alarms",
    customer: "Robert Wilson",
    email: "robert.wilson@example.com",
    category: "Technical",
    priority: "Critical",
    status: "In Progress",
    createdAt: "2025-04-12T11:47:00",
    assignedTo: "Sarah Johnson",
    description: "The security system in the main lobby has been triggering false alarms for the past 24 hours. This is disrupting operations and needs immediate attention."
  },
  {
    id: 5,
    subject: "Digital twin visualization issues",
    customer: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    category: "Technical",
    priority: "Medium",
    status: "Resolved",
    createdAt: "2025-04-11T08:22:00",
    assignedTo: "James Wilson",
    description: "The digital twin visualization is not loading correctly in the dashboard. Some elements are missing or displaying incorrectly."
  },
  {
    id: 6,
    subject: "Request for training session",
    customer: "David Miller",
    email: "david.miller@example.com",
    category: "Service",
    priority: "Low",
    status: "Closed",
    createdAt: "2025-04-10T15:30:00",
    assignedTo: "Lisa Anderson",
    description: "We have several new staff members who need training on the building management system. Please schedule a training session at your earliest convenience."
  },
  {
    id: 7,
    subject: "API integration not working",
    customer: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    category: "Technical",
    priority: "High",
    status: "Open",
    createdAt: "2025-04-09T13:15:00",
    assignedTo: "Unassigned",
    description: "We're trying to integrate your API with our internal systems but are encountering authentication errors. Please provide assistance with the integration process."
  },
  {
    id: 8,
    subject: "Upgrade package inquiry",
    customer: "Thomas Anderson",
    email: "thomas.anderson@example.com",
    category: "Product",
    priority: "Medium",
    status: "Closed",
    createdAt: "2025-04-08T10:00:00",
    assignedTo: "James Wilson",
    description: "We're interested in upgrading to the enterprise package. Please provide information about the additional features and pricing."
  },
]

// Format date function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleString(undefined, options);
};

export default function SupportTicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [tickets, setTickets] = useState(ticketData)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    customer: "",
    email: "",
    description: "",
    category: "Technical",
    priority: "Medium"
  })

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter

    // Status filter
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

    // Priority filter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  // Get unique categories for filter dropdown
  const categories = [...new Set(tickets.map(ticket => ticket.category))]

  // Handle ticket creation
  const handleCreateTicket = (e) => {
    e.preventDefault()

    const newTicketData = {
      id: tickets.length + 1,
      ...newTicket,
      status: "Open",
      createdAt: new Date().toISOString(),
      assignedTo: "Unassigned"
    }

    setTickets([newTicketData, ...tickets])
    setIsCreateTicketOpen(false)
    setNewTicket({
      subject: "",
      customer: "",
      email: "",
      description: "",
      category: "Technical",
      priority: "Medium"
    })
  }

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Open</Badge>
      case "In Progress":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">In Progress</Badge>
      case "Resolved":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Resolved</Badge>
      case "Closed":
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">Closed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get priority badge variant
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Critical</Badge>
      case "High":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">High</Badge>
      case "Medium":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Medium</Badge>
      case "Low":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <Button className="gap-2" onClick={() => setIsCreateTicketOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Create Ticket</span>
        </Button>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="agents">Support Agents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>
                Manage customer support tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grow overflow-hidden">
                <SupportTicketTable />
              </div>
            </CardContent>
          </Card>

          {selectedTicket && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <CardDescription>
                      Ticket #{selectedTicket.id} • Created on {formatDate(selectedTicket.createdAt)}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Customer</Label>
                    <div>{selectedTicket.customer}</div>
                    <div className="text-sm text-muted-foreground">{selectedTicket.email}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Category</Label>
                    <div>{selectedTicket.category}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Assigned To</Label>
                    <div>{selectedTicket.assignedTo}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Status</Label>
                    <div>{getStatusBadge(selectedTicket.status)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Priority</Label>
                    <div>{getPriorityBadge(selectedTicket.priority)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Created</Label>
                    <div>{formatDate(selectedTicket.createdAt)}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground">Description</Label>
                  <div className="p-4 bg-muted rounded-md">
                    {selectedTicket.description}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reply">Reply</Label>
                  <Textarea id="reply" placeholder="Type your response..." rows={4} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    <span>Change Status</span>
                  </Button>
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-1" />
                    <span>Reassign</span>
                  </Button>
                </div>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>Send Reply</span>
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Agents</CardTitle>
              <CardDescription>
                Manage support agent assignments and workload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Sarah Johnson</h3>
                          <p className="text-sm text-muted-foreground">Senior Support Agent</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Assigned Tickets</span>
                          <span className="text-sm font-medium">{tickets.filter(t => t.assignedTo === "Sarah Johnson").length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Open Tickets</span>
                          <span className="text-sm font-medium">{tickets.filter(t => t.assignedTo === "Sarah Johnson" && (t.status === "Open" || t.status === "In Progress")).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg. Resolution Time</span>
                          <span className="text-sm font-medium">3.5h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">James Wilson</h3>
                          <p className="text-sm text-muted-foreground">Support Agent</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Assigned Tickets</span>
                          <span className="text-sm font-medium">{tickets.filter(t => t.assignedTo === "James Wilson").length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Open Tickets</span>
                          <span className="text-sm font-medium">{tickets.filter(t => t.assignedTo === "James Wilson" && (t.status === "Open" || t.status === "In Progress")).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg. Resolution Time</span>
                          <span className="text-sm font-medium">4.2h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Lisa Anderson</h3>
                          <p className="text-sm text-muted-foreground">Support Agent</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Assigned Tickets</span>
                          <span className="text-sm font-medium">{tickets.filter(t => t.assignedTo === "Lisa Anderson").length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Open Tickets</span>
                          <span className="text-sm font-medium">{tickets.filter(t => t.assignedTo === "Lisa Anderson" && (t.status === "Open" || t.status === "In Progress")).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg. Resolution Time</span>
                          <span className="text-sm font-medium">4.8h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Workload Distribution</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Sarah Johnson</span>
                        <span className="text-sm font-medium">
                          {tickets.filter(t => t.assignedTo === "Sarah Johnson").length} tickets
                        </span>
                      </div>
                      <Progress
                        value={tickets.filter(t => t.assignedTo === "Sarah Johnson").length / tickets.length * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">James Wilson</span>
                        <span className="text-sm font-medium">
                          {tickets.filter(t => t.assignedTo === "James Wilson").length} tickets
                        </span>
                      </div>
                      <Progress
                        value={tickets.filter(t => t.assignedTo === "James Wilson").length / tickets.length * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Lisa Anderson</span>
                        <span className="text-sm font-medium">
                          {tickets.filter(t => t.assignedTo === "Lisa Anderson").length} tickets
                        </span>
                      </div>
                      <Progress
                        value={tickets.filter(t => t.assignedTo === "Lisa Anderson").length / tickets.length * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Unassigned</span>
                        <span className="text-sm font-medium">
                          {tickets.filter(t => t.assignedTo === "Unassigned").length} tickets
                        </span>
                      </div>
                      <Progress
                        value={tickets.filter(t => t.assignedTo === "Unassigned").length / tickets.length * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Analytics</CardTitle>
              <CardDescription>
                Support ticket metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Total Tickets</h3>
                      <Tag className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold">{tickets.length}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Open Tickets</h3>
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-3xl font-bold">
                      {tickets.filter(t => t.status === "Open" || t.status === "In Progress").length}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Requiring attention
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Avg. Resolution Time</h3>
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold">
                      4.2h
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      -15% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Customer Satisfaction</h3>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold">
                      94%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      +2% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-medium">Ticket Distribution</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">By Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Technical</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.category === "Technical").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.category === "Technical").length / tickets.length * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Billing</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.category === "Billing").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.category === "Billing").length / tickets.length * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Product</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.category === "Product").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.category === "Product").length / tickets.length * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Service</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.category === "Service").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.category === "Service").length / tickets.length * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Other</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.category === "Other").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.category === "Other").length / tickets.length * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">By Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Critical</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.priority === "Critical").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.priority === "Critical").length / tickets.length * 100}
                            className="h-2 bg-red-200 dark:bg-red-900"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">High</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.priority === "High").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.priority === "High").length / tickets.length * 100}
                            className="h-2 bg-amber-200 dark:bg-amber-900"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Medium</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.priority === "Medium").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.priority === "Medium").length / tickets.length * 100}
                            className="h-2 bg-blue-200 dark:bg-blue-900"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Low</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.priority === "Low").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.priority === "Low").length / tickets.length * 100}
                            className="h-2 bg-green-200 dark:bg-green-900"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">By Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Open</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.status === "Open").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.status === "Open").length / tickets.length * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">In Progress</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.status === "In Progress").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.status === "In Progress").length / tickets.length * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Resolved</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.status === "Resolved").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.status === "Resolved").length / tickets.length * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Closed</span>
                            <span className="text-sm">
                              {tickets.filter(t => t.status === "Closed").length}
                            </span>
                          </div>
                          <Progress
                            value={tickets.filter(t => t.status === "Closed").length / tickets.length * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" />
                <span>Export Data</span>
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-1" />
                <span>Generate Full Report</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Support Ticket</DialogTitle>
            <DialogDescription>
              Enter the details for the new support ticket
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTicket}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    value={newTicket.customer}
                    onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Customer Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={newTicket.email}
                    onChange={(e) => setNewTicket({ ...newTicket, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-subject">Subject</Label>
                <Input
                  id="ticket-subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-description">Description</Label>
                <Textarea
                  id="ticket-description"
                  rows={5}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket-category">Category</Label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                  >
                    <SelectTrigger id="ticket-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Billing">Billing</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket-priority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                  >
                    <SelectTrigger id="ticket-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateTicketOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}