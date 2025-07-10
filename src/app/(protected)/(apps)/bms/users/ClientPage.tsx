"use client"

import { useState } from "react"
import {
  Check,
  Download,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  UserPlus,
  Users
} from "lucide-react"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Input } from "@/shadcn/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"
import { Avatar, AvatarFallback } from "@/shadcn/ui/avatar"
import UsersTable from './components/usersTable';

// Mock user data
const userData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Administrator",
    department: "Facilities Management",
    status: "active",
    lastLogin: "Today, 10:23 AM"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Manager",
    department: "Operations",
    status: "active",
    lastLogin: "Today, 09:15 AM"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Technician",
    department: "Maintenance",
    status: "active",
    lastLogin: "Yesterday, 04:32 PM"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Security Officer",
    department: "Security",
    status: "inactive",
    lastLogin: "3 days ago, 11:47 AM"
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    role: "Technician",
    department: "HVAC",
    status: "active",
    lastLogin: "Yesterday, 02:13 PM"
  },
  {
    id: 6,
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    role: "Manager",
    department: "Energy Management",
    status: "active",
    lastLogin: "Today, 08:45 AM"
  },
  {
    id: 7,
    name: "David Miller",
    email: "david.miller@example.com",
    role: "Technician",
    department: "Electrical",
    status: "active",
    lastLogin: "2 days ago, 01:22 PM"
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    role: "Viewer",
    department: "Finance",
    status: "inactive",
    lastLogin: "1 week ago, 09:30 AM"
  },
]

// Mock role data
const roleData = [
  {
    name: "Administrator",
    description: "Full system access with all privileges",
    userCount: 1
  },
  {
    name: "Manager",
    description: "Can manage most system functions but cannot change system configuration",
    userCount: 2
  },
  {
    name: "Technician",
    description: "Can view and acknowledge alarms, and control assigned systems",
    userCount: 3
  },
  {
    name: "Security Officer",
    description: "Access to security systems and related functions only",
    userCount: 1
  },
  {
    name: "Viewer",
    description: "Read-only access to dashboards and reports",
    userCount: 1
  }
]

export default function UsersPage({ usersDetails, membershipDetails }: { usersDetails: Record<string, any>, membershipDetails: Record<string, any> }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState(userData)

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())

    // Role filter
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    // Status filter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Get unique roles for filter dropdown
  const roles = [...new Set(users.map(user => user.role))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          {/* <TabsTrigger value="groups">User Groups</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger> */}
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>System Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className="grow overflow-hidden"> */}
                <UsersTable usersDetails={usersDetails} membershipDetails={membershipDetails} />
              {/* </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Manage system roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Role</span>
                </Button>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                  <div className="col-span-3">Role Name</div>
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2">Users</div>
                  <div className="col-span-1">Actions</div>
                </div>
                <div className="divide-y">
                  {roleData.map((role, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-3 items-center">
                      <div className="col-span-3 font-medium">{role.name}</div>
                      <div className="col-span-6 text-muted-foreground">{role.description}</div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{role.userCount}</span>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              <span>View Users</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>User Groups</CardTitle>
              <CardDescription>
                Manage user groups and assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                User groups management will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
              <CardDescription>
                Track user actions and system access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                User activity log will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}