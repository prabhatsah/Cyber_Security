'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Activity, User, Globe, AlertTriangle, Shield, FileText, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

const actionIcons = {
  scan_started: Shield,
  scan_completed: Shield,
  scan_failed: AlertTriangle,
  target_created: Globe,
  target_updated: Globe,
  target_deleted: Globe,
  finding_created: AlertTriangle,
  finding_updated: AlertTriangle,
  report_generated: FileText,
  login_success: LogIn,
  login_failed: LogIn,
  logout: LogIn,
};

const actionColors = {
  scan_started: 'text-blue-600',
  scan_completed: 'text-green-600',
  scan_failed: 'text-red-600',
  target_created: 'text-purple-600',
  target_updated: 'text-purple-600',
  target_deleted: 'text-purple-600',
  finding_created: 'text-orange-600',
  finding_updated: 'text-orange-600',
  report_generated: 'text-gray-600',
  login_success: 'text-green-600',
  login_failed: 'text-red-600',
  logout: 'text-gray-600',
};

export function AuditLog() {
  const { data: auditLogs, isLoading, error } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        return data;
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
      }
    },
    retry: false, // Disable retries for now since we know it's a configuration issue
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading audit logs
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Please ensure you have:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Connected to Supabase (click "Connect to Supabase" button)</li>
                  <li>Created the required database tables</li>
                  <li>Set up proper authentication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Getting Started
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                To start using the audit log feature, you need to:
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Log</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track all security-related activities and system events
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs?.map((log) => {
                const ActionIcon = actionIcons[log.action as keyof typeof actionIcons] || Activity;
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(log.created_at), 'PPpp')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ActionIcon 
                          className={`h-5 w-5 mr-2 ${
                            actionColors[log.action as keyof typeof actionColors]
                          }`} 
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {log.action.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm">
                          {log.profiles ? (
                            <>
                              <div className="font-medium text-gray-900">
                                {log.profiles.full_name}
                              </div>
                              <div className="text-gray-500">
                                {log.profiles.email}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-500">System</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Object.entries(log.details).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span>{' '}
                            {typeof value === 'object' 
                              ? JSON.stringify(value) 
                              : String(value)
                            }
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ip_address || 'N/A'}
                    </td>
                  </tr>
                );
              })}
              {(!auditLogs || auditLogs.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No audit logs found. Activity will appear here as you use the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}