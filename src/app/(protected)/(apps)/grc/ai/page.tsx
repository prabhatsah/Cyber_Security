"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { PredictiveDashboard } from "./components/predictive-dashboard"
import { NLPSearch } from "./components/nlp-search"
import { APIKeyConfig } from "./components/api-key-config"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Button } from "@/shadcn/ui/button"
import { Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"

export default function AIPage() {
  const [isConfigured, setIsConfigured] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('openai_api_key')
    }
    return false
  })

  if (!isConfigured) {
    return (
      <div className="flex flex-col gap-3 h-full overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>OpenAI Configuration Required</CardTitle>
          </CardHeader>
          <CardContent>
            <APIKeyConfig onConfigured={() => setIsConfigured(true)} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">AI Analysis</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>OpenAI Configuration</DialogTitle>
            </DialogHeader>
            <APIKeyConfig onConfigured={() => {}} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Processed this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Based on feedback
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Of monthly quota
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="predictive" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="nlp">Intelligent Search</TabsTrigger>
        </TabsList>

        <TabsContent value="predictive">
          <PredictiveDashboard />
        </TabsContent>

        <TabsContent value="nlp">
          <NLPSearch />
        </TabsContent>
      </Tabs>
    </div>
  )
}