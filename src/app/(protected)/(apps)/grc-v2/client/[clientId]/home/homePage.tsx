'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Badge } from '@/shadcn/ui/badge';
import { Progress } from '@/shadcn/ui/progress';
import {
  Shield,
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Server,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import ComplianceProgressChart from '../../../(openingPage)/new-components/components/charts/ComplianceProgressChart';
import DeviceStatusChart from '../../../(openingPage)/new-components/components/charts/DeviceStatusChart';
import RiskTrendChart from '../../../(openingPage)/new-components/components/charts/RiskTrendChart';
import FrameworkComparisonChart from '../../../(openingPage)/new-components/components/charts/FrameworkComparisonChart';

type UserRole = 'global_admin' | 'customer';

interface DashboardProps {
  userRole: UserRole;
}

export default function Home({ userRole }: DashboardProps) {
  // { params }: { params: { clientId: string } }

  const selectedFramework = 'iso27001'; // This would typically come from route params or state

   const subscribedFrameworks = [
    { id: 'iso27001', name: 'ISO 27001', progress: 78, controls: 114, policies: 23, status: 'active' },
    { id: 'gdpr', name: 'GDPR', progress: 92, controls: 87, policies: 18, status: 'active' },
    { id: 'pci', name: 'PCI DSS', progress: 65, controls: 200, policies: 31, status: 'active' },
  ];
  const recentAlerts = [
    { type: 'security', message: 'Suspicious login attempt detected', device: 'Web Server 01', time: '10 mins ago', severity: 'high' },
    { type: 'compliance', message: 'Control assessment due', framework: 'ISO 27001', time: '2 hours ago', severity: 'medium' },
    { type: 'device', message: 'High CPU usage detected', device: 'Database Cluster', time: '4 hours ago', severity: 'low' },
    { type: 'policy', message: 'Policy review required', framework: 'GDPR', time: '1 day ago', severity: 'medium' },
  ];
  const availableFrameworks = [
    { name: 'SOX', compliance: 34, description: 'Financial compliance framework' },
    { name: 'HIPAA', compliance: 12, description: 'Healthcare data protection' },
    { name: 'NIST', compliance: 45, description: 'Cybersecurity framework' },
  ];
  const currentFramework = subscribedFrameworks.find(f => f.id === selectedFramework);

  if (userRole === 'global_admin') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Dashboard</h1>
          <p className="">Monitor framework sales, customer activity, and global compliance metrics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Building2 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs">
                <span className="text-emerald-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Framework Sales</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs">
                <span className="text-emerald-600">+20.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Frameworks</CardTitle>
              <Shield className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs ">
                <span className="text-blue-600">+2</span> new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84.2%</div>
              <p className="text-xs">
                <span className="text-emerald-600">+2.4%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Popular Frameworks</CardTitle>
              <CardDescription>Most subscribed frameworks this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'ISO 27001', subscriptions: 89, growth: '+15%' },
                { name: 'SOC 2 Type II', subscriptions: 67, growth: '+8%' },
                { name: 'GDPR Compliance', subscriptions: 54, growth: '+22%' },
                { name: 'HIPAA', subscriptions: 43, growth: '+12%' },
              ].map((framework) => (
                <div key={framework.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{framework.name}</p>
                    <p className="text-sm">{framework.subscriptions} subscriptions</p>
                  </div>
                  <Badge variant="secondary" className="text-emerald-600">
                    {framework.growth}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Customer Activity</CardTitle>
              <CardDescription>Latest customer actions and subscriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { customer: 'TechCorp Inc.', action: 'Subscribed to ISO 27001', time: '2 hours ago' },
                { customer: 'HealthSystem LLC', action: 'Completed HIPAA audit', time: '4 hours ago' },
                { customer: 'FinanceGlobal', action: 'Updated risk register', time: '6 hours ago' },
                { customer: 'RetailChain', action: 'Subscribed to SOC 2', time: '1 day ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.customer}</p>
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto p-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="">Overview of your compliance posture and audit status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Frameworks</CardTitle>
            <Shield className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs">ISO 27001, SOC 2, GDPR</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Audits</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">5</div>
            <p className="text-xs">2 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
            <AlertTriangle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">87%</div>
            <p className="text-xs">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Framework Compliance</CardTitle>
            <CardDescription>Current compliance scores by framework</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'ISO 27001', score: 92, color: 'bg-emerald-500' },
              { name: 'SOC 2 Type II', score: 85, color: 'bg-blue-500' },
              { name: 'GDPR', score: 78, color: 'bg-amber-500' },
            ].map((framework) => (
              <div key={framework.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{framework.name}</span>
                  <span className="">{framework.score}%</span>
                </div>
                <Progress value={framework.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest audit and compliance activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: 'Completed Access Control Audit', framework: 'ISO 27001', time: '2 hours ago', status: 'completed' },
              { action: 'Updated Risk Assessment', framework: 'SOC 2', time: '1 day ago', status: 'completed' },
              { action: 'Data Processing Audit', framework: 'GDPR', time: '2 days ago', status: 'pending' },
              { action: 'Security Policy Review', framework: 'ISO 27001', time: '3 days ago', status: 'completed' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm">{activity.framework}</p>
                  <p className="text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compliance" className="space-y-6">
        <TabsList className="bg-gray-900/50 border-gray-800">
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="devices">Device Management</TabsTrigger>
          {/* <TabsTrigger value="frameworks">Framework Comparison</TabsTrigger> */}
          <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
        </TabsList>

        <div className='lg:w-auto'>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Compliance Progress - {currentFramework?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComplianceProgressChart />
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Framework Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentFramework && (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Overall Progress</span>
                          <span className="text-white font-bold">{currentFramework.progress}%</span>
                        </div>
                        <Progress value={currentFramework.progress} className="w-full" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Controls</span>
                          <span className="text-white">{currentFramework.controls}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Policies</span>
                          <span className="text-white">{currentFramework.policies}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Subscribed Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscribedFrameworks.map((framework) => (
                    <div key={framework.id} className="p-6 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">{framework.name}</h3>
                        <Badge className="bg-blue-600 text-white">Active</Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{framework.progress}%</span>
                          </div>
                          <Progress value={framework.progress} className="w-full" />
                        </div>
                        <div className="text-sm text-gray-400">
                          {framework.controls} controls • {framework.policies} policies
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Device Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <DeviceStatusChart />
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Risk Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <RiskTrendChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="frameworks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Framework Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <FrameworkComparisonChart />
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Available Frameworks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableFrameworks.map((framework, index) => (
                    <div key={index} className="p-4 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{framework.name}</h3>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {framework.compliance}% ready
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{framework.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current compliance readiness</span>
                        <span className="text-white">{framework.compliance}%</span>
                      </div>
                      <Progress value={framework.compliance} className="w-full mt-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Alerts & Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg">
                      <div className={`p-2 rounded-full ${alert.severity === 'high' ? 'bg-red-600' :
                        alert.severity === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                        }`}>
                        {alert.type === 'security' && <Shield className="h-4 w-4 text-white" />}
                        {alert.type === 'compliance' && <CheckCircle className="h-4 w-4 text-white" />}
                        {alert.type === 'device' && <Server className="h-4 w-4 text-white" />}
                        {alert.type === 'policy' && <Clock className="h-4 w-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{alert.message}</p>
                            <p className="text-sm text-gray-400">
                              {alert.device && `Device: ${alert.device}`}
                              {alert.framework && `Framework: ${alert.framework}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${alert.severity === 'high' ? 'bg-red-600' :
                              alert.severity === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                              } text-white mb-1`}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <p className="text-sm text-gray-500">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

    </div>
  );
}