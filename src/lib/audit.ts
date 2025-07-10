import { supabase } from './supabase';

export type AuditAction = 
  | 'scan_started'
  | 'scan_completed'
  | 'scan_failed'
  | 'target_created'
  | 'target_updated'
  | 'target_deleted'
  | 'finding_created'
  | 'finding_updated'
  | 'report_generated'
  | 'login_success'
  | 'login_failed'
  | 'logout';

export interface AuditLogEntry {
  action: AuditAction;
  details: Record<string, any>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
}

// In-memory queue for failed audit logs
const failedLogs: AuditLogEntry[] = [];
let retryTimeout: NodeJS.Timeout | null = null;

// Function to retry sending failed logs
async function retryFailedLogs() {
  if (failedLogs.length === 0) return;

  const logs = [...failedLogs];
  failedLogs.length = 0; // Clear the queue

  for (const log of logs) {
    try {
      await logAuditEvent(log, true);
    } catch (error) {
      // If still failing, add back to queue
      failedLogs.push(log);
    }
  }

  // Schedule next retry if there are still failed logs
  if (failedLogs.length > 0 && !retryTimeout) {
    retryTimeout = setTimeout(() => {
      retryTimeout = null;
      retryFailedLogs();
    }, 60000); // Retry every minute
  }
}

export async function logAuditEvent(entry: AuditLogEntry, isRetry = false) {
  try {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Get client IP (in a real production environment, this would come from your server)
    const ipAddress = entry.ip_address || 'Unknown';

    // Get user agent
    const userAgent = window.navigator.userAgent;

    const { data, error } = await supabase
      .from('audit_logs')
      .insert([{
        action: entry.action,
        details: entry.details,
        user_id: entry.user_id || userId,
        ip_address: ipAddress,
        user_agent: userAgent,
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    // Only log to console in development
    if (import.meta.env.DEV) {
      console.warn('Failed to log audit event:', error);
    }

    // If this isn't already a retry attempt, queue the log for retry
    if (!isRetry) {
      failedLogs.push(entry);
      
      // Start retry process if not already running
      if (!retryTimeout) {
        retryTimeout = setTimeout(() => {
          retryTimeout = null;
          retryFailedLogs();
        }, 5000); // First retry after 5 seconds
      }
    }

    // Return a minimal response to prevent breaking the application flow
    return {
      id: 'pending',
      action: entry.action,
      details: entry.details,
      created_at: new Date().toISOString(),
    };
  }
}