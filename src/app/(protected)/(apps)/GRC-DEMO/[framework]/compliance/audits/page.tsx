"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Badge } from "@/shadcn/ui/badge";
import { FileText, Clock, CheckCircle2, AlertCircle, Plus, Calendar, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Audit {
  id: string;
  name: string;
  framework: string;
  status: "In Progress" | "Completed" | "Planned" | "Issues Found";
  dueDate: string;
  assignee: string;
  progress: number;
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([
    {
      id: "1",
      name: "SOC 2 Type II Annual Audit",
      framework: "SOC 2",
      status: "In Progress",
      dueDate: "2024-05-15",
      assignee: "Sarah Chen",
      progress: 65
    },
    {
      id: "2",
      name: "ISO 27001 Surveillance Audit",
      framework: "ISO 27001",
      status: "Planned",
      dueDate: "2024-06-20",
      assignee: "Michael Brown",
      progress: 0
    },
    {
      id: "3",
      name: "HIPAA Compliance Assessment",
      framework: "HIPAA",
      status: "Completed",
      dueDate: "2024-03-10",
      assignee: "David Wilson",
      progress: 100
    },
    {
      id: "4",
      name: "GDPR Data Protection Audit",
      framework: "GDPR",
      status: "Issues Found",
      dueDate: "2024-03-01",
      assignee: "Emma Davis",
      progress: 85
    }
  ]);

  const [newAudit, setNewAudit] = useState({
    name: "",
    framework: "",
    dueDate: "",
    assignee: ""
  });

  const handleAddAudit = () => {
    if (newAudit.name && newAudit.framework && newAudit.dueDate && newAudit.assignee) {
      const newId = (audits.length + 1).toString();
      setAudits([...audits, {
        id: newId,
        ...newAudit,
        status: "Planned",
        progress: 0
      }]);
      setNewAudit({ name: "", framework: "", dueDate: "", assignee: "" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Issues Found":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Compliance Audits</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your compliance audits and assessments
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Audit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Audit</DialogTitle>
              <DialogDescription>
                Add a new compliance audit to track
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Audit Name</label>
                <Input
                  placeholder="e.g., SOC 2 Type II Annual Audit"
                  value={newAudit.name}
                  onChange={(e) => setNewAudit({ ...newAudit, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Framework</label>
                <Input
                  placeholder="e.g., SOC 2"
                  value={newAudit.framework}
                  onChange={(e) => setNewAudit({ ...newAudit, framework: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={newAudit.dueDate}
                  onChange={(e) => setNewAudit({ ...newAudit, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Assignee</label>
                <Input
                  placeholder="e.g., John Smith"
                  value={newAudit.assignee}
                  onChange={(e) => setNewAudit({ ...newAudit, assignee: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleAddAudit}>
                Create Audit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audits.length}</div>
            <p className="text-xs text-muted-foreground">Across all frameworks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {audits.filter(a => a.status === "In Progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Active assessments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {audits.filter(a => a.status === "Completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully passed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {audits.filter(a => a.status === "Issues Found").length}
            </div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Audits</CardTitle>
          <CardDescription>Overview of your ongoing compliance assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {audits.map((audit) => (
              <div
                key={audit.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{audit.name}</span>
                    <Badge variant="outline">{audit.framework}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due {audit.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{audit.assignee}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(audit.status)}`} />
                      <span className="text-sm font-medium">{audit.status}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{audit.progress}% complete</div>
                  </div>
                  <Link href={`/compliance/audits/${audit.id}`}>
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}