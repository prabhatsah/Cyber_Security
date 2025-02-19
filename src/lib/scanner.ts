import axios from 'axios';
import { logAuditEvent } from './audit';
import { supabase } from './supabase';

export interface SecurityHeaders {
  'Strict-Transport-Security'?: string;
  'Content-Security-Policy'?: string;
  'X-Frame-Options'?: string;
  'X-Content-Type-Options'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
  'X-XSS-Protection'?: string;
  'Access-Control-Allow-Origin'?: string;
  'Cross-Origin-Opener-Policy'?: string;
  'Cross-Origin-Resource-Policy'?: string;
  'Cross-Origin-Embedder-Policy'?: string;
}

export interface ScanResult {
  url: string;
  headers: SecurityHeaders;
  findings: {
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    remediation: string;
    references?: string[];
    cvss?: number;
  }[];
  ssl?: {
    valid: boolean;
    issuer?: string;
    validFrom?: string;
    validTo?: string;
    protocol?: string;
  };
  technologies?: string[];
  ports?: {
    port: number;
    state: string;
    service?: string;
  }[];
}

export async function scanWebsite(url: string, userId?: string): Promise<ScanResult> {
  await logAuditEvent({
    action: 'scan_started',
    details: { url },
    user_id: userId,
  });

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const findings: ScanResult['findings'] = [];
  let technologies: string[] = [];

  try {
    // Use a CORS proxy for development
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    
    // Perform initial request through the proxy
    const response = await axios.get(proxyUrl, {
      timeout: 10000,
    });
    
    if (!response.data || response.data.status?.http_code >= 400) {
      throw new Error('Failed to fetch website');
    }

    // Extract headers from the response
    const headers: SecurityHeaders = {};
    const rawHeaders = response.data.status?.headers || {};
    
    // Normalize header names to match our expected format
    Object.entries(rawHeaders).forEach(([key, value]) => {
      const normalizedKey = key.toLowerCase();
      switch (normalizedKey) {
        case 'strict-transport-security':
          headers['Strict-Transport-Security'] = value as string;
          break;
        case 'content-security-policy':
          headers['Content-Security-Policy'] = value as string;
          break;
        case 'x-frame-options':
          headers['X-Frame-Options'] = value as string;
          break;
        case 'x-content-type-options':
          headers['X-Content-Type-Options'] = value as string;
          break;
        case 'referrer-policy':
          headers['Referrer-Policy'] = value as string;
          break;
        case 'permissions-policy':
          headers['Permissions-Policy'] = value as string;
          break;
        case 'x-xss-protection':
          headers['X-XSS-Protection'] = value as string;
          break;
        case 'access-control-allow-origin':
          headers['Access-Control-Allow-Origin'] = value as string;
          break;
        case 'cross-origin-opener-policy':
          headers['Cross-Origin-Opener-Policy'] = value as string;
          break;
        case 'cross-origin-resource-policy':
          headers['Cross-Origin-Resource-Policy'] = value as string;
          break;
        case 'cross-origin-embedder-policy':
          headers['Cross-Origin-Embedder-Policy'] = value as string;
          break;
      }
    });

    // Check protocol
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'https:') {
      findings.push({
        severity: 'critical',
        title: 'Insecure Protocol',
        description: 'Website is not using HTTPS, making it vulnerable to man-in-the-middle attacks.',
        remediation: 'Enable HTTPS and redirect all HTTP traffic to HTTPS. Obtain an SSL certificate from a trusted CA.',
        cvss: 7.4,
        references: [
          'https://owasp.org/www-project-top-ten/2021/A02_2021-Cryptographic_Failures',
          'https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html'
        ]
      });
    }

    // Check for missing or misconfigured security headers
    if (!headers['Strict-Transport-Security']) {
      findings.push({
        severity: 'high',
        title: 'Missing HSTS Header',
        description: 'The HTTP Strict Transport Security header is not set, allowing potential downgrade attacks.',
        remediation: 'Add the Strict-Transport-Security header with a minimum max-age of 31536000 seconds (1 year).',
        cvss: 6.5,
        references: [
          'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html'
        ]
      });
    } else if (!headers['Strict-Transport-Security'].includes('max-age=31536000')) {
      findings.push({
        severity: 'medium',
        title: 'Weak HSTS Configuration',
        description: 'The HSTS max-age is set to less than one year, which may not provide adequate protection.',
        remediation: 'Increase the HSTS max-age to at least 31536000 seconds (1 year).',
        cvss: 4.3
      });
    }

    if (!headers['Content-Security-Policy']) {
      findings.push({
        severity: 'high',
        title: 'Missing Content Security Policy',
        description: 'No Content Security Policy is configured, increasing risk of XSS and other injection attacks.',
        remediation: 'Implement a strict Content Security Policy that defines allowed sources for all resource types.',
        cvss: 6.1,
        references: [
          'https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html'
        ]
      });
    } else if (headers['Content-Security-Policy'].includes("'unsafe-inline'") || 
               headers['Content-Security-Policy'].includes("'unsafe-eval'")) {
      findings.push({
        severity: 'medium',
        title: 'Weak Content Security Policy',
        description: 'The Content Security Policy includes unsafe directives that weaken its protection.',
        remediation: 'Remove unsafe-inline and unsafe-eval directives. Use nonces or hashes instead.',
        cvss: 4.8
      });
    }

    if (!headers['X-Frame-Options']) {
      findings.push({
        severity: 'medium',
        title: 'Missing Clickjacking Protection',
        description: 'The X-Frame-Options header is not set, making the site vulnerable to clickjacking attacks.',
        remediation: 'Add X-Frame-Options header with DENY or SAMEORIGIN value.',
        cvss: 4.3,
        references: [
          'https://owasp.org/www-community/attacks/Clickjacking'
        ]
      });
    }

    if (!headers['X-Content-Type-Options']) {
      findings.push({
        severity: 'medium',
        title: 'MIME Sniffing Possible',
        description: 'The X-Content-Type-Options header is not set, allowing MIME type sniffing.',
        remediation: 'Add X-Content-Type-Options: nosniff header.',
        cvss: 4.3
      });
    }

    // Check for permissive CORS
    if (headers['Access-Control-Allow-Origin'] === '*') {
      findings.push({
        severity: 'high',
        title: 'Overly Permissive CORS Policy',
        description: 'The Access-Control-Allow-Origin header is set to *, allowing any domain to access resources.',
        remediation: 'Restrict CORS to specific trusted domains only.',
        cvss: 6.5
      });
    }

    // Check for technology information disclosure
    const server = rawHeaders['server'];
    const poweredBy = rawHeaders['x-powered-by'];
    if (server) {
      technologies.push(server);
      findings.push({
        severity: 'low',
        title: 'Server Information Disclosure',
        description: `Server header reveals server software: ${server}`,
        remediation: 'Configure server to remove or obscure the Server header.',
        cvss: 2.6
      });
    }
    if (poweredBy) {
      technologies.push(poweredBy);
      findings.push({
        severity: 'low',
        title: 'Technology Information Disclosure',
        description: `X-Powered-By header reveals technology stack: ${poweredBy}`,
        remediation: 'Remove the X-Powered-By header.',
        cvss: 2.6
      });
    }

    // Check for common security misconfigurations in response body
    const responseText = response.data.contents;
    
    // Check for exposed version numbers
    const versionRegex = /v\d+\.\d+\.\d+/gi;
    const versions = responseText.match(versionRegex);
    if (versions?.length) {
      findings.push({
        severity: 'low',
        title: 'Version Information Exposure',
        description: 'Software version numbers are exposed in the response.',
        remediation: 'Remove version numbers from public-facing pages and responses.',
        cvss: 2.6
      });
    }

    // Check for debug/error information
    if (responseText.includes('stack trace') || 
        responseText.includes('debug') || 
        responseText.includes('error in')) {
      findings.push({
        severity: 'medium',
        title: 'Debug Information Exposure',
        description: 'Debug or error information is exposed to users.',
        remediation: 'Disable debug output in production and implement proper error handling.',
        cvss: 5.3
      });
    }

    // Check for common security misconfigurations
    if (rawHeaders['x-aspnet-version'] || rawHeaders['x-aspnetmvc-version']) {
      findings.push({
        severity: 'low',
        title: 'ASP.NET Version Disclosure',
        description: 'ASP.NET version information is exposed through headers.',
        remediation: 'Remove ASP.NET version headers in web.config.',
        cvss: 2.6
      });
    }

    const result: ScanResult = {
      url,
      headers,
      findings,
      technologies,
      ssl: {
        valid: urlObj.protocol === 'https:',
        protocol: rawHeaders['x-protocol'] || 'Unknown'
      }
    };

    // Log scan completion
    await logAuditEvent({
      action: 'scan_completed',
      details: {
        url,
        findings_count: findings.length,
        severity_counts: findings.reduce((acc, f) => {
          acc[f.severity] = (acc[f.severity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        technologies
      },
      user_id: userId,
    });

    return result;

  } catch (error) {
    // Log scan failure
    await logAuditEvent({
      action: 'scan_failed',
      details: {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      user_id: userId,
    });

    findings.push({
      severity: 'critical',
      title: 'Connection Failed',
      description: 'Unable to establish connection to the target website.',
      remediation: 'Verify the website is accessible and properly configured.',
      cvss: 7.5
    });

    return { url, headers: {}, findings, technologies: [] };
  }
}