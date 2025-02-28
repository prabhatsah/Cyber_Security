import { useState } from 'react';
import { Shield, Bot, Brain, Target, Network, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface ComplianceAgent {
  id: string;
  name: string;
  framework: string;
  expertise: string[];
  description: string;
  capabilities: string[];
}

const complianceAgents: ComplianceAgent[] = [
  {
    id: 'owasp-agent',
    name: 'OWASP Guardian',
    framework: 'OWASP Top 10',
    expertise: [
      'Web Application Security',
      'API Security',
      'Input Validation',
      'Authentication',
      'Access Control'
    ],
    description: 'Specialized in web application security assessment following OWASP guidelines',
    capabilities: [
      'Automated vulnerability scanning',
      'Security control validation',
      'Configuration review',
      'Code analysis',
      'Security best practices assessment'
    ]
  },
  {
    id: 'hipaa-agent',
    name: 'HIPAA Sentinel',
    framework: 'HIPAA',
    expertise: [
      'Healthcare Data Security',
      'Privacy Controls',
      'Access Management',
      'Audit Logging',
      'Data Encryption'
    ],
    description: 'Expert in healthcare data protection and HIPAA compliance requirements',
    capabilities: [
      'PHI data flow analysis',
      'Access control assessment',
      'Encryption validation',
      'Audit trail review',
      'Privacy impact assessment'
    ]
  },
  {
    id: 'gdpr-agent',
    name: 'GDPR Guardian',
    framework: 'GDPR',
    expertise: [
      'Data Protection',
      'Privacy Rights',
      'Consent Management',
      'Data Processing',
      'International Transfers'
    ],
    description: 'Focused on European data protection and privacy compliance',
    capabilities: [
      'Data protection assessment',
      'Privacy control validation',
      'Cross-border transfer analysis',
      'Consent mechanism review',
      'DPIA assistance'
    ]
  },
  {
    id: 'pci-agent',
    name: 'PCI Sentinel',
    framework: 'PCI DSS',
    expertise: [
      'Payment Card Security',
      'Network Security',
      'Data Protection',
      'Access Control',
      'Security Testing'
    ],
    description: 'Specialized in payment card industry security standards',
    capabilities: [
      'Cardholder data environment assessment',
      'Network security validation',
      'Encryption control review',
      'Access control verification',
      'Security testing coordination'
    ]
  },
  {
    id: 'iso-agent',
    name: 'ISO Guardian',
    framework: 'ISO 27001',
    expertise: [
      'Information Security',
      'Risk Management',
      'Security Controls',
      'Asset Management',
      'Operational Security'
    ],
    description: 'Expert in ISO 27001 information security management systems',
    capabilities: [
      'ISMS assessment',
      'Control effectiveness review',
      'Risk assessment support',
      'Security policy review',
      'Operational security validation'
    ]
  }
];

interface AgentScanConfig {
  ipRange: {
    start: string;
    end: string;
  };
  scanDepth: 'basic' | 'comprehensive' | 'deep';
  automated: boolean;
  schedule?: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    nextRun: Date;
  };
}

export default function ComplianceAIAgents() {
  const [selectedAgent, setSelectedAgent] = useState<ComplianceAgent | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [scanConfig, setScanConfig] = useState<AgentScanConfig>({
    ipRange: { start: '', end: '' },
    scanDepth: 'comprehensive',
    automated: true
  });

  const validateIpAddress = (ip: string): boolean => {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const handleStartScan = () => {
    if (!validateIpAddress(scanConfig.ipRange.start) || !validateIpAddress(scanConfig.ipRange.end)) {
      alert('Please enter valid IP addresses');
      return;
    }
    
    // Here you would typically:
    // 1. Validate the IP range
    // 2. Initialize the AI agent
    // 3. Start the compliance scan
    // 4. Monitor progress
    console.log('Starting scan with config:', scanConfig);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complianceAgents.map(agent => (
          <div key={agent.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.framework}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedAgent(agent);
                  setShowConfig(true);
                }}
                className="text-primary hover:text-primary/80"
              >
                <Brain className="h-5 w-5" />
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

            <div className="mt-4">
              <p className="text-sm text-gray-600">{agent.description}</p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setSelectedAgent(agent);
                  setShowConfig(true);
                }}
                className="w-full btn-primary"
              >
                <Shield className="h-4 w-4 mr-2" />
                Configure Scan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scan Configuration Modal */}
      {showConfig && selectedAgent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <Bot className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Configure {selectedAgent.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedAgent.framework} Compliance Scan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <AlertTriangle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* IP Range Configuration */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Target IP Range</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">Start IP</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Network className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={scanConfig.ipRange.start}
                        onChange={(e) => setScanConfig(prev => ({
                          ...prev,
                          ipRange: { ...prev.ipRange, start: e.target.value }
                        }))}
                        className="form-input pl-9"
                        placeholder="192.168.1.1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">End IP</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Target className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={scanConfig.ipRange.end}
                        onChange={(e) => setScanConfig(prev => ({
                          ...prev,
                          ipRange: { ...prev.ipRange, end: e.target.value }
                        }))}
                        className="form-input pl-9"
                        placeholder="192.168.1.255"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan Depth */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Scan Depth</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(['basic', 'comprehensive', 'deep'] as const).map((depth) => (
                    <button
                      key={depth}
                      onClick={() => setScanConfig(prev => ({ ...prev, scanDepth: depth }))}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        scanConfig.scanDepth === depth
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/30'
                      }`}
                    >
                      <span className="text-sm font-medium capitalize">{depth}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Automation Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Automation</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="automated"
                    checked={scanConfig.automated}
                    onChange={(e) => setScanConfig(prev => ({
                      ...prev,
                      automated: e.target.checked
                    }))}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="automated" className="text-sm text-gray-700">
                    Enable automated remediation suggestions
                  </label>
                </div>
              </div>

              {/* Schedule Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Schedule</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">Frequency</label>
                    <select
                      value={scanConfig.schedule?.frequency || 'once'}
                      onChange={(e) => setScanConfig(prev => ({
                        ...prev,
                        schedule: {
                          frequency: e.target.value as AgentScanConfig['schedule']['frequency'],
                          nextRun: prev.schedule?.nextRun || new Date()
                        }
                      }))}
                      className="form-input mt-1"
                    >
                      <option value="once">Once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Next Run</label>
                    <input
                      type="datetime-local"
                      value={scanConfig.schedule?.nextRun?.toISOString().slice(0, 16) || ''}
                      onChange={(e) => setScanConfig(prev => ({
                        ...prev,
                        schedule: {
                          frequency: prev.schedule?.frequency || 'once',
                          nextRun: new Date(e.target.value)
                        }
                      }))}
                      className="form-input mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Agent Capabilities */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Agent Capabilities</h4>
                <ul className="space-y-2">
                  {selectedAgent.capabilities.map((capability, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfig(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartScan}
                  className="btn-primary"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Start Compliance Scan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}