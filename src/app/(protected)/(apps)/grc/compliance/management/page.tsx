"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { ArrowDown, ArrowUp, FileText, Plus, BookOpen, AlertTriangle, CheckCircle } from "lucide-react"

export default function ComplianceManagementPage() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Button className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Requirement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+5%</span>
              <span className="ml-1">from last quarter</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">-3</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="mr-1 h-4 w-4 text-yellow-500" />
              <span className="text-yellow-500 font-medium">Due</span>
              <span className="ml-1">this month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frameworks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <BookOpen className="mr-1 h-4 w-4" />
              <span>Active frameworks</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="changes">Regulatory Changes</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Data Privacy Requirements</div>
                    <div className="text-sm text-muted-foreground">
                      GDPR Article 25 - Data Protection by Design
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="default">High Priority</Badge>
                    <Badge variant="secondary">In Progress</Badge>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Security Controls</div>
                    <div className="text-sm text-muted-foreground">
                      ISO 27001 - Access Control Requirements
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="default">Medium Priority</Badge>
                    <Badge variant="default">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Compliant
                    </Badge>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changes">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Change Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Regulatory Changes content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Compliance Monitoring content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Compliance Reporting content */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}