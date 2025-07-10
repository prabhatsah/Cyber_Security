"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Input } from "@/shadcn/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Plus, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface Vendor {
  id: string
  name: string
  category: string
  riskLevel: "High" | "Medium" | "Low"
  status: "Active" | "Pending" | "Suspended"
  lastAssessment: Date
  score: number
}

const mockVendors: Vendor[] = [
  {
    id: "V1",
    name: "Cloud Services Inc",
    category: "Cloud Infrastructure",
    riskLevel: "High",
    status: "Active",
    lastAssessment: new Date("2024-03-01"),
    score: 85
  },
  {
    id: "V2",
    name: "SecureData Solutions",
    category: "Data Security",
    riskLevel: "Medium",
    status: "Active",
    lastAssessment: new Date("2024-02-15"),
    score: 92
  }
]

export function VendorAssessment() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Vendor Risk Assessment</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Vendor Assessment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vendor Name</Label>
                    <Input placeholder="Enter vendor name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cloud">Cloud Infrastructure</SelectItem>
                        <SelectItem value="security">Data Security</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
                  Start Assessment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Assessment</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>
                  <Badge variant={
                    vendor.riskLevel === "High" ? "destructive" :
                    vendor.riskLevel === "Medium" ? "default" :
                    "secondary"
                  }>
                    {vendor.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    vendor.status === "Active" ? "default" :
                    vendor.status === "Suspended" ? "destructive" :
                    "secondary"
                  }>
                    {vendor.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {vendor.lastAssessment.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {vendor.score}%
                    {vendor.score >= 90 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : vendor.score >= 70 ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}