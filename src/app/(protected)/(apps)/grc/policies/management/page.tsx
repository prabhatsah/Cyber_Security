"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { ArrowDown, ArrowUp, FileText, Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function PolicyManagementPage() {
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
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+8</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-4 w-4 text-blue-500" />
              <span>Pending approval</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="mr-1 h-4 w-4 text-yellow-500" />
              <span>Within 30 days</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">136</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
              <span>Active policies</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">Policy Library</TabsTrigger>
          <TabsTrigger value="lifecycle">Policy Lifecycle</TabsTrigger>
          <TabsTrigger value="review">Review & Approval</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Policy Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Information Security Policy</div>
                    <div className="text-sm text-muted-foreground">
                      Guidelines for protecting company information assets
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="default">Published</Badge>
                    <Badge variant="secondary">v2.1</Badge>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Policy
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Data Protection Policy</div>
                    <div className="text-sm text-muted-foreground">
                      GDPR compliance and data handling procedures
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">Under Review</Badge>
                    <Badge variant="secondary">v1.8</Badge>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Policy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle">
          <Card>
            <CardHeader>
              <CardTitle>Policy Lifecycle Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Policy Lifecycle content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Review & Approval Process</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Review & Approval content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Policy Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Policy Distribution content */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}