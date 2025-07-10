"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Textarea } from "@/shadcn/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, ArrowDown, ArrowUp } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { v4 } from "uuid"
import { startAssessmentProcess } from "./Risk Assessment/startRiskAssessment"
import AssessmentTable from "./Risk Assessment/AssessmentDataTable"
import RegisterTable from "./Risk Register/RegisterDataTable"

interface RiskAssessment {
  riskId: string
  riskTitle: string
  riskDescription: string
  riskCategory: string
  riskLevel: string
  riskOwner: string
  riskStatus: string
  riskTimeline: string
  riskImpact: string
  riskMitigation: string
}

export default function EnterpriseRiskPage() {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
 // const { toast } = useToast()

  // const handleCreateAssessment = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const formData = new FormData(e.currentTarget)
    
  //   const newAssessment: RiskAssessment = {
  //     riskId: v4(),
  //     riskTitle: formData.get("title") as string,
  //     riskDescription: formData.get("description") as string,
  //     riskCategory: formData.get("category") as string,
  //     riskLevel: formData.get("riskLevel") as string,
  //     riskOwner: formData.get("owner") as string,
  //     riskStatus: "Active",
  //     riskTimeline: formData.get("timeline") as string,
  //     riskImpact: formData.get("impact") as string,
  //     riskMitigation: formData.get("mitigation") as string
  //   }
  //   console.log('newAssessment ---------- ', newAssessment)
  //   await startAssessmentProcess(newAssessment);

  //   setAssessments([...assessments, newAssessment])
  //   setIsDialogOpen(false)
  //   // toast({
  //   //   title: "Risk Assessment Created",
  //   //   description: "New enterprise risk assessment has been created successfully."
  //   // })
  // }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Risk Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Enterprise Risk Assessment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAssessment} className="space-y-4">
              <div className="space-y-2">
                <Label>Risk Title</Label>
                <Input name="title" required />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Strategic">Strategic</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Reputational">Reputational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Select name="riskLevel" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Risk Owner</Label>
                  <Input name="owner" required />
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Input name="timeline" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Potential Impact</Label>
                <Textarea name="impact" required />
              </div>

              <div className="space-y-2">
                <Label>Mitigation Strategy</Label>
                <Textarea name="mitigation" required />
              </div>

              <Button type="submit" className="w-full">Create Assessment</Button>
            </form>
          </DialogContent>
        </Dialog> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enterprise Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+5</span>
              <span className="ml-1">from last quarter</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">-2</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Medium</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">Improved</span>
              <span className="ml-1">from High</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+4%</span>
              <span className="ml-1">completion rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="register" className="space-y-4">
        <TabsList>
          <TabsTrigger value="register">Risk Register</TabsTrigger>
          <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Plans</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Risk Register</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.riskId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{assessment.riskTitle}</div>
                      <div className="text-sm text-muted-foreground">
                        {assessment.riskDescription}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        assessment.riskLevel === "critical" ? "destructive" :
                        assessment.riskLevel === "high" ? "default" : "secondary"
                      }>{assessment.riskLevel}</Badge>
                      <Badge variant="secondary">
                        <Clock className="h-4 w-4 mr-1" />
                        {assessment.riskStatus}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div> */}
              <RegisterTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Risk Assessment content */}
              <AssessmentTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plans</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Treatment Plans content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting">
          <Card>
            <CardHeader>
              <CardTitle>Risk Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Risk Reporting content */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}