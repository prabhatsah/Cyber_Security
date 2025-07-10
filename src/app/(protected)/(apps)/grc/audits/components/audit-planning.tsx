"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Calendar } from "@/shadcn/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Textarea } from "@/shadcn/ui/textarea"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus, Users, FileText } from "lucide-react"
import { Badge } from "@/shadcn/ui/badge"

interface AuditPlan {
  id: string
  title: string
  type: string
  scope: string
  startDate: Date
  endDate: Date
  team: string[]
  riskLevel: string
  methodology: string
  resources: string[]
  status: string
}

export function AuditPlanning() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [plans, setPlans] = useState<AuditPlan[]>([
    {
      id: "1",
      title: "Annual Security Review",
      type: "Security",
      scope: "All IT Systems",
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-04-30"),
      team: ["John Smith", "Sarah Johnson"],
      riskLevel: "High",
      methodology: "Risk-based approach",
      resources: ["Security Tools", "Documentation"],
      status: "Planned"
    }
  ])

  const handleCreatePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPlan: AuditPlan = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      scope: formData.get("scope") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      team: (formData.get("team") as string).split(","),
      riskLevel: formData.get("riskLevel") as string,
      methodology: formData.get("methodology") as string,
      resources: (formData.get("resources") as string).split(","),
      status: "Planned"
    }

    setPlans([...plans, newPlan])
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Annual Audit Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Audit Title</Label>
                <Input name="title" placeholder="Enter audit title" required />
              </div>
              <div className="space-y-2">
                <Label>Audit Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security Audit</SelectItem>
                    <SelectItem value="compliance">Compliance Audit</SelectItem>
                    <SelectItem value="operational">Operational Audit</SelectItem>
                    <SelectItem value="financial">Financial Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Audit Scope</Label>
              <Textarea name="scope" placeholder="Define audit scope" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Risk Level</Label>
                <Select name="riskLevel" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Audit Team</Label>
              <div className="flex gap-2">
                <Input name="team" placeholder="Enter team members (comma-separated)" />
                <Button type="button" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Audit Methodology</Label>
              <Select name="methodology" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select methodology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk-based">Risk-Based Approach</SelectItem>
                  <SelectItem value="process">Process-Based Approach</SelectItem>
                  <SelectItem value="compliance">Compliance-Based Approach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Required Resources</Label>
              <Input name="resources" placeholder="Enter required resources (comma-separated)" />
            </div>

            <Button type="submit" className="w-full">Schedule Audit</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="font-medium">{plan.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(plan.startDate, "MMM d, yyyy")} - {format(plan.endDate, "MMM d, yyyy")}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{plan.type}</Badge>
                  <Badge variant={
                    plan.riskLevel === "High" ? "destructive" :
                    plan.riskLevel === "Medium" ? "default" :
                    "secondary"
                  }>{plan.riskLevel}</Badge>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}