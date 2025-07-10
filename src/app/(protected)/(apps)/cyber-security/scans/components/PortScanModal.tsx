import { useState } from 'react';
import { XCircle, Loader2, AlertTriangle, AlertCircle, AlertOctagon, Shield, Server, Network } from 'lucide-react';
import { scanPorts, type PortScanResult } from '@/lib/portScanner';

interface PortScanModalProps {
  onClose: () => void;
  onScanComplete: (results: PortScanResult[]) => void;
}

interface IpRange {
  start: string;
  end: string;
}

const severityColors = {
  critical: 'text-red-600 bg-red-50',
  high: 'text-orange-600 bg-orange-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-blue-600 bg-blue-50',
};

const validateIpAddress = (ip: string): boolean => {
  const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!pattern.test(ip)) return false;
  
  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
};

const generateIpRange = (start: string, end: string): string[] => {
  const startParts = start.split('.').map(Number);
  const endParts = end.split('.').map(Number);
  
  const startNum = (startParts[0] << 24) + (startParts[1] << 16) + (startParts[2] << 8) + startParts[3];
  const endNum = (endParts[0] << 24) + (endParts[1] << 16) + (endParts[2] << 8) + endParts[3];
  
  const ips: string[] = [];
  for (let i = startNum; i <= endNum; i++) {
    const ip = [
      (i >> 24) & 255,
      (i >> 16) & 255,
      (i >> 8) & 255,
      i & 255
    ].join('.');
    ips.push(ip);
  }
  
  return ips;
};

export default function PortScanModal({ onClose, onScanComplete }: PortScanModalProps) {
  const [host, setHost] = useState('');
  const [ipRange, setIpRange] = useState<IpRange>({ start: '', end: '' });
  const [useIpRange, setUseIpRange] = useState(false);
  const [portRange, setPortRange] = useState({ start: 1, end: 1024 });
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<PortScanResult[] | null>(null);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setScanning(true);
    setResults(null);

    try {
      if (useIpRange) {
        if (!validateIpAddress(ipRange.start) || !validateIpAddress(ipRange.end)) {
          throw new Error('Invalid IP address format');
        }

        const ips = generateIpRange(ipRange.start, ipRange.end);
        if (ips.length > 256) {
          throw new Error('IP range too large. Maximum 256 IPs allowed per scan.');
        }

        setScanProgress({ current: 0, total: ips.length });
        
        const allResults: PortScanResult[] = [];
        for (let i = 0; i < ips.length; i++) {
          const ip = ips[i];
          const results = await scanPorts(ip, portRange);
          allResults.push(...results);
          setScanProgress(prev => ({ ...prev, current: i + 1 }));
        }
        
        setResults(allResults);
        onScanComplete(allResults);
      } else {
        const results = await scanPorts(host, portRange);
        setResults(results);
        onScanComplete(results);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to scan ports. Please check the target and try again.');
    } finally {
      setScanning(false);
      setScanProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Network className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Port Scanner</h2>
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

        {!results ? (
          <form onSubmit={handleScan} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scan Type
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-primary"
                      checked={!useIpRange}
                      onChange={() => setUseIpRange(false)}
                    />
                    <span className="ml-2 text-sm text-gray-700">Single Host</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-primary"
                      checked={useIpRange}
                      onChange={() => setUseIpRange(true)}
                    />
                    <span className="ml-2 text-sm text-gray-700">IP Range</span>
                  </label>
                </div>
              </div>

              {useIpRange ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startIp" className="block text-sm font-medium text-gray-700">
                      Start IP
                    </label>
                    <input
                      type="text"
                      id="startIp"
                      value={ipRange.start}
                      onChange={(e) => setIpRange(prev => ({ ...prev, start: e.target.value }))}
                      placeholder="192.168.1.1"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endIp" className="block text-sm font-medium text-gray-700">
                      End IP
                    </label>
                    <input
                      type="text"
                      id="endIp"
                      value={ipRange.end}
                      onChange={(e) => setIpRange(prev => ({ ...prev, end: e.target.value }))}
                      placeholder="192.168.1.255"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="host" className="block text-sm font-medium text-gray-700">
                    Target Host
                  </label>
                  <input
                    type="text"
                    id="host"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="example.com or IP address"
                    className="form-input"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startPort" className="block text-sm font-medium text-gray-700">
                    Start Port
                  </label>
                  <input
                    type="number"
                    id="startPort"
                    min="1"
                    max="65535"
                    value={portRange.start}
                    onChange={(e) => setPortRange(prev => ({ ...prev, start: parseInt(e.target.value) || 1 }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="endPort" className="block text-sm font-medium text-gray-700">
                    End Port
                  </label>
                  <input
                    type="number"
                    id="endPort"
                    min="1"
                    max="65535"
                    value={portRange.end}
                    onChange={(e) => setPortRange(prev => ({ ...prev, end: parseInt(e.target.value) || 1024 }))}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 flex items-center mb-2">
                <Shield className="h-4 w-4 text-primary mr-2" />
                Scan Features
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <Server className="h-4 w-4 text-gray-400 mr-2" />
                  Service Detection
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-gray-400 mr-2" />
                  Vulnerability Assessment
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-400 mr-2" />
                  Security Analysis
                </li>
              </ul>
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
                    {scanProgress.total > 0 ? 
                      `Scanning (${scanProgress.current}/${scanProgress.total})...` :
                      'Scanning...'
                    }
                  </>
                ) : (
                  <>
                    <Network className="h-4 w-4 mr-2" />
                    Start Port Scan
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Scan Results for {useIpRange ? `${ipRange.start} - ${ipRange.end}` : host}
              </h3>
              
              <div className="space-y-4">
                {results.length === 0 ? (
                  <p className="text-sm text-gray-500">No open ports found in the specified range.</p>
                ) : (
                  results.map((result) => (
                    <div
                      key={`${result.port}`}
                      className="bg-white p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Server className="h-5 w-5 text-primary mr-2" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Port {result.port} ({result.service})
                            </h4>
                            <p className="text-sm text-gray-500">
                              State: {result.state}
                            </p>
                          </div>
                        </div>
                      </div>

                      {result.vulnerabilities && result.vulnerabilities.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h5 className="text-sm font-medium text-gray-900">Vulnerabilities:</h5>
                          {result.vulnerabilities.map((vuln, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-md ${severityColors[vuln.severity]}`}
                            >
                              <div className="flex items-start">
                                {vuln.severity === 'critical' && <AlertOctagon className="h-5 w-5 mr-2 mt-0.5" />}
                                {vuln.severity === 'high' && <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />}
                                {vuln.severity === 'medium' && <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />}
                                {vuln.severity === 'low' && <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />}
                                <div>
                                  <div className="flex items-center">
                                    <h6 className="text-sm font-medium">{vuln.title}</h6>
                                    {vuln.cvss && (
                                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                        CVSS: {vuln.cvss}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm">{vuln.description}</p>
                                  <p className="mt-1 text-sm font-medium">Remediation:</p>
                                  <p className="text-sm">{vuln.remediation}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setResults(null);
                  setHost('');
                  setIpRange({ start: '', end: '' });
                }}
                className="btn-secondary"
              >
                Scan Another Target
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