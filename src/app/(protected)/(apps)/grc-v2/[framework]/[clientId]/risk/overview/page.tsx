import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Progress } from "@/shadcn/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { BarChart4, PieChart, ShieldAlert, Timer } from "lucide-react";

export default function RiskOverviewPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Risk Overview</h1>
        <p className="text-muted-foreground mt-1">
          A high-level view of your organization's risk posture.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Risks</CardTitle>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">-1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risk Coverage</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <Progress value={67} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Remediation</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 days</div>
            <p className="text-xs text-muted-foreground">-3 days from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="categories">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Categories</CardTitle>
                <CardDescription>
                  Distribution of risks across different categories
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Information security operations</span>
                      <span className="text-sm text-muted-foreground">33%</span>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Operations security</span>
                      <span className="text-sm text-muted-foreground">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Asset management</span>
                      <span className="text-sm text-muted-foreground">17%</span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Communications security</span>
                      <span className="text-sm text-muted-foreground">17%</span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Other categories</span>
                      <span className="text-sm text-muted-foreground">8%</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Trends</CardTitle>
                <CardDescription>
                  Historical data showing risk patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Trend chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="status" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Status</CardTitle>
                <CardDescription>
                  Current status of identified risks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Status chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}