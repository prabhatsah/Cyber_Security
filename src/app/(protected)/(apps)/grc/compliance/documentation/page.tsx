"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Textarea } from "@/shadcn/ui/textarea"
import { Plus, FileText } from "lucide-react"

export default function DocumentationPage() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto pr-3">
      <div className="flex items-center justify-between">
        <Button className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Document Title</TableCell>
                <TableCell className="text-right">
                  <Input placeholder="Enter Document Title" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Version</TableCell>
                <TableCell className="text-right">
                  <Input placeholder="Enter Version Number" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Updated</TableCell>
                <TableCell className="text-right">
                  <Input type="date" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Author</TableCell>
                <TableCell className="text-right">
                  <Input placeholder="Enter Author Name" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Approved By</TableCell>
                <TableCell className="text-right">
                  <Input placeholder="Enter Approver Name" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important References</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document/Source</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Link/Location</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input placeholder="Enter document name" />
                </TableCell>
                <TableCell>
                  <Input placeholder="Enter brief description" />
                </TableCell>
                <TableCell>
                  <Input placeholder="Enter URL or path" />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Add</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requirement ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input placeholder="COMP-XXX" />
                </TableCell>
                <TableCell>
                  <Input placeholder="Enter title" />
                </TableCell>
                <TableCell>
                  <Textarea placeholder="Enter detailed description" />
                </TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="not-started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input placeholder="Enter owner" />
                </TableCell>
                <TableCell>
                  <Input type="date" />
                </TableCell>
                <TableCell>
                  <Input placeholder="Enter evidence link" />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Add</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Changes Made</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input placeholder="Enter version" />
                </TableCell>
                <TableCell>
                  <Input type="date" />
                </TableCell>
                <TableCell>
                  <Input placeholder="Enter author" />
                </TableCell>
                <TableCell>
                  <Textarea placeholder="Describe changes" />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Add</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button>Submit for Review</Button>
      </div>
    </div>
  )
}