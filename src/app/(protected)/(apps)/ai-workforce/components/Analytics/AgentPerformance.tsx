import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Clock, Brain, Zap, Target, Award, Cpu, Network, GitBranch, Info } from 'lucide-react';
import type { Agent } from '../../types/agent';

interface AgentPerformanceProps {
  agent: Agent;
}

interface InfoModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

function InfoModal({ title, content, onClose }: InfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#1c1c1e] rounded-2xl border border-[#2c2c2e] p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white/90">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
          >
            ×
          </button>
        </div>
        <p className="text-white/80 whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
}

export function AgentPerformance({ agent }: AgentPerformanceProps) {
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  // Computation explanations
  const computationInfo = {
    domainExpertise: {
      title: "Domain Expertise Calculation",
      content: `Domain expertise is calculated using:

1. Base Score = (tasks_completed * 0.4) +
                (success_rate * 0.3) +
                (complexity_handled * 0.3)

2. Adjustment Factors:
   - Training completion: +10%
   - Peer reviews: ±5%
   - Error rate: -2% per error
   - Innovation bonus: +5% for new solutions

3. Final Score = Base Score * (1 + Σ Adjustments)`
    },
    taskCompletion: {
      title: "Task Completion Analysis",
      content: `Task completion metrics are computed as:

1. Completion Rate = (completed_tasks / total_tasks) * 100

2. Success Categories:
   - Completed: Task finished within SLA
   - Failed: Task errors or SLA breaches

3. Performance Score = 
   (completion_rate * 0.7) + (quality_score * 0.3)

Measured daily with 7-day rolling average.`
    },
    responseTime: {
      title: "Response Time Calculation",
      content: `Response time is measured using:

1. Base Response Time = 
   end_time - start_time - idle_periods

2. Normalized Score = 
   (target_time / actual_time) * 100

3. Adjustments:
   - Complexity factor: 1.0-2.0x
   - Priority multiplier: 0.8-1.2x
   - Load factor: 1.0-1.5x

Measured in seconds, averaged over 1-hour intervals.`
    }
  };

  // Sample hierarchical data for domain/subdomain/app relationships
  const hierarchyData = {
    name: 'Organization',
    children: [
      {
        name: 'Finance',
        size: 85,
        children: [
          { name: 'Investment Analysis', size: 90 },
          { name: 'Risk Management', size: 82 },
          { name: 'Trading Systems', size: 88 }
        ]
      },
      {
        name: 'Cybersecurity',
        size: 92,
        children: [
          { name: 'Threat Detection', size: 95 },
          { name: 'Network Security', size: 89 },
          { name: 'Incident Response', size: 91 }
        ]
      },
      {
        name: 'Database',
        size: 88,
        children: [
          { name: 'Query Optimization', size: 87 },
          { name: 'Data Modeling', size: 86 },
          { name: 'Performance Tuning', size: 90 }
        ]
      }
    ]
  };

  // Sample data for radar chart showing domain expertise
  const domainExpertiseData = [
    { subject: 'Finance', A: 85, fullMark: 100 },
    { subject: 'Security', A: 92, fullMark: 100 },
    { subject: 'Database', A: 88, fullMark: 100 },
    { subject: 'Analytics', A: 90, fullMark: 100 },
    { subject: 'Integration', A: 85, fullMark: 100 }
  ];

  // Sample data for app performance
  const appPerformanceData = [
    { name: 'System Monitor', value: 85 },
    { name: 'Security Suite', value: 92 },
    { name: 'Data Analytics', value: 78 },
    { name: 'Integration Hub', value: 88 }
  ];

  // Sample data for task completion trends
  const taskCompletionData = [
    { name: 'Mon', completed: 12, failed: 2 },
    { name: 'Tue', completed: 15, failed: 1 },
    { name: 'Wed', completed: 18, failed: 3 },
    { name: 'Thu', completed: 14, failed: 2 },
    { name: 'Fri', completed: 20, failed: 1 },
  ];

  // Sample data for response time trends
  const responseTimeData = [
    { name: '9AM', time: 1.2 },
    { name: '10AM', time: 0.8 },
    { name: '11AM', time: 1.5 },
    { name: '12PM', time: 1.1 },
    { name: '1PM', time: 0.9 },
  ];

  // Colors for charts
  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];

  // KPI metrics
  const metrics = [
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Domain Coverage',
      value: '92%',
      change: '+5%',
      positive: true
    },
    {
      icon: <Network className="w-5 h-5" />,
      label: 'Cross-Domain Synergy',
      value: '85%',
      change: '+3.2%',
      positive: true
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      label: 'Integration Rate',
      value: '88%',
      change: '+4.5%',
      positive: true
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      label: 'System Utilization',
      value: '78%',
      change: '+2.8%',
      positive: true
    }
  ];

  return (
    <div className="space-y-6">
      {infoModal && (
        <InfoModal
          title={infoModal.title}
          content={infoModal.content}
          onClose={() => setInfoModal(null)}
        />
      )}

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-[#2c2c2e] rounded-2xl p-4 border border-[#3c3c3e]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#3c3c3e] rounded-xl">
                {metric.icon}
              </div>
              <span className="text-sm text-white/60">{metric.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold text-white/90">{metric.value}</span>
              <span className={`text-sm ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Domain Expertise Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#2c2c2e] rounded-2xl p-6 border border-[#3c3c3e]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white/90">Domain Expertise Map</h3>
            <button
              onClick={() => setInfoModal(computationInfo.domainExpertise)}
              className="p-2 rounded-xl hover:bg-[#3c3c3e] text-white/60 hover:text-white/90 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={domainExpertiseData}>
                <PolarGrid stroke="#3c3c3e" />
                <PolarAngleAxis dataKey="subject" stroke="#ffffff99" />
                <PolarRadiusAxis stroke="#ffffff99" />
                <Radar
                  name="Expertise Level"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Rate */}
        <div className="bg-[#2c2c2e] rounded-2xl p-6 border border-[#3c3c3e]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white/90">Task Completion Rate</h3>
            <button
              onClick={() => setInfoModal(computationInfo.taskCompletion)}
              className="p-2 rounded-xl hover:bg-[#3c3c3e] text-white/60 hover:text-white/90 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3c3c3e" />
                <XAxis dataKey="name" stroke="#ffffff99" />
                <YAxis stroke="#ffffff99" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2c2c2e',
                    border: '1px solid #3c3c3e',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Response Time Trend */}
      <div className="bg-[#2c2c2e] rounded-2xl p-6 border border-[#3c3c3e]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white/90">Response Time Trend</h3>
          <button
            onClick={() => setInfoModal(computationInfo.responseTime)}
            className="p-2 rounded-xl hover:bg-[#3c3c3e] text-white/60 hover:text-white/90 transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3c3c3e" />
              <XAxis dataKey="name" stroke="#ffffff99" />
              <YAxis stroke="#ffffff99" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2c2c2e',
                  border: '1px solid #3c3c3e',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}