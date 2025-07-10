"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { AlertTriangle, CheckCircle, Clock, FileText, Plus } from "lucide-react"

export default function ContinuityPage() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Button className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Within next 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average RTO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4h</div>
            <p className="text-xs text-muted-foreground">
              -1h from target
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Last 12 months
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Continuity Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Test</TableHead>
                <TableHead>Next Test</TableHead>
                <TableHead>RTO</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Data Center Failover
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Infrastructure</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Active
                  </div>
                </TableCell>
                <TableCell>Mar 15, 2024</TableCell>
                <TableCell>Jun 15, 2024</TableCell>
                <TableCell>4 hours</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Plan</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Critical Systems Recovery
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Systems</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Review Required
                  </div>
                </TableCell>
                <TableCell>Feb 28, 2024</TableCell>
                <TableCell>May 28, 2024</TableCell>
                <TableCell>2 hours</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Plan</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Remote Operations Plan
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Operations</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Test Scheduled
                  </div>
                </TableCell>
                <TableCell>Mar 01, 2024</TableCell>
                <TableCell>Apr 15, 2024</TableCell>
                <TableCell>8 hours</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Plan</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}