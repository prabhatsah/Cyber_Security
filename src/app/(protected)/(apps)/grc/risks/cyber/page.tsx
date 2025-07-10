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
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, ArrowUp, ArrowDown, Shield } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface CyberRisk {
  id: string
  title: string
  description: string
  category: string
  severity: string
  likelihood: string
  impact: string
  owner: string
  status: string
  controls: string[]
  mitigation: string
}

export default function CyberRiskPage() {
  const [risks, setRisks] = useState<CyberRisk[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCreateRisk = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newRisk: CyberRisk = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      severity: formData.get("severity") as string,
      likelihood: formData.get("likelihood") as string,
      impact: formData.get("impact") as string,
      owner: formData.get("owner") as string,
      status: "Active",
      controls: (formData.get("controls") as string).split("\n").filter(Boolean),
      mitigation: formData.get("mitigation") as string
    }

    setRisks([...risks, newRisk])
    setIsDialogOpen(false)
    toast({
      title: "Risk Assessment Created",
      description: "New cyber risk assessment has been created successfully."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Risk Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Cyber Risk Assessment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRisk} className="space-y-4">
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
                      <SelectItem value="data">Data Security</SelectItem>
                      <SelectItem value="network">Network Security</SelectItem>
                      <SelectItem value="application">Application Security</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="cloud">Cloud Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select name="severity" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Likelihood</Label>
                  <Select name="likelihood" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-high">Very High</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="very-low">Very Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Impact</Label>
                  <Select name="impact" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="significant">Significant</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Risk Owner</Label>
                <Input name="owner" required />
              </div>

              <div className="space-y-2">
                <Label>Existing Controls</Label>
                <Textarea
                  name="controls"
                  placeholder="Enter existing controls (one per line)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Mitigation Strategy</Label>
                <Textarea
                  name="mitigation"
                  placeholder="Describe the risk mitigation strategy..."
                  required
                />
              </div>

              <Button type="submit" className="w-full">Create Assessment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cyber Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+3</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">-2</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+5</span>
              <span className="ml-1">points</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Shield className="mr-1 h-4 w-4 text-green-500" />
              <span>Effectiveness</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="threats">Threat Landscape</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="controls">Security Controls</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle>Active Threats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {risks.map((risk) => (
                  <div key={risk.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{risk.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {risk.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        risk.severity === "critical" ? "destructive" :
                          risk.severity === "high" ? "default" :
                            "secondary"
                      }>{risk.severity}</Badge>
                      <Badge variant="secondary">
                        <Clock className="h-4 w-4 mr-1" />
                        {risk.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}

                {risks.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No active threats. Click "New Risk Assessment" to add one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Vulnerability Assessment content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle>Security Controls</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Security Controls content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Security Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Security Incidents content */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}