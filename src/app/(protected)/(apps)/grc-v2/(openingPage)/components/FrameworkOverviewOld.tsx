'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Badge } from '@/shadcn/ui/badge';
import { Progress } from '@/shadcn/ui/progress';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock, FileText, Users, Target } from 'lucide-react';
import ComplianceOverviewChart from './charts/ComplianceOverviewChart';
import RiskTrendChart from './charts/RiskTrendChart';

export default function FrameworkOverviewOld() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');

  const overallStats = [
    {
      title: 'Overall Compliance',
      value: '82.4%',
      change: '+4.2%',
      icon: Shield,
      color: 'text-green-500',
      description: 'Across all subscribed frameworks'
    },
    {
      title: 'Active Controls',
      value: '401',
      change: '+23',
      icon: CheckCircle,
      color: 'text-blue-500',
      description: 'Total implemented controls'
    },
    {
      title: 'Policy Coverage',
      value: '72',
      change: '+8',
      icon: FileText,
      color: 'text-purple-500',
      description: 'Active policies across frameworks'
    },
    {
      title: 'Risk Score',
      value: 'Medium',
      change: 'Improved',
      icon: AlertTriangle,
      color: 'text-yellow-500',
      description: 'Consolidated risk assessment'
    },
  ];

  const frameworkSummary = [
    {
      name: 'ISO 27001',
      progress: 78,
      controls: { total: 114, implemented: 89, inProgress: 15, pending: 10 },
      policies: { total: 23, active: 20, draft: 2, review: 1 },
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      status: 'active',
      riskLevel: 'low',
      compliance: 'good'
    },
    {
      name: 'GDPR',
      progress: 92,
      controls: { total: 87, implemented: 80, inProgress: 5, pending: 2 },
      policies: { total: 18, active: 17, draft: 1, review: 0 },
      lastAudit: '2024-02-01',
      nextAudit: '2024-08-01',
      status: 'active',
      riskLevel: 'low',
      compliance: 'excellent'
    },
    {
      name: 'PCI DSS',
      progress: 65,
      controls: { total: 200, implemented: 130, inProgress: 35, pending: 35 },
      policies: { total: 31, active: 22, draft: 6, review: 3 },
      lastAudit: '2023-12-10',
      nextAudit: '2024-06-10',
      status: 'active',
      riskLevel: 'medium',
      compliance: 'needs-attention'
    }
  ];

  const crossFrameworkInsights = [
    {
      title: 'Shared Controls',
      value: '156',
      description: 'Controls that apply to multiple frameworks',
      frameworks: ['ISO 27001', 'GDPR', 'PCI DSS'],
      efficiency: '89%'
    },
    {
      title: 'Policy Overlap',
      value: '34',
      description: 'Policies covering multiple framework requirements',
      frameworks: ['ISO 27001', 'GDPR'],
      efficiency: '76%'
    },
    {
      title: 'Common Gaps',
      value: '12',
      description: 'Areas needing attention across frameworks',
      frameworks: ['ISO 27001', 'PCI DSS'],
      efficiency: '45%'
    }
  ];

  const upcomingTasks = [
    {
      type: 'audit',
      framework: 'PCI DSS',
      task: 'Quarterly Security Assessment',
      dueDate: '2024-03-15',
      priority: 'high',
      assignee: 'Security Team'
    },
    {
      type: 'policy',
      framework: 'GDPR',
      task: 'Data Retention Policy Review',
      dueDate: '2024-03-20',
      priority: 'medium',
      assignee: 'Legal Team'
    },
    {
      type: 'control',
      framework: 'ISO 27001',
      task: 'Access Control Implementation',
      dueDate: '2024-03-25',
      priority: 'high',
      assignee: 'IT Team'
    },
    {
      type: 'training',
      framework: 'All Frameworks',
      task: 'Staff Security Awareness Training',
      dueDate: '2024-04-01',
      priority: 'medium',
      assignee: 'HR Team'
    }
  ];

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'needs-attention': return 'text-yellow-500';
      default: return 'text-gray-500';
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

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-blue-600',
      medium: 'bg-yellow-600',
      high: 'bg-red-600',
    };
    return <Badge className={`${colors[priority as keyof typeof colors]} text-white`}>{priority.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Framework Overview</h2>
        <p className="text-gray-400">Consolidated view of all subscribed frameworks and compliance status</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStats.map((stat, index) => (
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
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-800 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="bg-gray-900/50 border-gray-800">
          <TabsTrigger value="summary">Framework Summary</TabsTrigger>
          <TabsTrigger value="insights">Cross-Framework Insights</TabsTrigger>
          <TabsTrigger value="tasks">Upcoming Tasks</TabsTrigger>
          {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {frameworkSummary.map((framework, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{framework.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getRiskBadge(framework.riskLevel)}
                      <Badge className="bg-blue-600 text-white">Active</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Overall Progress</span>
                      <span className={`font-bold ${getComplianceColor(framework.compliance)}`}>
                        {framework.progress}%
                      </span>
                    </div>
                    <Progress value={framework.progress} className="w-full" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Controls</h4>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Implemented:</span>
                          <span className="text-green-400">{framework.controls.implemented}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>In Progress:</span>
                          <span className="text-yellow-400">{framework.controls.inProgress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending:</span>
                          <span className="text-red-400">{framework.controls.pending}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Policies</h4>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Active:</span>
                          <span className="text-green-400">{framework.policies.active}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Draft:</span>
                          <span className="text-yellow-400">{framework.policies.draft}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Review:</span>
                          <span className="text-blue-400">{framework.policies.review}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-800">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Last Audit:</span>
                      <span>{framework.lastAudit}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Next Audit:</span>
                      <span>{framework.nextAudit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {crossFrameworkInsights.map((insight, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 card-hover">
                <CardHeader>
                  <CardTitle className="text-white">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">{insight.value}</div>
                    <p className="text-sm text-gray-400">{insight.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Efficiency:</span>
                      <span className="text-white font-medium">{insight.efficiency}</span>
                    </div>
                    <Progress value={parseInt(insight.efficiency)} className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">Applicable Frameworks:</span>
                    <div className="flex flex-wrap gap-1">
                      {insight.frameworks.map((framework, idx) => (
                        <Badge key={idx} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Framework Synergy Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Control Overlap Matrix</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-gray-300">ISO 27001 ↔ GDPR</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={78} className="w-20" />
                        <span className="text-white text-sm">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-gray-300">ISO 27001 ↔ PCI DSS</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-20" />
                        <span className="text-white text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-gray-300">GDPR ↔ PCI DSS</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={42} className="w-20" />
                        <span className="text-white text-sm">42%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Optimization Opportunities</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-900/20 border border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-400 font-medium">High Synergy</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        ISO 27001 and GDPR share 78% of controls. Consider unified implementation approach.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-yellow-400 font-medium">Improvement Area</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        PCI DSS has unique requirements. Focus on payment-specific controls.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Tasks & Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      task.type === 'audit' ? 'bg-purple-600' :
                      task.type === 'policy' ? 'bg-blue-600' :
                      task.type === 'control' ? 'bg-green-600' : 'bg-orange-600'
                    }`}>
                      {task.type === 'audit' && <Shield className="h-4 w-4 text-white" />}
                      {task.type === 'policy' && <FileText className="h-4 w-4 text-white" />}
                      {task.type === 'control' && <CheckCircle className="h-4 w-4 text-white" />}
                      {task.type === 'training' && <Users className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{task.task}</p>
                          <p className="text-sm text-gray-400">
                            Framework: <span className="text-blue-400">{task.framework}</span> • 
                            Assigned to: <span className="text-green-400">{task.assignee}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          {getPriorityBadge(task.priority)}
                          <p className="text-sm text-gray-500 mt-1">{task.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Overall Compliance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ComplianceOverviewChart />
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
              <CardTitle className="text-white">Compliance Maturity Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-400 mb-2">3.2</div>
                  <p className="text-gray-400">Maturity Level</p>
                  <p className="text-sm text-gray-500">Out of 5.0</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-400 mb-2">89%</div>
                  <p className="text-gray-400">Process Automation</p>
                  <p className="text-sm text-gray-500">Automated controls</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-400 mb-2">156</div>
                  <p className="text-gray-400">Days to Compliance</p>
                  <p className="text-sm text-gray-500">Estimated timeline</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}