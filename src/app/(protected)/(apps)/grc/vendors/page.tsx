"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { VendorAssessment } from "./components/vendor-assessment"
import { VendorMonitoring } from "./components/vendor-monitoring"

export default function VendorsPage() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <Tabs defaultValue="assessment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessment">
          <VendorAssessment />
        </TabsContent>
        
        <TabsContent value="monitoring">
          <VendorMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  )
}