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
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Search, Download } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface RiskAssessment {
  id: string
  title: string
  description: string
  category: string
  likelihood: number
  impact: number
  riskScore: number
  owner: string
  status: string
  treatmentPlan: string
  reviewDate: string
  mitigationStatus: string
  residualRisk: string
}

export default function RiskManagementPage() {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const calculateRiskScore = (likelihood: number, impact: number) => {
    return likelihood * impact
  }

  const getRiskLevel = (score: number) => {
    if (score >= 15) return "Critical"
    if (score >= 10) return "High"
    if (score >= 5) return "Medium"
    return "Low"
  }

  const handleCreateAssessment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const likelihood = parseInt(formData.get("likelihood") as string)
    const impact = parseInt(formData.get("impact") as string)
    const riskScore = calculateRiskScore(likelihood, impact)
    
    const newAssessment: RiskAssessment = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      likelihood,
      impact,
      riskScore,
      owner: formData.get("owner") as string,
      status: "Active",
      treatmentPlan: formData.get("treatmentPlan") as string,
      reviewDate: formData.get("reviewDate") as string,
      mitigationStatus: "Not Started",
      residualRisk: "To Be Assessed"
    }

    setAssessments([...assessments, newAssessment])
    setIsDialogOpen(false)
    toast({
      title: "Risk Assessment Created",
      description: "New risk assessment has been created successfully."
    })
  }

  const handleUpdateStatus = (id: string, status: string) => {
    setAssessments(assessments.map(assessment => 
      assessment.id === id ? { ...assessment, status } : assessment
    ))
    toast({
      title: "Status Updated",
      description: `Risk assessment status updated to ${status}`
    })
  }

  const handleDeleteAssessment = (id: string) => {
    if (confirm("Are you sure you want to delete this risk assessment?")) {
      setAssessments(assessments.filter(a => a.id !== id))
      toast({
        title: "Assessment Deleted",
        description: "Risk assessment has been deleted"
      })
    }
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Risk Assessment</DialogTitle>
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
                      <SelectItem value="strategic">Strategic</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Risk Owner</Label>
                  <Input name="owner" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Likelihood (1-5)</Label>
                  <Select name="likelihood" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Rare</SelectItem>
                      <SelectItem value="2">2 - Unlikely</SelectItem>
                      <SelectItem value="3">3 - Possible</SelectItem>
                      <SelectItem value="4">4 - Likely</SelectItem>
                      <SelectItem value="5">5 - Almost Certain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Impact (1-5)</Label>
                  <Select name="impact" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Negligible</SelectItem>
                      <SelectItem value="2">2 - Minor</SelectItem>
                      <SelectItem value="3">3 - Moderate</SelectItem>
                      <SelectItem value="4">4 - Major</SelectItem>
                      <SelectItem value="5">5 - Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Treatment Plan</Label>
                <Textarea 
                  name="treatmentPlan" 
                  placeholder="Describe the risk treatment strategy and planned actions..."
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>Next Review Date</Label>
                <Input name="reviewDate" type="date" required />
              </div>

              <Button type="submit" className="w-full">Create Assessment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
            <p className="text-xs text-muted-foreground">
              Active assessments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter(a => a.riskScore >= 15).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical attention needed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter(a => new Date(a.reviewDate) <= new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter(a => a.status === "Mitigated").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully treated
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Risk Register</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search risks..." className="pl-8" />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Review Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {assessment.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{assessment.category}</Badge>
                  </TableCell>
                  <TableCell>{assessment.owner}</TableCell>
                  <TableCell>
                    <Badge variant={
                      assessment.riskScore >= 15 ? "destructive" :
                      assessment.riskScore >= 10 ? "default" :
                      "secondary"
                    }>
                      {getRiskLevel(assessment.riskScore)} ({assessment.riskScore})
                    </Badge>
                  </TableCell>
                  <TableCell>{assessment.reviewDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {assessment.status === "Mitigated" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : assessment.status === "Active" ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      {assessment.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(assessment.id, "Mitigated")}
                      >
                        Mitigate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteAssessment(assessment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}