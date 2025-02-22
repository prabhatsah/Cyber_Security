import { useState } from 'react';
import { Shield, XCircle, Loader2, CheckCircle2, AlertTriangle, AlertOctagon, Book, List } from 'lucide-react';
import ComplianceAIAgents from './ComplianceAIAgents_dis';

interface ComplianceScanModalProps {
  onClose: () => void;
  onScanComplete: (result: ComplianceScanResult) => void;
}

export interface ComplianceScanResult {
  framework: string;
  controls: ComplianceControl[];
  summary: {
    total: number;
    compliant: number;
    nonCompliant: number;
    partial: number;
    notApplicable: number;
  };
  metadata: {
    scanDate: Date;
    framework_version: string;
    scope: string[];
  };
}

interface ComplianceControl {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
  severity: 'critical' | 'high' | 'medium' | 'low';
  findings: string[];
  remediation?: string;
  references: string[];
}

const complianceFrameworks = {
  owasp: {
    name: 'OWASP Top 10',
    version: '2021',
    description: 'Web application security risks and controls',
    categories: [
      'Broken Access Control',
      'Cryptographic Failures',
      'Injection',
      'Insecure Design',
      'Security Misconfiguration',
      'Vulnerable Components',
      'Authentication Failures',
      'Data Integrity Failures',
      'Logging Failures',
      'Server-Side Request Forgery'
    ]
  },
  hipaa: {
    name: 'HIPAA Security Rule',
    version: '2023',
    description: 'Healthcare data security and privacy controls',
    categories: [
      'Administrative Safeguards',
      'Physical Safeguards',
      'Technical Safeguards',
      'Organizational Requirements',
      'Policies and Procedures'
    ]
  },
  gdpr: {
    name: 'GDPR',
    version: '2018',
    description: 'Data protection and privacy requirements',
    categories: [
      'Data Protection Principles',
      'Data Subject Rights',
      'Privacy by Design',
      'Security of Processing',
      'Data Breach Notification',
      'Impact Assessments',
      'Records of Processing'
    ]
  },
  pci: {
    name: 'PCI DSS',
    version: '4.0',
    description: 'Payment card data security standard',
    categories: [
      'Network Security',
      'Data Protection',
      'Access Control',
      'Monitoring and Testing',
      'Information Security',
      'Secure Systems'
    ]
  },
  iso27001: {
    name: 'ISO 27001',
    version: '2022',
    description: 'Information security management system',
    categories: [
      'Information Security Policies',
      'Organization of Information Security',
      'Human Resource Security',
      'Asset Management',
      'Access Control',
      'Cryptography',
      'Physical Security',
      'Operations Security'
    ]
  }
};

export default function ComplianceScanModal({ onClose, onScanComplete }: ComplianceScanModalProps) {
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [customScope, setCustomScope] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });

  const handleStartScan = async () => {
    if (!selectedFramework) {
      setError('Please select a compliance framework');
      return;
    }

    setError(null);
    setScanning(true);
    setScanProgress({ current: 0, total: 100 });

    try {
      // Simulate scan progress
      const interval = setInterval(() => {
        setScanProgress(prev => ({
          ...prev,
          current: Math.min(prev.current + 10, 100)
        }));
      }, 500);

      // Simulate scan completion after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        const result = generateComplianceScanResult(selectedFramework);
        onScanComplete(result);
      }, 5000);
    } catch (error) {
      setError('Failed to complete compliance scan');
      setScanning(false);
    }
  };

  const generateComplianceScanResult = (framework: string): ComplianceScanResult => {
    // This is a mock implementation. In a real system, this would perform actual compliance checks.
    const controls: ComplianceControl[] = complianceFrameworks[framework as keyof typeof complianceFrameworks].categories.map((category, index) => ({
      id: `${framework.toUpperCase()}-${index + 1}`,
      title: category,
      description: `Compliance control for ${category}`,
      status: ['compliant', 'non-compliant', 'partial', 'not-applicable'][Math.floor(Math.random() * 4)] as ComplianceControl['status'],
      severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as ComplianceControl['severity'],
      findings: [
        'Sample finding 1',
        'Sample finding 2'
      ],
      remediation: 'Implement recommended security controls',
      references: [
        'https://example.com/compliance/reference1',
        'https://example.com/compliance/reference2'
      ]
    }));

    const summary = controls.reduce((acc, control) => {
      acc.total++;
      acc[control.status === 'non-compliant' ? 'nonCompliant' :
          control.status === 'partial' ? 'partial' :
          control.status === 'not-applicable' ? 'notApplicable' : 'compliant']++;
      return acc;
    }, {
      total: 0,
      compliant: 0,
      nonCompliant: 0,
      partial: 0,
      notApplicable: 0
    });

    return {
      framework,
      controls,
      summary,
      metadata: {
        scanDate: new Date(),
        framework_version: complianceFrameworks[framework as keyof typeof complianceFrameworks].version,
        scope: customScope
      }
    };
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Compliance Scan</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <AlertOctagon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Specialized Compliance AI Agents
            </h3>
            <ComplianceAIAgents />
          </div>
        </div>
      </div>
    </div>
  );
}