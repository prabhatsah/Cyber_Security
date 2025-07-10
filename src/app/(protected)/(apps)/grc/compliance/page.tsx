import React from 'react'

export default function Compliance() {
  return (
    <div>Work In Progress</div>
  )
}


// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table"
// import { Badge } from "@/shadcn/ui/badge"
// import { Button } from "@/shadcn/ui/button"
// import { Input } from "@/shadcn/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
// import { Label } from "@/shadcn/ui/label"
// import { Textarea } from "@/shadcn/ui/textarea"
// import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle, Download, FileText, Plus, Search, Upload, Users } from "lucide-react"

// export default function CompliancePage() {
//   const [searchTerm, setSearchTerm] = useState("")

//   return (
//     <div className="flex flex-col gap-3 h-full overflow-auto">
//       <div className="flex flex-row-reverse items-center justify-between space-y-2">
//         <div className="flex items-center gap-2">
//           <Button variant="outline">
//             <Upload className="mr-2 h-4 w-4" />
//             Export Data
//           </Button>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Requirement
//           </Button>
//         </div>
//       </div>

//       {/* Dashboard Overview */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">85%</div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
//               <span className="text-green-500 font-medium">5%</span>
//               <span className="ml-1">from last quarter</span>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Medium</div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
//               <span className="text-green-500 font-medium">Improved</span>
//               <span className="ml-1">from High</span>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">12</div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
//               <span className="text-green-500 font-medium">-3</span>
//               <span className="ml-1">from last month</span>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">94%</div>
//             <div className="flex items-center text-xs text-muted-foreground">
//               <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
//               <span className="text-green-500 font-medium">2%</span>
//               <span className="ml-1">this month</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="requirements" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="requirements">Requirements</TabsTrigger>
//           <TabsTrigger value="issues">Issues</TabsTrigger>
//           <TabsTrigger value="training">Training</TabsTrigger>
//         </TabsList>

//         {/* Requirements Tab */}
//         <TabsContent value="requirements">
//           <Card>
//             <CardHeader>
//               <CardTitle>Active Requirements</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="flex-1">
//                   <div className="relative">
//                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Search requirements..."
//                       className="pl-8"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <Select defaultValue="all">
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="complete">Complete</SelectItem>
//                     <SelectItem value="in-progress">In Progress</SelectItem>
//                     <SelectItem value="pending">Pending Review</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Requirement</TableHead>
//                     <TableHead>Priority</TableHead>
//                     <TableHead>Owner</TableHead>
//                     <TableHead>Department</TableHead>
//                     <TableHead>Due Date</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell className="font-medium">
//                       <div className="flex items-center gap-2">
//                         <FileText className="h-4 w-4" />
//                         Data Privacy Assessment
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="destructive">High</Badge>
//                     </TableCell>
//                     <TableCell>Sarah Johnson</TableCell>
//                     <TableCell>Legal</TableCell>
//                     <TableCell>Apr 15, 2024</TableCell>
//                     <TableCell>
//                       <Badge variant="secondary">In Progress</Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Button variant="outline" size="sm">View Details</Button>
//                     </TableCell>
//                   </TableRow>
//                   {/* Add more rows as needed */}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Issues Tab */}
//         <TabsContent value="issues">
//           <Card>
//             <CardHeader>
//               <CardTitle>Open Issues Register</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Issue</TableHead>
//                     <TableHead>Severity</TableHead>
//                     <TableHead>Owner</TableHead>
//                     <TableHead>Discovery Date</TableHead>
//                     <TableHead>Target Resolution</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell className="font-medium">
//                       <div className="flex items-center gap-2">
//                         <AlertTriangle className="h-4 w-4 text-yellow-500" />
//                         Access Control Gap
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge>Medium</Badge>
//                     </TableCell>
//                     <TableCell>John Smith</TableCell>
//                     <TableCell>Mar 10, 2024</TableCell>
//                     <TableCell>Apr 10, 2024</TableCell>
//                     <TableCell>
//                       <Badge variant="secondary">Mitigating</Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Button variant="outline" size="sm">View Details</Button>
//                     </TableCell>
//                   </TableRow>
//                   {/* Add more rows as needed */}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Training Tab */}
//         <TabsContent value="training">
//           <Card>
//             <CardHeader>
//               <CardTitle>Training Completion Matrix</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="flex-1">
//                   <div className="relative">
//                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input placeholder="Search employees..." className="pl-8" />
//                   </div>
//                 </div>
//                 <Select defaultValue="all">
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Department" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Departments</SelectItem>
//                     <SelectItem value="it">IT</SelectItem>
//                     <SelectItem value="hr">HR</SelectItem>
//                     <SelectItem value="legal">Legal</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Employee</TableHead>
//                     <TableHead>Role</TableHead>
//                     <TableHead>Department</TableHead>
//                     <TableHead>Required Training</TableHead>
//                     <TableHead>Completion</TableHead>
//                     <TableHead>Due Date</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell className="font-medium">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4" />
//                         Michael Brown
//                       </div>
//                     </TableCell>
//                     <TableCell>Developer</TableCell>
//                     <TableCell>IT</TableCell>
//                     <TableCell>Security Awareness</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="h-4 w-4 text-green-500" />
//                         Complete
//                       </div>
//                     </TableCell>
//                     <TableCell>Mar 15, 2024</TableCell>
//                     <TableCell>
//                       <Button variant="outline" size="sm">View Certificate</Button>
//                     </TableCell>
//                   </TableRow>
//                   {/* Add more rows as needed */}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }