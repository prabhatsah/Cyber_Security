import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Progress } from "@/shadcn/ui/progress";
import { Button } from "@/shadcn/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { ArrowRight, BarChart, FileText, ShieldAlert, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your risk and compliance status
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <Progress value={78} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Controls</CardTitle>
            <ShieldAlert className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">12 added this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground mt-1">5 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Progress value={92} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">SOC 2 Type II Ready</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
            <CardDescription>Distribution of risks by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">High Risk</span>
                  <span className="text-sm text-muted-foreground">12</span>
                </div>
                <Progress value={24} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Medium Risk</span>
                  <span className="text-sm text-muted-foreground">24</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Low Risk</span>
                  <span className="text-sm text-muted-foreground">14</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
            </div>
            <Button variant="link" className="mt-4 px-0">
              View risk register <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Progress</CardTitle>
            <CardDescription>Framework implementation status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">SOC 2</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">ISO 27001</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">GDPR</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
            <Button variant="link" className="mt-4 px-0">
              View all frameworks <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates and changes</CardDescription>
              </div>
              <Button variant="outline">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Risk Assessment Updated",
                  description: "Information security risk assessment completed",
                  timestamp: "2 hours ago",
                  icon: <BarChart className="h-4 w-4" />,
                },
                {
                  title: "New Control Added",
                  description: "Access control policy implemented",
                  timestamp: "5 hours ago",
                  icon: <ShieldAlert className="h-4 w-4" />,
                },
                {
                  title: "Compliance Update",
                  description: "SOC 2 Type II documentation updated",
                  timestamp: "1 day ago",
                  icon: <FileText className="h-4 w-4" />,
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 rounded-md border p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    {activity.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}