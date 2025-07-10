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
import { UserX, Plus, Search } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface Employee {
  id: string
  name: string
  department: string
  exitDate: string
  status: string
  accessRevoked: boolean
  assetsReturned: boolean
  accountsDeactivated: boolean
}

export default function OffboardingPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddOffboarding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      department: formData.get("department") as string,
      exitDate: formData.get("exitDate") as string,
      status: "Pending",
      accessRevoked: false,
      assetsReturned: false,
      accountsDeactivated: false
    }

    setEmployees([...employees, newEmployee])
    setIsDialogOpen(false)
    toast({
      title: "Offboarding Started",
      description: "Employee has been added to offboarding process."
    })
  }

  const handleUpdateStatus = (employeeId: string, field: keyof Employee, value: boolean) => {
    setEmployees(employees.map(emp => {
      if (emp.id === employeeId) {
        const updatedEmployee = {
          ...emp,
          [field]: value
        }
        // Check if all tasks are complete
        const isComplete = updatedEmployee.accessRevoked && 
                         updatedEmployee.assetsReturned && 
                         updatedEmployee.accountsDeactivated
        
        return {
          ...updatedEmployee,
          status: isComplete ? "Complete" : "Pending"
        }
      }
      return emp
    }))
  }

  const handleRemoveEmployee = (employeeId: string) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId))
    toast({
      title: "Employee Removed",
      description: "Employee has been removed from offboarding list."
    })
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Start Offboarding
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Employee Offboarding</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOffboarding} className="space-y-4">
              <div className="space-y-2">
                <Label>Employee Name</Label>
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
                <Label>Exit Date</Label>
                <Input name="exitDate" type="date" required />
              </div>
              <Button type="submit" className="w-full">Start Offboarding</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offboarding Status</CardTitle>
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
                <TableHead>Exit Date</TableHead>
                <TableHead>Access Revocation</TableHead>
                <TableHead>Assets Returned</TableHead>
                <TableHead>Accounts Deactivated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <UserX className="h-4 w-4" />
                      {employee.name}
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.exitDate}</TableCell>
                  <TableCell>
                    <Button
                      variant={employee.accessRevoked ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus(employee.id, "accessRevoked", !employee.accessRevoked)}
                    >
                      {employee.accessRevoked ? "Complete" : "Mark Complete"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={employee.assetsReturned ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus(employee.id, "assetsReturned", !employee.assetsReturned)}
                    >
                      {employee.assetsReturned ? "Complete" : "Mark Complete"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={employee.accountsDeactivated ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus(employee.id, "accountsDeactivated", !employee.accountsDeactivated)}
                    >
                      {employee.accountsDeactivated ? "Complete" : "Mark Complete"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "Complete" ? "default" : "secondary"}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {employee.status === "Complete" && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveEmployee(employee.id)}
                        >
                          Remove
                        </Button>
                      )}
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