import { logAuditEvent } from './audit';

export interface PortScanResult {
  port: number;
  state: 'open' | 'closed' | 'filtered';
  service?: string;
  version?: string;
  vulnerabilities?: {
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    remediation: string;
    cvss?: number;
  }[];
}

// Common ports and their default services
const commonPorts = {
  21: { service: 'FTP', vulnerabilities: ['Anonymous FTP', 'FTP Bounce', 'Clear-text Authentication'] },
  22: { service: 'SSH', vulnerabilities: ['Weak Ciphers', 'Protocol Version 1', 'Brute Force'] },
  23: { service: 'Telnet', vulnerabilities: ['Clear-text Authentication', 'No Encryption'] },
  25: { service: 'SMTP', vulnerabilities: ['Open Relay', 'Version Disclosure'] },
  53: { service: 'DNS', vulnerabilities: ['Zone Transfer', 'Cache Poisoning'] },
  80: { service: 'HTTP', vulnerabilities: ['Directory Listing', 'Version Disclosure'] },
  110: { service: 'POP3', vulnerabilities: ['Clear-text Authentication'] },
  143: { service: 'IMAP', vulnerabilities: ['Clear-text Authentication'] },
  443: { service: 'HTTPS', vulnerabilities: ['SSL/TLS Issues', 'Weak Ciphers'] },
  445: { service: 'SMB', vulnerabilities: ['Remote Code Execution', 'Information Disclosure'] },
  1433: { service: 'MSSQL', vulnerabilities: ['Weak Authentication', 'Buffer Overflow'] },
  3306: { service: 'MySQL', vulnerabilities: ['Weak Authentication', 'Information Disclosure'] },
  3389: { service: 'RDP', vulnerabilities: ['BlueKeep', 'Man-in-the-Middle'] },
  5432: { service: 'PostgreSQL', vulnerabilities: ['Weak Authentication', 'Information Disclosure'] },
  8080: { service: 'HTTP-Proxy', vulnerabilities: ['Directory Listing', 'Version Disclosure'] },
};

const vulnerabilityDatabase = {
  'Anonymous FTP': {
    severity: 'high',
    description: 'FTP server allows anonymous access',
    remediation: 'Disable anonymous FTP access or restrict it to specific directories',
    cvss: 7.5,
  },
  'Clear-text Authentication': {
    severity: 'high',
    description: 'Service transmits credentials in clear text',
    remediation: 'Use encrypted alternatives or implement TLS',
    cvss: 7.1,
  },
  'Weak Ciphers': {
    severity: 'medium',
    description: 'Service supports weak cryptographic ciphers',
    remediation: 'Disable weak ciphers and enable only strong encryption algorithms',
    cvss: 5.9,
  },
  'Version Disclosure': {
    severity: 'low',
    description: 'Service reveals version information',
    remediation: 'Configure service to hide version information',
    cvss: 2.6,
  },
  'Directory Listing': {
    severity: 'medium',
    description: 'Web server directory listing is enabled',
    remediation: 'Disable directory listing in web server configuration',
    cvss: 5.0,
  },
  'Zone Transfer': {
    severity: 'high',
    description: 'DNS server allows zone transfers',
    remediation: 'Restrict zone transfers to authorized servers only',
    cvss: 7.5,
  },
  'Remote Code Execution': {
    severity: 'critical',
    description: 'Service is vulnerable to remote code execution',
    remediation: 'Apply latest security patches and updates',
    cvss: 9.8,
  },
  'Weak Authentication': {
    severity: 'high',
    description: 'Service uses weak authentication mechanisms',
    remediation: 'Implement strong authentication methods and password policies',
    cvss: 7.4,
  },
};

export async function scanPorts(host: string, portRange: { start: number; end: number } = { start: 1, end: 1024 }): Promise<PortScanResult[]> {
  const results: PortScanResult[] = [];
  
  // Log scan start
  await logAuditEvent({
    action: 'scan_started',
    details: {
      type: 'port_scan',
      host,
      port_range: portRange,
    },
  });

  try {
    // Simulate port scanning
    for (const port of Object.keys(commonPorts).map(Number)) {
      if (port >= portRange.start && port <= portRange.end) {
        const { service, vulnerabilities } = commonPorts[port as keyof typeof commonPorts];
        
        // Simulate port check (in a real implementation, this would actually test the port)
        const isOpen = Math.random() > 0.7; // 30% chance port is open
        
        if (isOpen) {
          const portResult: PortScanResult = {
            port,
            state: 'open',
            service,
            vulnerabilities: [],
          };

          // Add detected vulnerabilities
          vulnerabilities.forEach(vulnName => {
            const vulnInfo = vulnerabilityDatabase[vulnName as keyof typeof vulnerabilityDatabase];
            if (vulnInfo) {
              portResult.vulnerabilities?.push({
                severity: vulnInfo.severity as 'critical' | 'high' | 'medium' | 'low',
                title: vulnName,
                description: vulnInfo.description,
                remediation: vulnInfo.remediation,
                cvss: vulnInfo.cvss,
              });
            }
          });

          results.push(portResult);
        }
      }
    }

    // Log scan completion
    await logAuditEvent({
      action: 'scan_completed',
      details: {
        type: 'port_scan',
        host,
        ports_scanned: portRange.end - portRange.start + 1,
        open_ports: results.length,
      },
    });

    return results;
  } catch (error) {
    // Log scan failure
    await logAuditEvent({
      action: 'scan_failed',
      details: {
        type: 'port_scan',
        host,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw error;
  }
}