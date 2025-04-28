'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, AlertTriangle, AlertCircle, AlertOctagon, Download, FileDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

type ScanFinding = Database['public']['Tables']['scan_findings']['Row'];
type VulnerabilityScan = Database['public']['Tables']['vulnerability_scans']['Row'] & {
  scan_findings: ScanFinding[];
  scan_targets: {
    name: string;
    target_url: string | null;
    target_ip: string | null;
  };
};

const severityIcons = {
  critical: AlertOctagon,
  high: AlertTriangle,
  medium: AlertCircle,
  low: AlertCircle,
  info: AlertCircle,
};

const severityColors = {
  critical: 'text-red-600',
  high: 'text-orange-500',
  medium: 'text-yellow-500',
  low: 'text-blue-500',
  info: 'text-gray-500',
};

const severityBadgeColors = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
  info: 'bg-gray-100 text-gray-800',
};

export function Reports() {
  const { data: scans, isLoading } = useQuery({
    queryKey: ['vulnerability-scans-with-findings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vulnerability_scans')
        .select(`
          *,
          scan_findings (*),
          scan_targets (
            name,
            target_url,
            target_ip
          )
        `)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data as VulnerabilityScan[];
    },
  });

  const generatePDFReport = (scan: VulnerabilityScan) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.text('Vulnerability Scan Report', pageWidth / 2, 20, { align: 'center' });
    
    // Target Information
    doc.setFontSize(16);
    doc.text('Target Information', 20, 40);
    doc.setFontSize(12);
    doc.text(`Name: ${scan.scan_targets.name}`, 20, 50);
    if (scan.scan_targets.target_url) {
      doc.text(`URL: ${scan.scan_targets.target_url}`, 20, 60);
    }
    if (scan.scan_targets.target_ip) {
      doc.text(`IP: ${scan.scan_targets.target_ip}`, 20, 70);
    }

    // Scan Details
    doc.setFontSize(16);
    doc.text('Scan Details', 20, 90);
    doc.setFontSize(12);
    doc.text(`Scan ID: ${scan.id}`, 20, 100);
    doc.text(`Started: ${format(new Date(scan.started_at!), 'PPpp')}`, 20, 110);
    doc.text(`Completed: ${format(new Date(scan.completed_at!), 'PPpp')}`, 20, 120);

    // Findings Summary
    const findingsBySeverity = scan.scan_findings.reduce((acc, finding) => {
      if (!acc[finding.severity]) {
        acc[finding.severity] = [];
      }
      acc[finding.severity].push(finding);
      return acc;
    }, {} as Record<string, ScanFinding[]>);

    doc.setFontSize(16);
    doc.text('Findings Summary', 20, 140);
    doc.setFontSize(12);
    let yPos = 150;
    Object.entries(findingsBySeverity).forEach(([severity, findings]) => {
      doc.text(`${severity}: ${findings.length}`, 20, yPos);
      yPos += 10;
    });

    // Detailed Findings
    doc.setFontSize(16);
    doc.text('Detailed Findings', 20, yPos + 10);
    yPos += 20;

    scan.scan_findings.forEach((finding, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text(`${index + 1}. ${finding.title}`, 20, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      doc.text(`Severity: ${finding.severity}`, 30, yPos);
      yPos += 10;

      if (finding.description) {
        const descLines = doc.splitTextToSize(`Description: ${finding.description}`, pageWidth - 40);
        descLines.forEach((line: string) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 30, yPos);
          yPos += 10;
        });
      }

      if (finding.remediation) {
        const remLines = doc.splitTextToSize(`Remediation: ${finding.remediation}`, pageWidth - 40);
        remLines.forEach((line: string) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 30, yPos);
          yPos += 10;
        });
      }

      yPos += 10;
    });

    doc.save(`vulnerability-scan-report-${scan.id.slice(0, 8)}.pdf`);
  };

  const generateTextReport = (scan: VulnerabilityScan) => {
    const findingsBySeverity = scan.scan_findings.reduce((acc, finding) => {
      if (!acc[finding.severity]) {
        acc[finding.severity] = [];
      }
      acc[finding.severity].push(finding);
      return acc;
    }, {} as Record<string, ScanFinding[]>);

    const reportContent = `
Vulnerability Scan Report
========================

Target Information:
------------------
Name: ${scan.scan_targets.name}
${scan.scan_targets.target_url ? `URL: ${scan.scan_targets.target_url}` : ''}
${scan.scan_targets.target_ip ? `IP: ${scan.scan_targets.target_ip}` : ''}

Scan Details:
------------
Scan ID: ${scan.id}
Started: ${format(new Date(scan.started_at!), 'PPpp')}
Completed: ${format(new Date(scan.completed_at!), 'PPpp')}

Findings Summary:
----------------
${Object.entries(findingsBySeverity)
  .map(([severity, findings]) => `${severity}: ${findings.length}`)
  .join('\n')}

Detailed Findings:
-----------------
${Object.entries(findingsBySeverity)
  .map(
    ([severity, findings]) => `
${severity.toUpperCase()} Severity Findings:
${findings
  .map(
    (finding) => `
* ${finding.title}
  Description: ${finding.description || 'No description provided'}
  Remediation: ${finding.remediation || 'No remediation steps provided'}
`
  )
  .join('\n')}`
  )
  .join('\n')}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vulnerability-scan-report-${scan.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Security Reports</h1>
      <div className="mt-6">
        {scans?.map((scan) => (
          <div key={scan.id} className="mb-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Scan Results: {scan.scan_targets.name}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Completed {format(new Date(scan.completed_at!), 'PPpp')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => generatePDFReport(scan)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  PDF Report
                </button>
                <button
                  onClick={() => generateTextReport(scan)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Text Report
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-4">
                {scan.scan_findings
                  .sort((a, b) => {
                    const severityOrder = {
                      critical: 0,
                      high: 1,
                      medium: 2,
                      low: 3,
                      info: 4,
                    };
                    return severityOrder[a.severity as keyof typeof severityOrder] - 
                           severityOrder[b.severity as keyof typeof severityOrder];
                  })
                  .map((finding) => {
                    const SeverityIcon = severityIcons[finding.severity as keyof typeof severityIcons];
                    return (
                      <div
                        key={finding.id}
                        className="bg-white border rounded-lg shadow-sm p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <SeverityIcon
                              className={`h-5 w-5 mr-2 ${
                                severityColors[finding.severity as keyof typeof severityColors]
                              }`}
                            />
                            <h4 className="text-lg font-medium text-gray-900">
                              {finding.title}
                            </h4>
                          </div>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              severityBadgeColors[finding.severity as keyof typeof severityBadgeColors]
                            }`}
                          >
                            {finding.severity}
                          </span>
                        </div>
                        {finding.description && (
                          <p className="mt-2 text-sm text-gray-600">
                            {finding.description}
                          </p>
                        )}
                        {finding.remediation && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-900">
                              Remediation Steps:
                            </h5>
                            <p className="mt-1 text-sm text-gray-600">
                              {finding.remediation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}