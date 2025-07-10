import React, { memo } from 'react';
import { Position } from 'reactflow';
import { Mail, Key, AlertCircle } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const GmailNode = memo(({ data, isConnectable }: any) => {
  // Check if authentication is configured
  const hasAuth = data.authentication?.credentials && (
    (data.authentication.type === 'oauth2' && 
     data.authentication.credentials.clientId && 
     data.authentication.credentials.clientSecret) ||
    (data.authentication.type === 'api_key' && 
     data.authentication.credentials.apiKey) ||
    (data.authentication.type === 'service_account' && 
     data.authentication.credentials.serviceAccountEmail && 
     data.authentication.credentials.privateKey)
  );

  // Check if required action properties are set
  const hasRequiredProps = data.gmailAction && (
    (data.gmailAction === 'send' && 
     data.emailTemplate?.to && 
     data.emailTemplate?.subject) ||
    (data.gmailAction === 'read' || 
     data.gmailAction === 'search' || 
     data.gmailAction === 'draft')
  );

  return (
    <BaseNode
      data={{
        ...data,
        icon: (
          <div className="relative">
            <Mail className="w-4 h-4 text-red-500" />
            {!hasAuth ? (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#2c2c2e] rounded-full flex items-center justify-center">
                <Key className="w-2 h-2 text-yellow-500" />
              </div>
            ) : !hasRequiredProps ? (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#2c2c2e] rounded-full flex items-center justify-center">
                <AlertCircle className="w-2 h-2 text-orange-500" />
              </div>
            ) : (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </div>
        )
      }}
      isConnectable={isConnectable}
      sourcePosition={Position.Right}
      targetPosition={Position.Left}
    />
  );
});

GmailNode.displayName = 'GmailNode';