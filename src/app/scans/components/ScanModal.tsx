import { useState } from 'react';
import { XCircle, Loader2, AlertTriangle, AlertCircle, AlertOctagon, Shield, CheckCircle, Globe, Lock, Server } from 'lucide-react';
import { scanWebsite, type ScanResult } from '@/lib/scanner';

interface ScanModalProps {
  onClose: () => void;
  onScanComplete: (result: ScanResult) => void;
}

const severityIcons = {
  critical: AlertOctagon,
  high: AlertTriangle,
  medium: AlertCircle,
  low: AlertCircle,
};

const severityColors = {
  critical: 'text-red-600',
  high: 'text-orange-500',
  medium: 'text-yellow-500',
  low: 'text-blue-500',
};

const severityBgColors = {
  critical: 'bg-red-50',
  high: 'bg-orange-50',
  medium: 'bg-yellow-50',
  low: 'bg-blue-50',
};

export default function ScanModal({ onClose, onScanComplete }: ScanModalProps) {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setScanning(true);
    setResult(null);

    try {
      const scanResult = await scanWebsite(url);
      setResult(scanResult);
      onScanComplete(scanResult);
    } catch (error) {
      setError('Failed to scan website. Please check the URL and try again.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Enhanced Security Scan</h2>
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

        {!result ? (
          <form onSubmit={handleScan} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Website URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com"
                  className="form-input"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter a website URL to perform a comprehensive security scan. The scan will check for:
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center">
                    <Lock className="h-4 w-4 text-primary mr-2" />
                    Security Headers
                  </h4>
                  <ul className="mt-2 text-sm text-gray-500 space-y-1">
                    <li>• HTTP Strict Transport Security (HSTS)</li>
                    <li>• Content Security Policy (CSP)</li>
                    <li>• Cross-Origin Resource Sharing (CORS)</li>
                    <li>• Clickjacking Protection</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center">
                    <Shield className="h-4 w-4 text-primary mr-2" />
                    Vulnerabilities
                  </h4>
                  <ul className="mt-2 text-sm text-gray-500 space-y-1">
                    <li>• SSL/TLS Configuration</li>
                    <li>• Information Disclosure</li>
                    <li>• Security Misconfigurations</li>
                    <li>• Common Web Vulnerabilities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={scanning}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Start Enhanced Scan
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Globe className="h-5 w-5 text-primary mr-2" />
                  Scan Results for {result.url}
                </h3>
                <div className="flex items-center space-x-2">
                  {result.ssl?.valid ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Lock className="h-3 w-3 mr-1" />
                      Secure Connection
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Insecure Connection
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Lock className="h-4 w-4 text-gray-500 mr-2" />
                    Security Headers
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(result.headers).map(([header, value]) => (
                      <div key={header} className="flex items-start">
                        <div className="mt-0.5">
                          {value ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">{header}</p>
                          <p className="text-xs text-gray-500 break-all">
                            {value || 'Not set'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-gray-500 mr-2" />
                    Findings Summary
                  </h4>
                  <div className="space-y-3">
                    {['critical', 'high', 'medium', 'low'].map(severity => {
                      const count = result.findings.filter(f => f.severity === severity).length;
                      const Icon = severityIcons[severity as keyof typeof severityIcons];
                      return count > 0 ? (
                        <div key={severity} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Icon className={`h-4 w-4 ${severityColors[severity as keyof typeof severityColors]} mr-2`} />
                            <span className="text-sm text-gray-900 capitalize">{severity}</span>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              severity === 'critical' ? 'bg-red-100 text-red-800' :
                              severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {count} {count === 1 ? 'finding' : 'findings'}
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {result.technologies && result.technologies.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Server className="h-4 w-4 text-gray-500 mr-2" />
                        Detected Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Detailed Findings</h4>
              {result.findings.map((finding, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${severityBgColors[finding.severity as keyof typeof severityBgColors]}`}
                >
                  <div className="flex items-start">
                    {(() => {
                      const Icon = severityIcons[finding.severity as keyof typeof severityIcons];
                      return (
                        <Icon
                          className={`h-5 w-5 ${severityColors[finding.severity as keyof typeof severityColors]} mt-0.5`}
                        />
                      );
                    })()}
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900">{finding.title}</h5>
                        {finding.cvss && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            finding.cvss >= 7.0 ? 'bg-red-100 text-red-800' :
                            finding.cvss >= 4.0 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            CVSS: {finding.cvss}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{finding.description}</p>
                      <div className="mt-2">
                        <h6 className="text-xs font-medium text-gray-900">Remediation:</h6>
                        <p className="mt-1 text-sm text-gray-600">{finding.remediation}</p>
                      </div>
                      {finding.references && finding.references.length > 0 && (
                        <div className="mt-2">
                          <h6 className="text-xs font-medium text-gray-900">References:</h6>
                          <ul className="mt-1 space-y-1">
                            {finding.references.map((ref, idx) => (
                              <li key={idx}>
                                <a
                                  href={ref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:text-primary/80"
                                >
                                  {ref}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setUrl('');
                }}
                className="btn-secondary"
              >
                Scan Another Website
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}