"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Plus, Search, FileText, CheckCircle, AlertTriangle, Clock } from "lucide-react"

export default function PoliciesPage() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Button className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Across all frameworks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
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
            <div className="text-2xl font-bold">12</div>
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
            <div className="text-2xl font-bold">136</div>
            <p className="text-xs text-muted-foreground">
              Active policies
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Policy Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search policies..." className="pl-8" />
              </div>
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Name</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Review</TableHead>
                <TableHead>Next Review</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Information Security Policy
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">ISO 27001</Badge>
                </TableCell>
                <TableCell>John Smith</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Published
                  </div>
                </TableCell>
                <TableCell>Mar 15, 2024</TableCell>
                <TableCell>Jun 15, 2024</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Data Protection Policy
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">GDPR</Badge>
                </TableCell>
                <TableCell>Sarah Johnson</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Under Review
                  </div>
                </TableCell>
                <TableCell>Mar 01, 2024</TableCell>
                <TableCell>Apr 01, 2024</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Review</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Access Control Policy
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">NIST</Badge>
                </TableCell>
                <TableCell>Mike Brown</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Draft
                  </div>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}