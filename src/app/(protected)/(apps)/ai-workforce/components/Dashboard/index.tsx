import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap, AreaChart, Area } from 'recharts';
import { Award, Cpu, Network, GitBranch, Users, Brain, Zap, Target, Clock, Info, Bot, Sparkles } from 'lucide-react';
import type { Agent } from '../../types/agent';

interface DashboardProps {
  agents?: Agent[];
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

export function Dashboard({ agents = [] }: DashboardProps) {
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  // Calculate metrics using useMemo to prevent unnecessary recalculations
  const agentMetrics = useMemo(() => ({
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    idleAgents: agents.filter(a => a.status === 'idle').length,
    busyAgents: agents.filter(a => a.status === 'busy').length
  }), [agents]);

  // Generate domain data from agents using useMemo
  const domainData = useMemo(() => {
    const domains = new Map<string, { name: string; size: number }>();
    
    agents.forEach(agent => {
      const domain = domains.get(agent.domainId) || { name: agent.domainId, size: 0 };
      domain.size += 1;
      domains.set(agent.domainId, domain);
    });
    
    return Array.from(domains.values());
  }, [agents]);

  // Performance trends data
  const performanceTrends = useMemo(() => [
    { name: '1H', efficiency: 85, reliability: 90, availability: 95 },
    { name: '6H', efficiency: 88, reliability: 92, availability: 96 },
    { name: '12H', efficiency: 86, reliability: 91, availability: 94 },
    { name: '24H', efficiency: 89, reliability: 93, availability: 97 },
    { name: '48H', efficiency: 87, reliability: 94, availability: 95 }
  ], []);

  // Agent distribution data
  const agentDistribution = useMemo(() => 
    domainData.map(domain => ({
      name: domain.name || 'Unknown',
      value: domain.size
    }))
  , [domainData]);

  // System-wide KPIs using useMemo
  const systemKPIs = useMemo(() => [
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Active Agents',
      value: agentMetrics.activeAgents.toString(),
      change: '+12',
      positive: true
    },
    {
      icon: <Brain className="w-5 h-5" />,
      label: 'Total Agents',
      value: agentMetrics.totalAgents.toString(),
      change: '+5',
      positive: true
    },
    {
      icon: <Network className="w-5 h-5" />,
      label: 'Idle Agents',
      value: agentMetrics.idleAgents.toString(),
      change: '-2',
      positive: true
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Busy Agents',
      value: agentMetrics.busyAgents.toString(),
      change: '+3',
      positive: false
    }
  ], [agentMetrics]);

  // Colors for charts
  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1c1c1e] rounded-3xl border border-[#2c2c2e] p-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <div className="relative">
                <Bot className="w-8 h-8 text-white" />
                <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              AI Agent Dashboard
            </h1>
            <p className="text-white/60">Real-time monitoring and analytics</p>
          </div>
        </div>
      </div>

      {infoModal && (
        <InfoModal
          title={infoModal.title}
          content={infoModal.content}
          onClose={() => setInfoModal(null)}
        />
      )}

      {/* System KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemKPIs.map((kpi, index) => (
          <div
            key={index}
            className="bg-[#2c2c2e] rounded-2xl p-4 border border-[#3c3c3e]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#3c3c3e] rounded-xl">
                {kpi.icon}
              </div>
              <span className="text-sm text-white/60">{kpi.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold text-white/90">{kpi.value}</span>
              <span className={`text-sm ${kpi.positive ? 'text-green-400' : 'text-red-400'}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <div className="bg-[#2c2c2e] rounded-2xl p-6 border border-[#3c3c3e]">
          <h3 className="text-lg font-medium text-white/90 mb-4">Performance Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends}>
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
                <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="reliability" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="availability" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Distribution */}
        <div className="bg-[#2c2c2e] rounded-2xl p-6 border border-[#3c3c3e]">
          <h3 className="text-lg font-medium text-white/90 mb-4">Agent Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agentDistribution}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {agentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2c2c2e',
                    border: '1px solid #3c3c3e',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}