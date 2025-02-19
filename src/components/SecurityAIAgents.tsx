import { useState } from 'react';
import { Shield, Wrench, FileSearch, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Bot, Brain, Eye, Lightbulb, List } from 'lucide-react';

interface SecurityIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  observations: string[];
  impact: string;
  recommendation: string;
  remediation_steps: string[];
  standards: string[];
  references: string[];
}

const securityAuditor = {
  analyzeSecurity: (): SecurityIssue[] => [
    {
      id: 'SEC-001',
      severity: 'critical',
      category: 'Access Control',
      title: 'Insufficient Authentication Controls',
      description: 'Current authentication mechanisms lack multi-factor authentication and have weak password policies.',
      observations: [
        'Single-factor authentication is currently the only method implemented',
        'Password policy allows weak passwords (less than 12 characters)',
        'No account lockout mechanism after failed attempts',
        'Session management lacks secure configuration',
        'Password reset mechanism lacks proper verification'
      ],
      impact: 'High risk of unauthorized access and potential data breaches. This could lead to:' +
        '\n- Unauthorized data access' +
        '\n- Account takeover' +
        '\n- Data breaches' +
        '\n- Compliance violations',
      recommendation: 'Implement comprehensive authentication security controls including:' +
        '\n- Multi-factor authentication' +
        '\n- Strong password policies' +
        '\n- Account lockout mechanisms' +
        '\n- Secure session management',
      remediation_steps: [
        'Enable Multi-Factor Authentication using TOTP or hardware security keys',
        'Update password policy to require minimum 12 characters with complexity requirements',
        'Implement account lockout after 5 failed attempts with 30-minute lockout period',
        'Configure secure session timeout and rotation policies',
        'Implement secure password reset with email verification and temporary tokens'
      ],
      standards: ['NIST 800-53', 'ISO 27001', 'CIS Controls'],
      references: [
        'https://owasp.org/www-project-top-ten/2021/A07_2021-Identification_and_Authentication_Failures',
        'https://csrc.nist.gov/publications/detail/sp/800-63/3/final'
      ]
    },
    {
      id: 'SEC-002',
      severity: 'high',
      category: 'Encryption',
      title: 'Weak TLS Configuration',
      description: 'SSL/TLS configuration allows deprecated protocols and weak cipher suites.',
      observations: [
        'TLS 1.0 and 1.1 are still enabled',
        'Weak cipher suites detected (RC4, 3DES)',
        'Missing HTTP Strict Transport Security (HSTS)',
        'Certificates using SHA-1 signatures',
        'Missing secure cipher order configuration'
      ],
      impact: 'Vulnerable to man-in-the-middle attacks and data interception. Risks include:' +
        '\n- Data exposure' +
        '\n- Session hijacking' +
        '\n- Downgrade attacks' +
        '\n- Cryptographic vulnerabilities',
      recommendation: 'Strengthen TLS configuration by:' +
        '\n- Upgrading to modern TLS versions' +
        '\n- Using strong cipher suites' +
        '\n- Implementing HSTS' +
        '\n- Proper certificate management',
      remediation_steps: [
        'Disable TLS 1.0 and 1.1 across all servers and load balancers',
        'Enable only TLS 1.2 and 1.3 with secure cipher suites',
        'Remove support for weak ciphers (RC4, 3DES, etc.)',
        'Implement HSTS with includeSubDomains and preload flags',
        'Update certificates to use SHA-256 signatures'
      ],
      standards: ['NIST SP 800-52', 'PCI DSS', 'HIPAA'],
      references: [
        'https://www.ssllabs.com/downloads/SSL_TLS_Deployment_Best_Practices.pdf',
        'https://owasp.org/www-project-top-ten/2021/A02_2021-Cryptographic_Failures'
      ]
    },
    {
      id: 'SEC-003',
      severity: 'high',
      category: 'Data Protection',
      title: 'Insufficient Data Encryption',
      description: 'Sensitive data is not properly encrypted at rest and in transit.',
      observations: [
        'Sensitive data stored in plaintext in database',
        'Backup files not encrypted',
        'Weak encryption algorithms in use (DES, MD5)',
        'Missing encryption for API communications',
        'Inadequate key management procedures'
      ],
      impact: 'Risk of data exposure and non-compliance with privacy regulations. Consequences include:' +
        '\n- Data breaches' +
        '\n- Regulatory fines' +
        '\n- Reputation damage' +
        '\n- Legal liability',
      recommendation: 'Implement comprehensive data encryption strategy:' +
        '\n- Use strong encryption for all sensitive data' +
        '\n- Implement secure key management' +
        '\n- Regular encryption audits' +
        '\n- Secure backup encryption',
      remediation_steps: [
        'Identify and classify all sensitive data storage locations',
        'Implement AES-256 encryption for data at rest',
        'Configure TLS 1.3 for all data in transit',
        'Set up proper encryption key management system',
        'Implement regular key rotation and encryption audits'
      ],
      standards: ['GDPR', 'CCPA', 'HIPAA'],
      references: [
        'https://www.nist.gov/publications/advanced-encryption-standard-aes',
        'https://gdpr-info.eu/art-32-gdpr/'
      ]
    }
  ]
};

