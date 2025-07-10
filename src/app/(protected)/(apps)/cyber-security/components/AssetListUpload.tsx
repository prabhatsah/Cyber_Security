import { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle2, X, List, Eye, HelpCircle } from 'lucide-react';

interface Asset {
  id: string;
  type: 'host' | 'service' | 'application' | 'database';
  name: string;
  identifier: string; // IP, URL, or unique identifier
  metadata: Record<string, any>;
  source: string;
  discoveredAt: Date;
}

interface ParsedAssetList {
  source: string;
  format: string;
  assets: Asset[];
  metadata: Record<string, any>;
}

const formatSpecs = {
  json: {
    example: `[
  {
    "name": "Web Server",
    "hostname": "web01.example.com",
    "ip": "192.168.1.100",
    "mac": "00:11:22:33:44:55",
    "os": "Ubuntu 22.04",
    "services": [
      {
        "port": 80,
        "protocol": "tcp",
        "service": "http",
        "version": "nginx/1.18.0"
      }
    ]
  }
]`,
    description: 'JSON array of assets with required fields'
  },
  csv: {
    example: `name,hostname,ip,mac,os,port,service,version
Web Server,web01.example.com,192.168.1.100,00:11:22:33:44:55,Ubuntu 22.04,80,http,nginx/1.18.0`,
    description: 'CSV with headers and values'
  },
  xml: {
    example: `<?xml version="1.0" encoding="UTF-8"?>
<assets>
  <asset>
    <name>Web Server</name>
    <hostname>web01.example.com</hostname>
    <ip>192.168.1.100</ip>
    <mac>00:11:22:33:44:55</mac>
    <os>Ubuntu 22.04</os>
    <services>
      <service>
        <port>80</port>
        <protocol>tcp</protocol>
        <name>http</name>
        <version>nginx/1.18.0</version>
      </service>
    </services>
  </asset>
</assets>`,
    description: 'XML document with asset elements'
  }
};

const requiredFields = {
  host: ['name/hostname', 'ip/url'],
  service: ['name', 'port', 'protocol'],
  application: ['name', 'version'],
  database: ['name', 'type', 'version']
};

