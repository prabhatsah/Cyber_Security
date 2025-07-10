"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { BuildingDetailsForm } from "./building-details-form"
import { FloorsConfig } from "./floors-config"
import { SystemsConfig } from "./systems-config"
import { CompletionStep } from "./completion-step"
import { Button } from "@/shadcn/ui/button"
import { ArrowLeft, ArrowRight, Building, CheckCircle2, Layers, Settings } from "lucide-react"
import { Progress } from "@/shadcn/ui/progress"

export function OnboardingPage() {
  const [activeTab, setActiveTab] = useState("building-details")
  const [progress, setProgress] = useState(25)
  
  const handleNext = () => {
    if (activeTab === "building-details") {
      setActiveTab("floors")
      setProgress(50)
    } else if (activeTab === "floors") {
      setActiveTab("systems")
      setProgress(75)
    } else if (activeTab === "systems") {
      setActiveTab("complete")
      setProgress(100)
    }
  }
  
  const handleBack = () => {
    if (activeTab === "floors") {
      setActiveTab("building-details")
      setProgress(25)
    } else if (activeTab === "systems") {
      setActiveTab("floors")
      setProgress(50)
    } else if (activeTab === "complete") {
      setActiveTab("systems")
      setProgress(75)
    }
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Building Onboarding</h1>
      </div>
      
      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <CardTitle>Add a New Building</CardTitle>
          <CardDescription>
            Complete the following steps to onboard a new building to the system
          </CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Building Details</span>
              <span>Floors</span>
              <span>Systems</span>
              <span>Complete</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="hidden">
              <TabsList>
                <TabsTrigger value="building-details">Building Details</TabsTrigger>
                <TabsTrigger value="floors">Floors</TabsTrigger>
                <TabsTrigger value="systems">Systems</TabsTrigger>
                <TabsTrigger value="complete">Complete</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="building-details" className="space-y-6">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Building className="h-5 w-5" />
                <h3 className="text-lg font-medium">Building Details</h3>
              </div>
              <BuildingDetailsForm />
            </TabsContent>
            
            <TabsContent value="floors" className="space-y-6">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Layers className="h-5 w-5" />
                <h3 className="text-lg font-medium">Configure Floors</h3>
              </div>
              <FloorsConfig />
            </TabsContent>
            
            <TabsContent value="systems" className="space-y-6">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Settings className="h-5 w-5" />
                <h3 className="text-lg font-medium">Building Systems</h3>
              </div>
              <SystemsConfig />
            </TabsContent>
            
            <TabsContent value="complete" className="space-y-6">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="text-lg font-medium">Onboarding Complete</h3>
              </div>
              <CompletionStep />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 pb-6">
          {activeTab !== "building-details" ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {activeTab !== "complete" ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button>
              Go to Building Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}