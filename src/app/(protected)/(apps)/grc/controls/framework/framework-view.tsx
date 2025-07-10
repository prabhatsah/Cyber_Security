"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Framework, Control } from "./types"
import { format } from "date-fns"

interface FrameworkViewProps {
  framework: Framework
  controls: Control[]
}

export function FrameworkView({ framework, controls }: FrameworkViewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id)
    } else {
      newExpandedRows.add(id)
    }
    setExpandedRows(newExpandedRows)
  }

  const totalWeight = controls.reduce((sum, control) => {
    const frameworkMapping = control.frameworks.find(f => f.id === framework.id)
    return sum + (frameworkMapping?.weight || 0)
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{framework.name} Controls</span>
          <Badge variant={totalWeight === 100 ? "default" : "destructive"}>
            Total Weight: {totalWeight}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]" />
              <TableHead>Control ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Last Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controls.map((control) => {
              const frameworkMapping = control.frameworks.find(f => f.id === framework.id)
              return (
                <>
                  <TableRow key={control.id} className="hover:bg-muted/50">
                    <TableCell>
                      <button
                        onClick={() => toggleRow(control.id)}
                        className="p-2"
                      >
                        {expandedRows.has(control.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>{frameworkMapping?.mappingId || control.id}</TableCell>
                    <TableCell>{control.name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        control.riskLevel === "High" ? "destructive" :
                        control.riskLevel === "Medium" ? "default" :
                        "secondary"
                      }>
                        {control.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>{control.owner}</TableCell>
                    <TableCell>
                      <Badge variant={
                        control.status === "Implemented" ? "default" :
                        control.status === "In Progress" ? "secondary" :
                        "destructive"
                      }>
                        {control.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{frameworkMapping?.weight}%</TableCell>
                    <TableCell>{format(control.lastReview, "MMM d, yyyy")}</TableCell>
                  </TableRow>
                  {expandedRows.has(control.id) && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="p-4 space-y-4">
                          <div>
                            <h4 className="font-semibold">Description</h4>
                            <p className="text-sm text-muted-foreground">
                              {control.description}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Control Objectives</h4>
                              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                                {control.objectives.map((obj, i) => (
                                  <li key={i}>{obj}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold">Implementation Requirements</h4>
                              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                                {control.implementation.map((imp, i) => (
                                  <li key={i}>{imp}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Testing Procedures</h4>
                              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                                {control.testing.map((test, i) => (
                                  <li key={i}>{test}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold">Supporting Documentation</h4>
                              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                                {control.documentation.map((doc, i) => (
                                  <li key={i}>{doc}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}