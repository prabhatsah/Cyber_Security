"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import { Progress } from "@/shadcn/ui/progress";
import { LineChart, Line, BarChart, Bar, Cell } from "recharts";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Chart } from "@/shadcn/ui/chart";
import {
  chartColors,
  statusColors,
  riskLevelColors,
} from "../../lib/chart-theme";

const assessmentProgress = [
  { month: "Jan", completed: 12, inProgress: 8, planned: 5 },
  { month: "Feb", completed: 15, inProgress: 10, planned: 7 },
  { month: "Mar", completed: 18, inProgress: 7, planned: 4 },
  { month: "Apr", completed: 14, inProgress: 12, planned: 6 },
  { month: "May", completed: 22, inProgress: 9, planned: 8 },
  { month: "Jun", completed: 19, inProgress: 11, planned: 5 },
];

const findingsByRisk = [
  { name: "Critical", value: 5, color: "hsl(0, 84%, 60%)" },
  { name: "High", value: 12, color: "hsl(30, 84%, 60%)" },
  { name: "Medium", value: 18, color: "hsl(45, 84%, 60%)" },
  { name: "Low", value: 25, color: "hsl(120, 84%, 60%)" },
];

export function AssessmentDashboard() {
  const [chartColors, setChartColors] = useState(statusColors);
  const [colorDialogOpen, setColorDialogOpen] = useState(false);

  const handleColorChange = (key: string, value: string) => {
    setChartColors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">-5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Past Due Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+2% from target</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Assessment Progress</CardTitle>
            <Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chart Colors</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Completed Color</Label>
                    <Input
                      type="color"
                      value={chartColors.Completed}
                      onChange={(e) =>
                        handleColorChange("Completed", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>In Progress Color</Label>
                    <Input
                      type="color"
                      value={chartColors["In Progress"]}
                      onChange={(e) =>
                        handleColorChange("In Progress", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Planned Color</Label>
                    <Input
                      type="color"
                      value={chartColors.Planned}
                      onChange={(e) =>
                        handleColorChange("Planned", e.target.value)
                      }
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Chart>
              <LineChart data={assessmentProgress}>
                <Chart.Grid />
                <Chart.XAxis dataKey="month" />
                <Chart.YAxis />
                <Chart.Tooltip />
                <Chart.Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke={chartColors.Completed}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="inProgress"
                  name="In Progress"
                  stroke={chartColors["In Progress"]}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="planned"
                  name="Planned"
                  stroke={chartColors.Planned}
                  strokeWidth={2}
                />
              </LineChart>
            </Chart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Findings by Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart>
              <BarChart data={findingsByRisk}>
                <Chart.Grid />
                <Chart.XAxis dataKey="name" />
                <Chart.YAxis />
                <Chart.Tooltip />
                <Bar dataKey="value" name="Count">
                  {findingsByRisk.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        riskLevelColors[
                          entry.name as keyof typeof riskLevelColors
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </Chart>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">
                    Annual Security Assessment Completed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Final report generated and distributed
                  </p>
                </div>
              </div>
              <Badge>2 hours ago</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">New High Risk Finding</p>
                  <p className="text-sm text-muted-foreground">
                    Access Control Policy Assessment
                  </p>
                </div>
              </div>
              <Badge variant="secondary">4 hours ago</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Vendor Assessment Started</p>
                  <p className="text-sm text-muted-foreground">
                    Cloud Service Provider Review
                  </p>
                </div>
              </div>
              <Badge variant="outline">1 day ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
