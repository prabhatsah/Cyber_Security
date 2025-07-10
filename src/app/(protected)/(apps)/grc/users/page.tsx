"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Plus, Search, Shield, UserCheck, UserCog, UserX } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Button className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              +12 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">186</div>
            <p className="text-xs text-muted-foreground">
              75% of total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              With elevated access
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Access requests
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-8" />
              </div>
            </div>
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Roles
            </Button>
            <Button variant="outline">
              <UserCog className="mr-2 h-4 w-4" />
              Permissions
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    John Smith
                    <Badge variant="secondary">Admin</Badge>
                  </div>
                </TableCell>
                <TableCell>System Administrator</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    Active
                  </div>
                </TableCell>
                <TableCell>5 minutes ago</TableCell>
                <TableCell>
                  <Badge variant="default">Enabled</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Sarah Johnson
                </TableCell>
                <TableCell>Compliance Officer</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    Active
                  </div>
                </TableCell>
                <TableCell>2 hours ago</TableCell>
                <TableCell>
                  <Badge variant="default">Enabled</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Mike Brown
                </TableCell>
                <TableCell>Auditor</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-red-500" />
                    Inactive
                  </div>
                </TableCell>
                <TableCell>5 days ago</TableCell>
                <TableCell>
                  <Badge variant="secondary">Disabled</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}