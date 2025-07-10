"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Checkbox } from "@/shadcn/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Download, FileText, Send } from "lucide-react"

export function ReportGenerator() {
  const [selectedAssessment, setSelectedAssessment] = useState("")
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [recipients, setRecipients] = useState<string[]>([])

  const sections = [
    { id: "executive", label: "Executive Summary" },
    { id: "scope", label: "Assessment Scope" },
    { id: "methodology", label: "Methodology" },
    { id: "findings", label: "Detailed Findings" },
    { id: "recommendations", label: "Recommendations" },
    { id: "evidence", label: "Supporting Evidence" },
    { id: "appendix", label: "Appendices" }
  ]

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assessment</Label>
              <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Security Assessment</SelectItem>
                  <SelectItem value="vendor">Vendor Security Assessment</SelectItem>
                  <SelectItem value="compliance">Compliance Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Report Sections</Label>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    {sections.map((section) => (
                      <div key={section.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={section.id}
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSections([...selectedSections, section.id])
                            } else {
                              setSelectedSections(
                                selectedSections.filter((id) => id !== section.id)
                              )
                            }
                          }}
                        />
                        <label
                          htmlFor={section.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {section.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label>Report Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="word">Word Document</SelectItem>
                  <SelectItem value="html">HTML Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  type="email"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const input = e.target as HTMLInputElement
                      if (input.value && !recipients.includes(input.value)) {
                        setRecipients([...recipients, input.value])
                        input.value = ""
                      }
                    }
                  }}
                />
                <Button variant="outline">Add</Button>
              </div>
              {recipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipients.map((recipient) => (
                    <Badge
                      key={recipient}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {recipient}
                      <button
                        onClick={() =>
                          setRecipients(recipients.filter((r) => r !== recipient))
                        }
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Generate & Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Q1 Security Assessment Report
                  </div>
                </TableCell>
                <TableCell>Annual Security Assessment</TableCell>
                <TableCell>Mar 15, 2024</TableCell>
                <TableCell>3 recipients</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
              {/* Add more report rows */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}