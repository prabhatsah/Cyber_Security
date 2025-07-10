import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { BarChart, FileText, PieChart, Download, ArrowRight } from "lucide-react";
import { Progress } from "@/shadcn/ui/progress";

export default function ReportsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and generate reports about your security and compliance status.
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Risk Assessment</CardTitle>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">Overall risk coverage</p>
                  <Progress value={78} className="mt-2" />
                </div>
                <Button variant="link" className="mt-4 px-0">
                  View details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Compliance Status</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">Controls implemented</p>
                  <Progress value={92} className="mt-2" />
                </div>
                <Button variant="link" className="mt-4 px-0">
                  View details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Security Metrics</CardTitle>
                <BarChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs text-muted-foreground">Security score</p>
                  <Progress value={95} className="mt-2" />
                </div>
                <Button variant="link" className="mt-4 px-0">
                  View details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
              <CardDescription>Detailed breakdown of risk assessment data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">High Risk Items</span>
                    <span className="text-sm text-muted-foreground">4 items</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Medium Risk Items</span>
                    <span className="text-sm text-muted-foreground">8 items</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Low Risk Items</span>
                    <span className="text-sm text-muted-foreground">12 items</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>Status of compliance requirements</CardDescription>
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
                    <span className="text-sm text-muted-foreground">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">GDPR</span>
                    <span className="text-sm text-muted-foreground">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Metrics</CardTitle>
              <CardDescription>Key security performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Vulnerability Management</span>
                    <span className="text-sm text-muted-foreground">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Access Control</span>
                    <span className="text-sm text-muted-foreground">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Incident Response</span>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}