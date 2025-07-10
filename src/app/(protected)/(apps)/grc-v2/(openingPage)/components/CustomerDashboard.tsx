'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Badge } from '@/shadcn/ui/badge';
import { Progress } from '@/shadcn/ui/progress';
import { Shield, Server, AlertTriangle, CheckCircle, Clock, Wifi, HardDrive, Cpu, BarChart3 } from 'lucide-react';
import ComplianceProgressChart from './charts/ComplianceProgressChart';
import DeviceStatusChart from './charts/DeviceStatusChart';
import RiskTrendChart from './charts/RiskTrendChart';
import FrameworkComparisonChart from './charts/FrameworkComparisonChart';
import FrameworkOverview from './FrameworkOverview';
import { FrameworkMainContext } from './context/frameworkContext';
import { clientDetails, fetchAssetsData, filterFrameworksForClient } from '../page';
import AssetsDataTable from './assets/assetsDataTable';

export default function CustomerDashboard({ subscribedList, availableList, assetsData, allUsers, profileData }: any) {
  const [selectedFramework, setSelectedFramework] = useState('iso27001');
  const { userId, frameworks, subscribeData } = FrameworkMainContext();

  const [selectedClient, setSelectedClient] = useState(userId);
  const [currentSubscribed, setCurrentSubscribed] = useState(subscribedList);
  const [currentAvailable, setCurrentAvailable] = useState(availableList);
  const [currentAssetData, setCurrentAssetData] = useState(assetsData);

  useEffect(() => {
    setCurrentSubscribed(subscribedList);
    setCurrentAvailable(availableList);
  }, [subscribedList, availableList]);


  // This function is called when the dropdown value changes
  const handleClientChange = async (newClientId: string) => {
    if (!newClientId) return;

    console.log(`Switching view to client: ${newClientId}`);
    setSelectedClient(newClientId);

    // Use the imported utility with data from the context
    const { subscribedList, availableList } = filterFrameworksForClient(
      newClientId,
      frameworks,
      subscribeData
    );

    // Update the state, which will re-render the FrameworkOverview component
    setCurrentSubscribed(subscribedList);
    setCurrentAvailable(availableList);

    const assetData = await fetchAssetsData(newClientId);
    setCurrentAssetData(assetData);
  };

  const subscribedFrameworks = [
    { id: 'iso27001', name: 'ISO 27001', progress: 78, controls: 114, policies: 23, status: 'active' },
    { id: 'gdpr', name: 'GDPR', progress: 92, controls: 87, policies: 18, status: 'active' },
    { id: 'pci', name: 'PCI DSS', progress: 65, controls: 200, policies: 31, status: 'active' },
  ];

  const availableFrameworks = [
    { name: 'SOX', compliance: 34, description: 'Financial compliance framework' },
    { name: 'HIPAA', compliance: 12, description: 'Healthcare data protection' },
    { name: 'NIST', compliance: 45, description: 'Cybersecurity framework' },
  ];

  const devices = [
    { id: 1, name: 'Web Server 01', type: 'Server', status: 'online', uptime: 99.8, risk: 'low', lastSeen: '2 mins ago' },
    { id: 2, name: 'Database Cluster', type: 'Database', status: 'online', uptime: 99.9, risk: 'low', lastSeen: '1 min ago' },
    { id: 3, name: 'Firewall Gateway', type: 'Security', status: 'warning', uptime: 98.5, risk: 'medium', lastSeen: '5 mins ago' },
    { id: 4, name: 'Backup Storage', type: 'Storage', status: 'online', uptime: 99.7, risk: 'low', lastSeen: '3 mins ago' },
    { id: 5, name: 'Load Balancer', type: 'Network', status: 'critical', uptime: 95.2, risk: 'high', lastSeen: '15 mins ago' },
    { id: 6, name: 'Mail Server', type: 'Server', status: 'online', uptime: 99.6, risk: 'low', lastSeen: '1 min ago' },
  ];

  const recentAlerts = [
    { type: 'security', message: 'Suspicious login attempt detected', device: 'Web Server 01', time: '10 mins ago', severity: 'high' },
    { type: 'compliance', message: 'Control assessment due', framework: 'ISO 27001', time: '2 hours ago', severity: 'medium' },
    { type: 'device', message: 'High CPU usage detected', device: 'Database Cluster', time: '4 hours ago', severity: 'low' },
    { type: 'policy', message: 'Policy review required', framework: 'GDPR', time: '1 day ago', severity: 'medium' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <div className="w-3 h-3 bg-green-500 rounded-full status-indicator status-online" />;
      case 'warning': return <div className="w-3 h-3 bg-yellow-500 rounded-full status-indicator status-warning" />;
      case 'critical': return <div className="w-3 h-3 bg-red-500 rounded-full status-indicator status-critical" />;
      default: return <div className="w-3 h-3 bg-gray-500 rounded-full" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-600',
      medium: 'bg-yellow-600',
      high: 'bg-red-600',
    };
    return <Badge className={`${colors[risk as keyof typeof colors]} text-white`}>{risk.toUpperCase()}</Badge>;
  };

  const currentFramework = subscribedFrameworks.find(f => f.id === selectedFramework);

  return (
    <div className="space-y-8 h-full">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Subscriber's Dashboard</h2>
          <p className="text-gray-400">Monitor compliance progress, device health, and security posture</p>
        </div>
        {/* <div className="flex items-center space-x-4">
          <Select value={selectedFramework} onValueChange={setSelectedFramework}>
            <SelectTrigger className="w-48 bg-gray-900 border-gray-700">
              <SelectValue placeholder="Select Framework" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {subscribedFrameworks.map((framework) => (
                <SelectItem key={framework.id} value={framework.id}>
                  {framework.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        <div className="flex items-center space-x-4">
          <Select value={selectedClient} onValueChange={handleClientChange}>
            <SelectTrigger className="w-48 bg-gray-900 border-gray-700">
              <SelectValue placeholder="Select Client" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {clientDetails.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Overall Compliance</p>
                <p className="text-3xl font-bold text-white">78.3%</p>
                <p className="text-sm text-green-500">+5.2% this month</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Devices</p>
                <p className="text-3xl font-bold text-white">{devices.filter(d => d.status === 'online').length}</p>
                <p className="text-sm text-gray-400">of {devices.length} total</p>
              </div>
              <Server className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Risk Score</p>
                <p className="text-3xl font-bold text-white">Low</p>
                <p className="text-sm text-yellow-500">2 medium risks</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg. Uptime</p>
                <p className="text-3xl font-bold text-white">99.2%</p>
                <p className="text-sm text-green-500">SLA compliant</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-900/50 border-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="devices">Device Management</TabsTrigger>
          {/* <TabsTrigger value="frameworks">Framework Comparison</TabsTrigger> */}
          <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
        </TabsList>

        <div className='h-[45vh] overflow-y-auto'>
          <TabsContent value="overview">
            <FrameworkOverview
              clientId={selectedClient}
              subscribedList={currentSubscribed}
              availableList={currentAvailable}
            // userId={selectedClient} // Pass the currently selected client's ID
            />
          </TabsContent>

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

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Device Inventory</CardTitle>
              </CardHeader>
              <AssetsDataTable assetsData={currentAssetData} userIdNameMap={allUsers} profileData={profileData} currentSelectedClient={selectedClient} />
            </Card>
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