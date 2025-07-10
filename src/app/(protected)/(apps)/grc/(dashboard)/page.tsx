import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Overview } from "../components/dashboard/overview"
import { RecentAudits } from "../components/dashboard/recent-audits"
import { Badge } from "@/shadcn/ui/badge"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Chart } from "../components/ui/chart"
import { LineChart, Line, BarChart, Bar, Cell } from "recharts"
import { chartColors, statusColors, riskLevelColors } from "../lib/chart-theme"
import { Compliance } from "../components/dashboard/compliance-trend"
import { RiskDistribution } from "../components/dashboard/risk-distribution"
import { createUserMap, fetchAuditsData } from "../components/dashboard/dataFetch"

const complianceData = [
  { month: "Jan", rate: 82 },
  { month: "Feb", rate: 85 },
  { month: "Mar", rate: 88 },
  { month: "Apr", rate: 85 },
  { month: "May", rate: 90 },
  { month: "Jun", rate: 92 }
]

const riskData = [
  { name: "High", count: 5, color: riskLevelColors.High },
  { name: "Medium", count: 12, color: riskLevelColors.Medium },
  { name: "Low", count: 8, color: riskLevelColors.Low }
]



export default async function DashboardPage() {
  const auditsData = await fetchAuditsData();
  const userIdNameMap: { value: string, label: string }[] = await createUserMap();
  return (
    <div className="h-full overflow-y-auto flex flex-col gap-3">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">5%</span>
              <span className="ml-1">from last quarter</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">-3</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Medium</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">Improved</span>
              <span className="ml-1">from High</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">2%</span>
              <span className="ml-1">this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
          <Chart height={350}>
            <Overview />
          </Chart>  
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentAudits auditData = {auditsData} userIdNameMap={userIdNameMap}/>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Rate Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart height={350}>
              {/* <LineChart data={complianceData}>
                <Chart.Grid />
                <Chart.XAxis dataKey="month" />
                <Chart.YAxis domain={[0, 100]} />
                <Chart.Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke={chartColors.primary}
                  strokeWidth={2}
                />
              </LineChart> */}
              <Compliance />
            </Chart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart height={350}>
              {/* <BarChart data={riskData}>
                <Chart.Grid />
                <Chart.XAxis dataKey="name" />
                <Chart.YAxis />
                <Chart.Tooltip />
                <Bar dataKey="count" name="Count">
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart> */}
              <RiskDistribution />
            </Chart>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}