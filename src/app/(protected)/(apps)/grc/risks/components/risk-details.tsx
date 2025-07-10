"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Badge } from "@/shadcn/ui/badge"
import { Separator } from "@/shadcn/ui/separator"
import { format } from "date-fns"
import { Risk } from "../types"
import { getRiskPriorityLevel } from "../data"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface RiskDetailsProps {
  risk: Risk
}

export function RiskDetails({ risk }: RiskDetailsProps) {
  const priorityLevel = getRiskPriorityLevel(risk.riskScore)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Mitigated":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Active":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(risk.status)}
              {risk.name}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              ID: {risk.id}
            </div>
          </div>
          <Badge variant={
            priorityLevel === "Critical" ? "destructive" :
            priorityLevel === "High" ? "default" :
            priorityLevel === "Medium" ? "secondary" :
            "outline"
          } className="text-sm">
            {priorityLevel} Priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Risk Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{risk.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Owner:</span>
                <span className="font-medium">{risk.owner}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={
                  risk.status === "Mitigated" ? "default" :
                  risk.status === "Active" ? "destructive" :
                  "secondary"
                }>
                  {risk.status}
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Risk Assessment</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Severity:</span>
                <span className="font-medium">{risk.severity}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Likelihood:</span>
                <span className="font-medium">{risk.likelihood}/5</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Impact:</span>
                <span className="font-medium">{risk.impact}/5</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground">{risk.description}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Potential Impact</h4>
          <p className="text-sm text-muted-foreground">{risk.potentialImpact}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Existing Controls</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {risk.existingControls.map((control, i) => (
                <li key={i}>{control}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Required Actions</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {risk.requiredActions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Review History</h4>
          <div className="space-y-4">
            {risk.reviewHistory.map((review, i) => (
              <div key={i} className="text-sm border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {format(review.date, "MMM d, yyyy")}
                  </span>
                  <span className="text-muted-foreground">
                    by {review.reviewer}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2">{review.comments}</p>
                <div className="space-y-1">
                  {review.changes.map((change, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {change}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}