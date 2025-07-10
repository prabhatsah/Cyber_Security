"use client";

import { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import { Progress } from "@/shadcn/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { AlertTriangle, Shield, Clock, Plus, Calendar, Users } from "lucide-react";
import { riskScenarios } from "../../data/risk-scenarios";

interface Risk {
  id: string;
  name: string;
  description: string;
  category: string;
  vulnerability: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "In Review" | "Closed";
  impact: "Critical" | "High" | "Medium" | "Low";
  likelihood: "High" | "Medium" | "Low";
  owner: string;
  dueDate: string;
  treatment: string;
  controls: string[];
  score: number;
  progress: number;
}

export default function RiskRegisterPage() {
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: "1",
      name: "Data breach through unauthorized access",
      description: "Risk of unauthorized access leading to data breach",
      category: "Security",
      vulnerability: "Weak access controls and authentication mechanisms",
      severity: "High",
      status: "Open",
      impact: "Critical",
      likelihood: "Medium",
      owner: "John Smith",
      dueDate: "2024-04-15",
      treatment: "Implement additional access controls and monitoring",
      controls: ["ACC-01", "ACC-02"],
      score: 8,
      progress: 25
    },
    {
      id: "2",
      name: "Non-compliance with data protection regulations",
      description: "Risk of non-compliance with data protection regulations",
      category: "Compliance",
      vulnerability: "Inadequate privacy controls and documentation",
      severity: "Medium",
      status: "In Progress",
      impact: "High",
      likelihood: "Low",
      owner: "Jane Doe",
      dueDate: "2024-04-30",
      treatment: "Regular compliance audits and updates",
      controls: ["COM-01"],
      score: 6,
      progress: 60
    },
    {
      id: "3",
      name: "System downtime affecting critical services",
      description: "Risk of system downtime affecting business operations",
      category: "Operations",
      vulnerability: "Single points of failure in infrastructure",
      severity: "High",
      status: "In Review",
      impact: "High",
      likelihood: "Medium",
      owner: "Mike Johnson",
      dueDate: "2024-04-10",
      treatment: "Implement redundancy and monitoring",
      controls: ["OPS-01", "OPS-02"],
      score: 7,
      progress: 85
    }
  ]);

  const [newRisk, setNewRisk] = useState({
    name: "",
    description: "",
    category: "",
    vulnerability: "",
    severity: "",
    dueDate: "",
    owner: "",
    impact: "",
    likelihood: "",
    treatment: "",
    controls: [] as string[],
  });

  const handleAddRisk = () => {
    if (newRisk.name && newRisk.category) {
      const risk: Risk = {
        id: (risks.length + 1).toString(),
        ...newRisk,
        status: "Open",
        progress: 0,
        score: calculateRiskScore(newRisk.impact as any, newRisk.likelihood as any),
      };
      setRisks([...risks, risk]);
      setNewRisk({
        name: "",
        description: "",
        category: "",
        vulnerability: "",
        severity: "",
        dueDate: "",
        owner: "",
        impact: "",
        likelihood: "",
        treatment: "",
        controls: [],
      });
    }
  };

  const calculateRiskScore = (impact: string, likelihood: string) => {
    const impactScore = impact === "Critical" ? 5 : impact === "High" ? 4 : impact === "Medium" ? 3 : 2;
    const likelihoodScore = likelihood === "High" ? 5 : likelihood === "Medium" ? 3 : 1;
    return Math.round((impactScore * likelihoodScore) / 2);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "destructive";
      case "Medium":
        return "warning";
      case "Low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Risk Register</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage risks that apply to your business.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{risks.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {risks.filter(r => r.severity === "High").length}
            </div>
            <p className="text-xs text-muted-foreground">-1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {risks.filter(r => r.status === "In Progress").length}
            </div>
            <Progress value={58} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(risks.reduce((acc, risk) => acc + risk.score, 0) / risks.length)}
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Risk Register</CardTitle>
              <CardDescription>
                Comprehensive view of all identified risks
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Risk
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Add New Risk</DialogTitle>
                  <DialogDescription>
                    Create a new risk entry from the risk library or add a custom risk
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[calc(90vh-8rem)]">
                  <div className="grid gap-4 py-4 pr-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Risk Scenario</label>
                      <Select onValueChange={(value) => {
                        const scenario = riskScenarios.find(s => s.id === value);
                        if (scenario) {
                          setNewRisk({
                            ...newRisk,
                            name: scenario.risk,
                            description: scenario.description,
                            category: scenario.category,
                            vulnerability: scenario.vulnerability
                          });
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select from risk library" />
                        </SelectTrigger>
                        <SelectContent>
                          {riskScenarios.map((scenario) => (
                            <SelectItem key={scenario.id} value={scenario.id}>
                              {scenario.risk}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newRisk.name}
                        onChange={(e) => setNewRisk({ ...newRisk, name: e.target.value })}
                        placeholder="Risk name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newRisk.description}
                        onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                        placeholder="Detailed description of the risk"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Vulnerability</label>
                      <Textarea
                        value={newRisk.vulnerability}
                        onChange={(e) => setNewRisk({ ...newRisk, vulnerability: e.target.value })}
                        placeholder="Describe the vulnerability"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input
                          value={newRisk.category}
                          onChange={(e) => setNewRisk({ ...newRisk, category: e.target.value })}
                          placeholder="Risk category"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Severity</label>
                        <Select onValueChange={(value) => setNewRisk({ ...newRisk, severity: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Impact</label>
                        <Select onValueChange={(value) => setNewRisk({ ...newRisk, impact: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select impact" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Likelihood</label>
                        <Select onValueChange={(value) => setNewRisk({ ...newRisk, likelihood: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select likelihood" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Owner</label>
                        <Input
                          value={newRisk.owner}
                          onChange={(e) => setNewRisk({ ...newRisk, owner: e.target.value })}
                          placeholder="Risk owner"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Due Date</label>
                        <Input
                          type="date"
                          value={newRisk.dueDate}
                          onChange={(e) => setNewRisk({ ...newRisk, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Treatment Plan</label>
                      <Textarea
                        value={newRisk.treatment}
                        onChange={(e) => setNewRisk({ ...newRisk, treatment: e.target.value })}
                        placeholder="Risk treatment plan"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Associated Controls</label>
                      <Input
                        placeholder="Enter control IDs (comma-separated)"
                        onChange={(e) => setNewRisk({ ...newRisk, controls: e.target.value.split(",").map(c => c.trim()) })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAddRisk}>Add Risk</Button>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{risk.name}</p>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{risk.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(risk.severity)}>
                        {risk.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{risk.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{risk.owner}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{risk.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{risk.score}</div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{risk.progress}%</span>
                        </div>
                        <Progress value={risk.progress} className="h-2" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}