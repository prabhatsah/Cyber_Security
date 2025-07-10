"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Textarea } from "@/shadcn/ui/textarea"
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Search, Download, Shield, UserCheck, UserX } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface ScanResult {
  id: string
  system: string
  lastScan: string
  compliance: number
  deviations: number
  riskLevel: "High" | "Medium" | "Low"
  status: "Compliant" | "Non-Compliant" | "Review Required"
}

interface Employee {
  id: string
  name: string
  department: string
  startDate: string
  status: "Active" | "Inactive"
  policyAcceptance: boolean
  training: boolean
  accessReview: boolean
}

export default function ComplianceMonitoringPage() {
  const [activeTab, setActiveTab] = useState("infrastructure")
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isNewScanDialogOpen, setIsNewScanDialogOpen] = useState(false)
  const [isNewEmployeeDialogOpen, setIsNewEmployeeDialogOpen] = useState(false)
  const { toast } = useToast()

  // Function to handle starting a new scan
  const handleStartScan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newScan: ScanResult = {
      id: Date.now().toString(),
      system: formData.get("system") as string,
      lastScan: new Date().toISOString(),
      compliance: 0,
      deviations: 0,
      riskLevel: "Medium",
      status: "Review Required"
    }

    setScanResults([...scanResults, newScan])
    setIsNewScanDialogOpen(false)
    
    toast({
      title: "Scan Started",
      description: `Compliance scan initiated for ${newScan.system}`
    })

    // Simulate scan completion after 3 seconds
    setTimeout(() => {
      setScanResults(prev => prev.map(scan => 
        scan.id === newScan.id ? {
          ...scan,
          compliance: 95,
          deviations: 2,
          riskLevel: "Low",
          status: "Compliant"
        } : scan
      ))

      toast({
        title: "Scan Complete",
        description: `Compliance scan completed for ${newScan.system}`
      })
    }, 3000)
  }

  // Function to handle employee onboarding
  const handleEmployeeOnboard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      department: formData.get("department") as string,
      startDate: formData.get("startDate") as string,
      status: "Active",
      policyAcceptance: false,
      training: false,
      accessReview: false
    }

    setEmployees([...employees, newEmployee])
    setIsNewEmployeeDialogOpen(false)
    toast({
      title: "Employee Onboarded",
      description: `${newEmployee.name} has been added to onboarding process`
    })
  }

  // Function to handle employee offboarding
  const handleEmployeeOffboard = (employeeId: string) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId ? { ...emp, status: "Inactive" } : emp
    ))
    toast({
      title: "Employee Offboarded",
      description: "Employee has been marked for offboarding"
    })
  }

  // Function to handle updating employee compliance status
  const handleUpdateComplianceStatus = (employeeId: string, field: keyof Employee, value: boolean) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId ? { ...emp, [field]: value } : emp
    ))
    toast({
      title: "Status Updated",
      description: "Employee compliance status has been updated"
    })
  }

  // Function to handle viewing scan details
  const handleViewDetails = (scanId: string) => {
    const scan = scanResults.find(s => s.id === scanId)
    if (scan) {
      toast({
        title: "Scan Details",
        description: `Viewing details for ${scan.system}`
      })
    }
  }

  // Function to handle exporting reports
  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Compliance report has been exported successfully"
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex flex-row-reverse items-center justify-between space-y-2">
        <div className="flex gap-2">
          <Dialog open={isNewEmployeeDialogOpen} onOpenChange={setIsNewEmployeeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserCheck className="mr-2 h-4 w-4" />
                New Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEmployeeOnboard} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input name="name" required />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select name="department" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input name="startDate" type="date" required />
                </div>
                <Button type="submit" className="w-full">Add Employee</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewScanDialogOpen} onOpenChange={setIsNewScanDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Scan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Compliance Scan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleStartScan} className="space-y-4">
                <div className="space-y-2">
                  <Label>System</Label>
                  <Select name="system" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production Servers</SelectItem>
                      <SelectItem value="development">Development Environment</SelectItem>
                      <SelectItem value="network">Network Infrastructure</SelectItem>
                      <SelectItem value="cloud">Cloud Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scan Type</Label>
                  <Select name="scanType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Scan</SelectItem>
                      <SelectItem value="quick">Quick Scan</SelectItem>
                      <SelectItem value="targeted">Targeted Scan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea name="notes" placeholder="Enter any additional notes..." />
                </div>
                <Button type="submit" className="w-full">Start Scan</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infrastructure Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last scan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Training completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Open issues
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="infrastructure" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="offboarding">Offboarding</TabsTrigger>
          <TabsTrigger value="continuous">Continuous Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="infrastructure">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Infrastructure Compliance Status</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    <TableHead>Last Scan</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Deviations</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Production Servers
                      </div>
                    </TableCell>
                    <TableCell>10 mins ago</TableCell>
                    <TableCell>98%</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Badge variant="default">Medium</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Compliant
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Employee Onboarding Compliance</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Policy Acceptance</TableHead>
                    <TableHead>Training</TableHead>
                    <TableHead>Access Review</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        John Smith
                      </div>
                    </TableCell>
                    <TableCell>IT</TableCell>
                    <TableCell>Mar 15, 2024</TableCell>
                    <TableCell>
                      <Badge variant="default">Complete</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Complete</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Verified</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Checklist</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offboarding">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Employee Offboarding Compliance</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Exit Date</TableHead>
                    <TableHead>Access Revocation</TableHead>
                    <TableHead>Asset Return</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserX className="h-4 w-4" />
                        Sarah Johnson
                      </div>
                    </TableCell>
                    <TableCell>HR</TableCell>
                    <TableCell>Mar 31, 2024</TableCell>
                    <TableCell>
                      <Badge variant="default">Complete</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Complete</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Verified</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Report</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="continuous">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Continuous Compliance Monitoring</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Monitor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Access Pattern Analysis
                      </div>
                    </TableCell>
                    <TableCell>Security</TableCell>
                    <TableCell>5 mins ago</TableCell>
                    <TableCell>Continuous</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Normal
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}