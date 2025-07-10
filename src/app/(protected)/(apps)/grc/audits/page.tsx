"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { AuditPlanning } from "./components/audit-planning"
import { AuditExecution } from "./components/audit-execution"
import { AuditReporting } from "./components/audit-reporting"

export default function AuditsPage() {
  return (
    <div className="h-full overflow-y-auto">
      {/* <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Audit Management</h2>
      </div> */}

      <Tabs defaultValue="planning">
        <TabsList>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="planning">
          <AuditPlanning />
        </TabsContent>
        
        <TabsContent value="execution">
          <AuditExecution />
        </TabsContent>

        <TabsContent value="reporting">
          <AuditReporting />
        </TabsContent>
      </Tabs>
    </div>
  )
}