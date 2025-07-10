"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { AlertTriangle, Bell, CheckCircle } from "lucide-react"

export default function RegulatoryPage() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Due this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implementation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Require immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Regulatory Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Update</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Data Privacy Update</TableCell>
                <TableCell>GDPR</TableCell>
                <TableCell>
                  <Badge variant="destructive">High</Badge>
                </TableCell>
                <TableCell>Apr 15, 2024</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Pending Review
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Review</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Security Controls Update</TableCell>
                <TableCell>ISO 27001</TableCell>
                <TableCell>
                  <Badge>Medium</Badge>
                </TableCell>
                <TableCell>May 1, 2024</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-500" />
                    In Progress
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Risk Assessment Guidelines</TableCell>
                <TableCell>NIST</TableCell>
                <TableCell>
                  <Badge variant="secondary">Low</Badge>
                </TableCell>
                <TableCell>Mar 30, 2024</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Implemented
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Details</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}