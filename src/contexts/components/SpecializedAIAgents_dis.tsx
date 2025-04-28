import { useState } from 'react';
import { Network, Server, Database, Code, Calendar, Play, Bot, Clock, AlertTriangle } from 'lucide-react';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  icon: typeof Network;
  expertise: string[];
  description: string;
}

interface ScanSchedule {
  id: string;
  agentId: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  nextRun: Date;
  lastRun?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

const agents: AIAgent[] = [
  {
    id: 'net-eng',
    name: 'NetGuard',
    role: 'Network Security Engineer',
    icon: Network,
    expertise: [
      'Network vulnerability assessment',
      'Firewall configuration',
      'IDS/IPS management',
      'Network segmentation',
      'Traffic analysis'
    ],
    description: 'Specializes in network security, focusing on infrastructure vulnerabilities and network-based threats.'
  },
  {
    id: 'win-admin',
    name: 'WinSecure',
    role: 'Windows System Administrator',
    icon: Server,
    expertise: [
      'Windows Server security',
      'Active Directory',
      'Group Policy',
      'Windows updates',
      'Endpoint protection'
    ],
    description: 'Expert in Windows system security, focusing on server hardening and endpoint protection.'
  },
  {
    id: 'linux-admin',
    name: 'LinuxGuard',
    role: 'Linux System Administrator',
    icon: Server,
    expertise: [
      'Linux system hardening',
      'SELinux/AppArmor',
      'Service security',
      'Access controls',
      'System auditing'
    ],
    description: 'Specializes in Linux system security, focusing on system hardening and security controls.'
  },
  {
    id: 'db-admin',
    name: 'DataGuard',
    role: 'Database Administrator',
    icon: Database,
    expertise: [
      'Database security',
      'Access control',
      'Data encryption',
      'Audit logging',
      'Backup security'
    ],
    description: 'Expert in database security, focusing on data protection and secure database configuration.'
  },
  {
    id: 'app-eng',
    name: 'AppSecure',
    role: 'Application Security Engineer',
    icon: Code,
    expertise: [
      'Application vulnerabilities',
      'Code security review',
      'API security',
      'Web security',
      'Security testing'
    ],
    description: 'Specializes in application security, focusing on code-level vulnerabilities and secure development.'
  }
];

export default function SpecializedAIAgents() {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [schedules, setSchedules] = useState<ScanSchedule[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    frequency: 'once' as const,
    nextRun: new Date()
  });

  const handleScheduleScan = (agentId: string) => {
    const schedule: ScanSchedule = {
      id: crypto.randomUUID(),
      agentId,
      frequency: newSchedule.frequency,
      nextRun: newSchedule.nextRun,
      status: 'pending'
    };

    setSchedules(prev => [...prev, schedule]);
    setShowScheduleForm(false);
    setNewSchedule({ frequency: 'once', nextRun: new Date() });
  };

  const handleStartScan = (agentId: string) => {
    const schedule: ScanSchedule = {
      id: crypto.randomUUID(),
      agentId,
      frequency: 'once',
      nextRun: new Date(),
      status: 'running'
    };

    setSchedules(prev => [...prev, schedule]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="bg-background  rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <agent.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(agent)}
                className="text-primary hover:text-primary/80"
              >
                <Bot className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Expertise:</h4>
              <ul className="mt-2 space-y-1">
                {agent.expertise.map((skill, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => handleStartScan(agent.id)}
                className="flex-1 btn-primary"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Scan
              </button>
              <button
                onClick={() => {
                  setSelectedAgent(agent);
                  setShowScheduleForm(true);
                }}
                className="flex-1 btn-secondary"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Scans */}
      {schedules.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Active & Scheduled Scans</h2>
          <div className="bg-white shadow-sm rounded-lg divide-y">
            {schedules.map(schedule => {
              const agent = agents.find(a => a.id === schedule.agentId);
              if (!agent) return null;

              return (
                <div key={schedule.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      schedule.status === 'running' ? 'bg-blue-50' :
                      schedule.status === 'completed' ? 'bg-green-50' :
                      schedule.status === 'failed' ? 'bg-red-50' :
                      'bg-gray-50'
                    }`}>
                      <agent.icon className={`h-5 w-5 ${
                        schedule.status === 'running' ? 'text-blue-600' :
                        schedule.status === 'completed' ? 'text-green-600' :
                        schedule.status === 'failed' ? 'text-red-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {agent.name} - {schedule.frequency} scan
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Next run: {schedule.nextRun.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    schedule.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                    schedule.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {schedule.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && selectedAgent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Schedule Scan with {selectedAgent.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule(prev => ({
                    ...prev,
                    frequency: e.target.value as ScanSchedule['frequency']
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Next Run
                </label>
                <input
                  type="datetime-local"
                  value={newSchedule.nextRun.toISOString().slice(0, 16)}
                  onChange={(e) => setNewSchedule(prev => ({
                    ...prev,
                    nextRun: new Date(e.target.value)
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleScheduleScan(selectedAgent.id)}
                className="btn-primary"
              >
                Schedule Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Details Modal */}
      {selectedAgent && !showScheduleForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <selectedAgent.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedAgent.name}</h3>
                  <p className="text-sm text-gray-500">{selectedAgent.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <AlertTriangle className="h-5 w-5" />
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              <p>{selectedAgent.description}</p>
              <h4>Key Capabilities:</h4>
              <ul>
                {selectedAgent.expertise.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedAgent(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => handleStartScan(selectedAgent.id)}
                className="btn-primary"
              >
                Start Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}