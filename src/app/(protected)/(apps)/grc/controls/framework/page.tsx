"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { FrameworkView } from "./framework-view"
import { NewFrameworkForm } from "./new-framework-form"
import { ImportControls } from "./import/import-controls"
import { EvidenceManager } from "./evidence/evidence-manager"
import { frameworks, controls } from "./data"

export default function FrameworkPage() {
  const [activeFramework, setActiveFramework] = useState(frameworks[0].id)
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Control Framework</h2>
      </div>

      <Tabs defaultValue="frameworks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="new">New Framework</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frameworks">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Framework Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  {frameworks.map((framework) => (
                    <button
                      key={framework.id}
                      onClick={() => setActiveFramework(framework.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${activeFramework === framework.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                        }`}
                    >
                      {framework.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <FrameworkView
              framework={frameworks.find(f => f.id === activeFramework)!}
              controls={controls.filter(c => 
                c.frameworks.some(f => f.id === activeFramework)
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="import">
          <ImportControls />
        </TabsContent>

        <TabsContent value="evidence">
          <EvidenceManager controls={controls} />
        </TabsContent>
        
        <TabsContent value="new">
          <NewFrameworkForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}