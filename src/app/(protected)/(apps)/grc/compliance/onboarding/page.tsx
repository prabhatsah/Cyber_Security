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
import { UserCheck, Plus, Search } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface Employee {
  id: string
  name: string
  department: string
  startDate: string
  status: string
  policyAcceptance: boolean
  training: boolean
  accessReview: boolean
}

export default function OnboardingPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      department: formData.get("department") as string,
      startDate: formData.get("startDate") as string,
      status: "Pending",
      policyAcceptance: false,
      training: false,
      accessReview: false
    }

    setEmployees([...employees, newEmployee])
    setIsDialogOpen(false)
    toast({
      title: "Employee Added",
      description: "New employee has been added to onboarding."
    })
  }

  const handleUpdateStatus = (employeeId: string, field: keyof Employee, value: boolean) => {
    setEmployees(employees.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          [field]: value,
          status: value ? "Complete" : "Pending"
        }
      }
      return emp
    }))
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search employees..." className="pl-8" />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Policy Acceptance</TableHead>
                <TableHead>Training</TableHead>
                <TableHead>Access Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      {employee.name}
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.startDate}</TableCell>
                  <TableCell>
                    <Button
                      variant={employee.policyAcceptance ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus(employee.id, "policyAcceptance", !employee.policyAcceptance)}
                    >
                      {employee.policyAcceptance ? "Complete" : "Mark Complete"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={employee.training ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus(employee.id, "training", !employee.training)}
                    >
                      {employee.training ? "Complete" : "Mark Complete"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={employee.accessReview ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus(employee.id, "accessReview", !employee.accessReview)}
                    >
                      {employee.accessReview ? "Complete" : "Mark Complete"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "Complete" ? "default" : "secondary"}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
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