export default function SecurityAIAgents() {
  const [issues] = useState<SecurityIssue[]>(securityAuditor.analyzeSecurity());
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'auditor' | 'engineer'>('auditor');
  const [activeSection, setActiveSection] = useState<'observations' | 'recommendations' | 'actions'>('observations');

  const getSeverityColor = (severity: SecurityIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getSeverityIcon = (severity: SecurityIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('auditor')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'auditor'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileSearch className="h-5 w-5 mr-2" />
            Security Auditor
          </button>
          <button
            onClick={() => setActiveTab('engineer')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'engineer'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Wrench className="h-5 w-5 mr-2" />
            Security Engineer
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          <button
            onClick={() => setActiveSection('observations')}
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              activeSection === 'observations'
                ? 'text-primary border-b-2 border-primary bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Observations
          </button>
          <button
            onClick={() => setActiveSection('recommendations')}
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              activeSection === 'recommendations'
                ? 'text-primary border-b-2 border-primary bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Recommendations
          </button>
          <button
            onClick={() => setActiveSection('actions')}
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              activeSection === 'actions'
                ? 'text-primary border-b-2 border-primary bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="h-4 w-4 mr-2" />
            Actions
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          {activeTab === 'auditor' ? (
            <Bot className="h-6 w-6 text-primary" />
          ) : (
            <Brain className="h-6 w-6 text-primary" />
          )}
          <h3 className="text-lg font-medium text-gray-900">
            {activeTab === 'auditor' ? 'Security Audit Analysis' : 'Remediation Steps'}
          </h3>
        </div>

        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  {getSeverityIcon(issue.severity)}
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{issue.title}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{issue.category}</span>
                  </div>
                </div>
                {expandedIssue === issue.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {expandedIssue === issue.id && (
                <div className="px-4 pb-4">
                  <div className="border-t pt-4 mt-2 space-y-4">
                    {activeSection === 'observations' && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-primary" />
                          Key Observations
                        </h4>
                        <ul className="mt-2 space-y-2">
                          {issue.observations.map((observation, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium mr-2 mt-0.5">
                                {index + 1}
                              </span>
                              {observation}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-900">Impact Analysis</h5>
                          <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{issue.impact}</p>
                        </div>
                      </div>
                    )}

                    {activeSection === 'recommendations' && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                          Recommendations
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{issue.recommendation}</p>
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-900">Applicable Standards</h5>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {issue.standards.map((standard) => (
                              <span
                                key={standard}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {standard}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === 'actions' && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                          <List className="h-4 w-4 mr-2 text-primary" />
                          Required Actions
                        </h4>
                        <ol className="mt-2 space-y-2">
                          {issue.remediation_steps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium mr-2 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-sm text-gray-600">{step}</span>
                            </li>
                          ))}
                        </ol>
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-900">References</h5>
                          <ul className="mt-2 space-y-1">
                            {issue.references.map((ref) => (
                              <li key={ref}>
                                <a
                                  href={ref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:text-primary/80"
                                >
                                  {ref}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}