export default function AssetListUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedAssets, setParsedAssets] = useState<ParsedAssetList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFormatHelp, setShowFormatHelp] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const parseAssetList = async (content: string, fileName: string): Promise<ParsedAssetList> => {
    try {
      // Detect format based on content or file extension
      const format = fileName.toLowerCase().endsWith('.json') ? 'json' : 
                    fileName.toLowerCase().endsWith('.xml') ? 'xml' : 
                    fileName.toLowerCase().endsWith('.csv') ? 'csv' : 
                    'unknown';

      let assets: Asset[] = [];

      if (format === 'json') {
        const parsed = JSON.parse(content);
        // Handle different JSON formats (Nmap, Qualys, etc.)
        if (Array.isArray(parsed)) {
          assets = parsed.map(item => ({
            id: crypto.randomUUID(),
            type: detectAssetType(item),
            name: item.name || item.hostname || item.host || '',
            identifier: item.ip || item.url || item.id || '',
            metadata: item,
            source: fileName,
            discoveredAt: new Date()
          }));
        }
      } else if (format === 'csv') {
        // Parse CSV content
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        
        assets = lines.slice(1).map(line => {
          const values = line.split(',');
          const item = headers.reduce((acc, header, index) => {
            acc[header.trim()] = values[index]?.trim() || '';
            return acc;
          }, {} as Record<string, string>);

          return {
            id: crypto.randomUUID(),
            type: detectAssetType(item),
            name: item.name || item.hostname || item.host || '',
            identifier: item.ip || item.url || item.id || '',
            metadata: item,
            source: fileName,
            discoveredAt: new Date()
          };
        });
      }
      // Add more format handlers as needed

      return {
        source: fileName,
        format,
        assets,
        metadata: {
          totalAssets: assets.length,
          types: assets.reduce((acc, asset) => {
            acc[asset.type] = (acc[asset.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      };
    } catch (error) {
      throw new Error('Failed to parse asset list. Please check the file format.');
    }
  };

  const detectAssetType = (item: Record<string, any>): Asset['type'] => {
    if (item.ip || item.mac || item.hostname) return 'host';
    if (item.port || item.service || item.protocol) return 'service';
    if (item.application || item.version || item.technology) return 'application';
    if (item.database || item.dbms || item.schema) return 'database';
    return 'host';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const content = await file.text();
      const parsed = await parseAssetList(content, file.name);
      setParsedAssets(parsed);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process file');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const parsed = await parseAssetList(content, file.name);
      setParsedAssets(parsed);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process file');
    }
  };

  const getAssetTypeIcon = (type: Asset['type']) => {
    switch (type) {
      case 'host':
        return <div className="p-1 bg-blue-50 rounded"><FileText className="h-4 w-4 text-blue-600" /></div>;
      case 'service':
        return <div className="p-1 bg-green-50 rounded"><FileText className="h-4 w-4 text-green-600" /></div>;
      case 'application':
        return <div className="p-1 bg-purple-50 rounded"><FileText className="h-4 w-4 text-purple-600" /></div>;
      case 'database':
        return <div className="p-1 bg-orange-50 rounded"><FileText className="h-4 w-4 text-orange-600" /></div>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Format Help Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowFormatHelp(!showFormatHelp)}
          className="flex items-center text-sm text-primary hover:text-primary/80"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          File Format Specifications
        </button>
      </div>

      {/* Format Help Panel */}
      {showFormatHelp && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">File Format Requirements</h3>
            <button
              onClick={() => setShowFormatHelp(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Required Fields */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Required Fields by Asset Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(requiredFields).map(([type, fields]) => (
                  <div key={type} className="bg-white p-3 rounded border">
                    <h5 className="text-sm font-medium text-gray-900 capitalize mb-2">{type}</h5>
                    <ul className="space-y-1">
                      {fields.map((field) => (
                        <li key={field} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Format Examples */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Format Examples</h4>
              
              {Object.entries(formatSpecs).map(([format, spec]) => (
                <div key={format} className="bg-white p-4 rounded border">
                  <h5 className="text-sm font-medium text-gray-900 uppercase mb-2">{format} Format</h5>
                  <p className="text-sm text-gray-600 mb-2">{spec.description}</p>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                    {spec.example}
                  </pre>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Tips</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 mt-1.5" />
                  Each asset must have a unique identifier (IP, URL, or custom ID)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 mt-1.5" />
                  Dates should be in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 mt-1.5" />
                  Additional metadata fields are allowed and will be preserved
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 mt-1.5" />
                  For CSV files, use comma as delimiter and quote strings containing commas
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
      >
        <div className="flex flex-col items-center">
          <Upload className={`h-10 w-10 mb-4 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your asset list file here, or
          </p>
          <label className="btn-primary cursor-pointer">
            <span>Select File</span>
            <input
              type="file"
              className="hidden"
              accept=".json,.csv,.xml,.txt"
              onChange={handleFileSelect}
            />
          </label>
          <p className="mt-2 text-xs text-gray-500">
            Supported formats: JSON, CSV, XML
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Preview */}
      {parsedAssets && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Asset List Summary</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Source: {parsedAssets.source} ({parsedAssets.format})
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn-secondary"
                >
                  {showPreview ? (
                    <X className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {showPreview ? 'Close Preview' : 'Preview Assets'}
                </button>
                <button className="btn-primary">
                  <List className="h-4 w-4 mr-2" />
                  Import Assets
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Total Assets
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {parsedAssets.metadata.totalAssets}
                </p>
              </div>
              {Object.entries(parsedAssets.metadata.types).map(([type, count]) => (
                <div key={type} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    {getAssetTypeIcon(type as Asset['type'])}
                    <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                      {type}s
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {showPreview && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Identifier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discovered
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedAssets.assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getAssetTypeIcon(asset.type)}
                          <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                            {asset.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.identifier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.discoveredAt.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}