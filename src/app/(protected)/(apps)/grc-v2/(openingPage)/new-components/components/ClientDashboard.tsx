'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { DollarSign, Users, Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import SalesChart from './charts/SalesChart';
import ComplianceOverviewChart from './charts/ComplianceOverviewChart';
import FrameworkRevenueChart from './charts/FrameworkRevenueChart';
import CustomerGrowthChart from './charts/CustomerGrowthChart';
import { Button } from '@/shadcn/ui/button';
import { redirect } from 'next/navigation';

export default function ClientDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const stats = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Active Customers',
      value: '1,247',
      change: '+8.2%',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Framework Subscriptions',
      value: '3,891',
      change: '+15.7%',
      icon: Shield,
      color: 'text-purple-500',
    },
    {
      title: 'Avg. Compliance Score',
      value: '87.3%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-yellow-500',
    },
  ];

  const frameworks = [
    { name: 'ISO 27001', subscribers: 423, revenue: '$487K', compliance: 89 },
    { name: 'PCI DSS', subscribers: 312, revenue: '$356K', compliance: 92 },
    { name: 'GDPR', subscribers: 567, revenue: '$623K', compliance: 85 },
    { name: 'SOX', subscribers: 234, revenue: '$289K', compliance: 91 },
    { name: 'HIPAA', subscribers: 189, revenue: '$234K', compliance: 88 },
    { name: 'NIST', subscribers: 145, revenue: '$187K', compliance: 86 },
  ];

  const recentActivity = [
    { type: 'subscription', customer: 'ABC Corp', framework: 'ISO 27001', time: '2 hours ago' },
    { type: 'compliance', customer: 'QER Inc', framework: 'GDPR', score: 94, time: '4 hours ago' },
    { type: 'renewal', customer: 'Global Systems', framework: 'PCI DSS', time: '6 hours ago' },
    { type: 'alert', customer: 'XYZ Ltd', framework: 'SOX', issue: 'Control gap detected', time: '8 hours ago' },
  ];

  return (
    <div className="space-y-8 h-full">
      <div className='flex flex-row justify-between'>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Global Admin Dashboard</h2>
          <p className="text-gray-400">Monitor framework sales, customer compliance, and platform performance</p>
        </div>
        <Button
          onClick={() => {
            redirect('grc-v2/outer-configurator/frameworks');
          }
          }
        >
          Configurator
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-800 card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-800 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="bg-gray-900/50 border-gray-800">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <div className='h-[45vh] overflow-y-auto'>
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <SalesChart />
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Customer Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomerGrowthChart />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Framework Revenue Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <FrameworkRevenueChart />
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Global Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComplianceOverviewChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="frameworks" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Framework Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-gray-400 font-medium py-3">Framework</th>
                        <th className="text-left text-gray-400 font-medium py-3">Subscribers</th>
                        <th className="text-left text-gray-400 font-medium py-3">Revenue</th>
                        <th className="text-left text-gray-400 font-medium py-3">Avg. Compliance</th>
                        <th className="text-left text-gray-400 font-medium py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {frameworks.map((framework, index) => (
                        <tr key={index} className="border-b border-gray-800/50">
                          <td className="py-4">
                            <div className="font-medium text-white">{framework.name}</div>
                          </td>
                          <td className="py-4 text-gray-300">{framework.subscribers}</td>
                          <td className="py-4 text-gray-300">{framework.revenue}</td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-2 bg-gray-700 rounded-full">
                                <div
                                  className="h-2 bg-green-500 rounded-full"
                                  style={{ width: `${framework.compliance}%` }}
                                />
                              </div>
                              <span className="text-gray-300 text-sm">{framework.compliance}%</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-green-500 text-sm">Active</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg">
                      <div className={`p-2 rounded-full ${activity.type === 'subscription' ? 'bg-blue-600' :
                        activity.type === 'compliance' ? 'bg-green-600' :
                          activity.type === 'renewal' ? 'bg-purple-600' : 'bg-red-600'
                        }`}>
                        {activity.type === 'subscription' && <Users className="h-4 w-4 text-white" />}
                        {activity.type === 'compliance' && <CheckCircle className="h-4 w-4 text-white" />}
                        {activity.type === 'renewal' && <Shield className="h-4 w-4 text-white" />}
                        {activity.type === 'alert' && <AlertTriangle className="h-4 w-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">
                              {activity.customer}
                              {activity.type === 'subscription' && ' subscribed to '}
                              {activity.type === 'compliance' && ' achieved '}
                              {activity.type === 'renewal' && ' renewed '}
                              {activity.type === 'alert' && ' has an issue with '}
                              <span className="text-blue-400">{activity.framework}</span>
                            </p>
                            {activity.type === 'compliance' && (
                              <p className="text-sm text-gray-400">Compliance score: {activity.score}%</p>
                            )}
                            {activity.type === 'alert' && (
                              <p className="text-sm text-red-400">{activity.issue}</p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
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