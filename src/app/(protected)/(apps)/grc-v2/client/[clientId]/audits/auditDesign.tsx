'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Button } from '@/shadcn/ui/button';
import { Badge } from '@/shadcn/ui/badge';
import { Input } from '@/shadcn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Progress } from '@/shadcn/ui/progress';
import { 
  ClipboardCheck, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Eye,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';

const audits = [
  {
    id: 1,
    name: 'ISO 27001 Annual Audit',
    framework: 'ISO 27001',
    type: 'Annual',
    status: 'In Progress',
    progress: 65,
    dueDate: '2024-02-15',
    assignedTo: 'Security Team',
    totalControls: 114,
    completedControls: 74,
    findings: 8,
    priority: 'High',
    lastActivity: '2024-01-20'
  },
  {
    id: 2,
    name: 'SOC 2 Type II Review',
    framework: 'SOC 2',
    type: 'Semi-Annual',
    status: 'Scheduled',
    progress: 0,
    dueDate: '2024-02-28',
    assignedTo: 'Compliance Team',
    totalControls: 156,
    completedControls: 0,
    findings: 0,
    priority: 'High',
    lastActivity: '2024-01-18'
  },
  {
    id: 3,
    name: 'GDPR Data Processing Audit',
    framework: 'GDPR',
    type: 'Quarterly',
    status: 'In Progress',
    progress: 40,
    dueDate: '2024-02-10',
    assignedTo: 'Legal Team',
    totalControls: 89,
    completedControls: 36,
    findings: 12,
    priority: 'Medium',
    lastActivity: '2024-01-19'
  },
  {
    id: 4,
    name: 'Access Control Review',
    framework: 'ISO 27001',
    type: 'Monthly',
    status: 'Completed',
    progress: 100,
    dueDate: '2024-01-31',
    assignedTo: 'IT Security',
    totalControls: 25,
    completedControls: 25,
    findings: 3,
    priority: 'Low',
    lastActivity: '2024-01-30'
  },
  {
    id: 5,
    name: 'Vendor Security Assessment',
    framework: 'SOC 2',
    type: 'Ad-hoc',
    status: 'In Progress',
    progress: 80,
    dueDate: '2024-02-05',
    assignedTo: 'Procurement',
    totalControls: 45,
    completedControls: 36,
    findings: 5,
    priority: 'Medium',
    lastActivity: '2024-01-21'
  },
  {
    id: 6,
    name: 'Backup Recovery Testing',
    framework: 'ISO 27001',
    type: 'Quarterly',
    status: 'Overdue',
    progress: 20,
    dueDate: '2024-01-15',
    assignedTo: 'IT Operations',
    totalControls: 15,
    completedControls: 3,
    findings: 2,
    priority: 'High',
    lastActivity: '2024-01-10'
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-800';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'scheduled':
      return 'bg-slate-100 text-slate-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-amber-100 text-amber-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return CheckCircle;
    case 'in progress':
      return Clock;
    case 'scheduled':
      return Calendar;
    case 'overdue':
      return AlertCircle;
    default:
      return ClipboardCheck;
  }
};

export default function Audits() {
  return (
    <>
    {/* <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight ">Audit Management</h1>
          <p className="">Track and manage compliance audits across all frameworks</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Audit
        </Button>
      </div> */}

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs ">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">4</div>
            <p className="text-xs ">Active audits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs ">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">87%</div>
            <p className="text-xs ">Control coverage</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4" />
          <Input placeholder="Search audits..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Frameworks</SelectItem>
            <SelectItem value="iso27001">ISO 27001</SelectItem>
            <SelectItem value="soc2">SOC 2</SelectItem>
            <SelectItem value="gdpr">GDPR</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[32rem] space-y-4 overflow-y-auto">
        {audits.map((audit) => {
          const StatusIcon = getStatusIcon(audit.status);
          return (
            <Card key={audit.id} className="h-[30%]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="border border-[#3c3c3e] p-2 rounded-lg">
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-lg">{audit.name}</CardTitle>
                        <Badge variant="outline">{audit.framework}</Badge>
                        <Badge className={getStatusColor(audit.status)}>
                          {audit.status}
                        </Badge>
                        <Badge className={getPriorityColor(audit.priority)}>
                          {audit.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>Type: {audit.type}</span>
                        <span>•</span>
                        <span>Assigned to: {audit.assignedTo}</span>
                        <span>•</span>
                        <span>Due: {audit.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Play className="w-4 h-4 mr-2" />
                        Start Audit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm mb-2">Progress</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span className="font-medium">{audit.progress}%</span>
                      </div>
                      <Progress value={audit.progress} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-2">Controls</p>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="font-medium">{audit.completedControls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">{audit.totalControls}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-2">Findings</p>
                    <div className="text-2xl font-bold text-amber-600">{audit.findings}</div>
                    <p className="text-xs">Issues identified</p>
                  </div>
                  <div>
                    <p className="text-sm mb-2">Last Activity</p>
                    <div className="text-sm font-medium">{audit.lastActivity}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    {/* </div> */}
    </>
  );
}