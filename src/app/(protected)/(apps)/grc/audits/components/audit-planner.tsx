"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Calendar } from "@/shadcn/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus } from "lucide-react"

export function AuditPlanner() {
  const [selectedDate, setSelectedDate] = useState<Date>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Audit Title</Label>
              <Input placeholder="Enter audit title" />
            </div>
            <div className="space-y-2">
              <Label>Audit Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Audit</SelectItem>
                  <SelectItem value="external">External Audit</SelectItem>
                  <SelectItem value="compliance">Compliance Audit</SelectItem>
                  <SelectItem value="security">Security Audit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
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
              <Label>Duration (Days)</Label>
              <Input type="number" min={1} defaultValue={5} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Audit Scope</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Scope</SelectItem>
                <SelectItem value="partial">Partial Scope</SelectItem>
                <SelectItem value="focused">Focused Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Audit Team</Label>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Add team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auditor1">John Smith</SelectItem>
                  <SelectItem value="auditor2">Sarah Johnson</SelectItem>
                  <SelectItem value="auditor3">Mike Brown</SelectItem>
                </SelectContent>
              </Select>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button className="w-full">Schedule Audit</Button>
        </div>
      </CardContent>
    </Card>
  )
}