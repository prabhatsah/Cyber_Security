"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog"
import { Input } from "@/shadcn/ui/input"
import { Button } from "@/shadcn/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Risk, RiskCategory } from "../types"
import { getRiskPriorityLevel } from "../data"
import { RiskDetails } from "./risk-details"
import { AlertTriangle, ArrowUpDown, CheckCircle, Clock, Search } from "lucide-react"

interface RiskTableProps {
  risks: Risk[]
  category: RiskCategory
}

export function RiskTable({ risks, category }: RiskTableProps) {
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Risk>("riskScore")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleSort = (field: keyof Risk) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredAndSortedRisks = risks
    .filter(risk => 
      (statusFilter === "all" || risk.status === statusFilter) &&
      (risk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       risk.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === "riskScore") {
        return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
      }
      const aValue = String(a[sortField]).toLowerCase()
      const bValue = String(b[sortField]).toLowerCase()
      return sortDirection === "asc" ? 
        aValue.localeCompare(bValue) : 
        bValue.localeCompare(aValue)
    })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Mitigated":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Active":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search risks by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Mitigated">Mitigated</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="hover:bg-transparent"
                >
                  Risk Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("riskScore")}
                  className="hover:bg-transparent"
                >
                  Priority
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="hover:bg-transparent"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Last Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedRisks.map((risk) => {
              const priorityLevel = getRiskPriorityLevel(risk.riskScore)
              return (
                <TableRow
                  key={risk.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedRisk(risk)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(risk.status)}
                      <div>
                        <div className="font-medium">{risk.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[400px]">
                          {risk.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      priorityLevel === "Critical" ? "destructive" :
                      priorityLevel === "High" ? "default" :
                      priorityLevel === "Medium" ? "secondary" :
                      "outline"
                    } className="font-medium">
                      {priorityLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{risk.owner}</TableCell>
                  <TableCell>
                    <Badge variant={
                      risk.status === "Mitigated" ? "default" :
                      risk.status === "Active" ? "destructive" :
                      "secondary"
                    }>
                      {risk.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{risk.timeline}</TableCell>
                  <TableCell>
                    {risk.lastReviewDate.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedRisk} onOpenChange={() => setSelectedRisk(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Risk Details</DialogTitle>
          </DialogHeader>
          {selectedRisk && <RiskDetails risk={selectedRisk} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}