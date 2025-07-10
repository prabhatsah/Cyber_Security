"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Badge } from "@/shadcn/ui/badge"
import { RiskMatrix } from "./components/risk-matrix"
import { RiskTable } from "./components/risk-table"
import { risks, getRisksByCategory } from "./data"
import { RiskCategory } from "./types"

export default function RisksPage() {
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>("Strategic")
  
  const categories: RiskCategory[] = [
    "Strategic",
    "Operational",
    "Cybersecurity",
    "Compliance",
    "Technical",
    "Financial"
  ]

  const categoryRisks = getRisksByCategory(selectedCategory)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Risk Management</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{risks.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {risks.filter(r => r.riskScore >= 15).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {risks.filter(r => r.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              In progress mitigations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {risks.filter(r => r.nextReviewDate < new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending assessments
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="matrix">Risk Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Risk Categories</CardTitle>
                  <div className="flex gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          ${selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80"
                          }
                        `}
                      >
                        {category}
                        <Badge variant="outline" className="ml-2">
                          {getRisksByCategory(category).length}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RiskTable
                  risks={categoryRisks}
                  category={selectedCategory}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matrix">
          <RiskMatrix risks={risks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}