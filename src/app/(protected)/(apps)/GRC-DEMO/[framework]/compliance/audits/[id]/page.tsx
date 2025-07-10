"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import { Progress } from "@/shadcn/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Calendar, Users, Clock, CheckCircle2, AlertCircle, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Audit {
  id: string;
  name: string;
  framework: string;
  status: "In Progress" | "Completed" | "Planned" | "Issues Found";
  dueDate: string;
  assignee: string;
  progress: number;
  description?: string;
  findings?: Array<{
    id: string;
    title: string;
    severity: "High" | "Medium" | "Low";
    status: "Open" | "In Progress" | "Resolved";
    description: string;
  }>;
  timeline?: Array<{
    date: string;
    event: string;
    details: string;
  }>;
  documents?: Array<{
    name: string;
    type: string;
    lastModified: string;
  }>;
}

export default function AuditDetailsPage({ params }: { params: { id: string } }) {
  const [audit, setAudit] = useState<Audit>({
    id: params.id,
    name: "SOC 2 Type II Annual Audit",
    framework: "SOC 2",
    status: "In Progress",
    dueDate: "2024-05-15",
    assignee: "Sarah Chen",
    progress: 65,
    description: "Annual SOC 2 Type II audit covering the Trust Services Criteria for Security, Availability, and Confidentiality.",
    findings: [
      {
        id: "1",
        title: "Access Review Documentation",
        severity: "Medium",
        status: "In Progress",
        description: "Quarterly access reviews were not consistently documented across all systems."
      },
      {
        id: "2",
        title: "Incident Response Testing",
        severity: "Low",
        status: "Open",
        description: "Annual incident response testing was not performed within the specified timeframe."
      }
    ],
    timeline: [
      {
        date: "2024-01-15",
        event: "Audit Kickoff",
        details: "Initial meeting with auditors, scope definition, and timeline planning"
      },
      {
        date: "2024-02-01",
        event: "Documentation Review",
        details: "Review of policies, procedures, and control documentation"
      },
      {
        date: "2024-03-01",
        event: "Control Testing",
        details: "Testing of implemented controls and collection of evidence"
      }
    ],
    documents: [
      {
        name: "Audit Scope Document",
        type: "PDF",
        lastModified: "2024-01-16"
      },
      {
        name: "Control Matrix",
        type: "XLSX",
        lastModified: "2024-02-15"
      },
      {
        name: "Evidence Collection List",
        type: "DOCX",
        lastModified: "2024-03-05"
      }
    ]
  });

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6">
        <Link href="/compliance/audits">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Audits
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{audit.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{audit.framework}</Badge>
              <div className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(audit.status)}`} />
                <span className="text-sm">{audit.status}</span>
              </div>
            </div>
          </div>
          <Button>Update Status</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audit.progress}%</div>
            <Progress value={audit.progress} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audit.dueDate}</div>
            <p className="text-xs text-muted-foreground">Target completion date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assignee</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audit.assignee}</div>
            <p className="text-xs text-muted-foreground">Primary contact</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Audit Overview</CardTitle>
              <CardDescription>
                Detailed information about the audit scope and objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{audit.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings">
          <Card>
            <CardHeader>
              <CardTitle>Audit Findings</CardTitle>
              <CardDescription>
                Issues and observations identified during the audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audit.findings?.map((finding) => (
                  <div key={finding.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{finding.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getSeverityColor(finding.severity)}>
                          {finding.severity}
                        </Badge>
                        <Badge variant="outline">{finding.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{finding.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Audit Timeline</CardTitle>
              <CardDescription>
                Key milestones and events during the audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audit.timeline?.map((event, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-l pl-4 relative">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.event}</span>
                        <span className="text-sm text-muted-foreground">{event.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Audit Documents</CardTitle>
              <CardDescription>
                Related documentation and evidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audit.documents?.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • Last modified {doc.lastModified}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}