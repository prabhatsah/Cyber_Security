"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { AssessmentDashboard } from "./components/assessment-dashboard"
import { AssessmentList } from "./components/assessment-list"
import { AssessmentWorkflow } from "./components/assessment-workflow"
import { FindingsManager } from "./components/findings-manager"
import { ReportGenerator } from "./components/report-generator"

export default function AssessmentsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">GRC Assessment</h2>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AssessmentDashboard />
        </TabsContent>

        <TabsContent value="assessments">
          <AssessmentList />
        </TabsContent>

        <TabsContent value="workflow">
          <AssessmentWorkflow />
        </TabsContent>

        <TabsContent value="findings">
          <FindingsManager />
        </TabsContent>

        <TabsContent value="reports">
          <ReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}