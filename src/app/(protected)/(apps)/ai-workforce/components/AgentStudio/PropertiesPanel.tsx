import React from 'react';
import { Settings, Key, AlertCircle, Plus, X } from 'lucide-react';
import type { AgentNode } from '../../types/agent-studio';

interface PropertiesPanelProps {
  selectedNode: AgentNode | null;
  onNodeUpdate: (updates: Partial<AgentNode>) => void;
  onNodeDelete?: (nodeId: string) => void;
}

export function PropertiesPanel({ selectedNode, onNodeUpdate, onNodeDelete }: PropertiesPanelProps) {
  const handleDataUpdate = (key: string, value: any) => {
    if (!selectedNode) return;
    onNodeUpdate({
      ...selectedNode,
      data: { ...selectedNode.data, [key]: value }
    });
  };

  if (!selectedNode) {
    return (
      <div className="text-center text-white/60 py-4">
        <Settings className="w-6 h-6 mx-auto mb-2" />
        <p>Select a node to configure its properties</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white/90">Properties</h3>
        {onNodeDelete && (
          <button
            onClick={() => onNodeDelete(selectedNode.id)}
            className="p-2 rounded-xl hover:bg-red-500/20 text-white/60 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Label</label>
        <input
          type="text"
          value={selectedNode.data.label}
          onChange={e => handleDataUpdate('label', e.target.value)}
          className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {selectedNode.type === 'gmail' && (
        <>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Gmail Action</label>
            <select
              value={selectedNode.data.gmailAction || 'send'}
              onChange={e => handleDataUpdate('gmailAction', e.target.value)}
              className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="send">Send Email</option>
              <option value="read">Read Emails</option>
              <option value="search">Search Emails</option>
              <option value="draft">Create Draft</option>
            </select>
          </div>

          {selectedNode.data.gmailAction === 'send' && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">To</label>
                <input
                  type="text"
                  value={selectedNode.data.emailTemplate?.to || ''}
                  onChange={e => handleDataUpdate('emailTemplate', {
                    ...selectedNode.data.emailTemplate,
                    to: e.target.value
                  })}
                  placeholder="recipient@example.com"
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Subject</label>
                <input
                  type="text"
                  value={selectedNode.data.emailTemplate?.subject || ''}
                  onChange={e => handleDataUpdate('emailTemplate', {
                    ...selectedNode.data.emailTemplate,
                    subject: e.target.value
                  })}
                  placeholder="Email subject"
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Body</label>
                <textarea
                  value={selectedNode.data.emailTemplate?.body || ''}
                  onChange={e => handleDataUpdate('emailTemplate', {
                    ...selectedNode.data.emailTemplate,
                    body: e.target.value
                  })}
                  placeholder="Email body"
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Attachments</label>
                <input
                  type="text"
                  value={selectedNode.data.emailTemplate?.attachments?.join(', ') || ''}
                  onChange={e => handleDataUpdate('emailTemplate', {
                    ...selectedNode.data.emailTemplate,
                    attachments: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Comma-separated file paths or URLs"
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </>
          )}

          {(selectedNode.data.gmailAction === 'read' || selectedNode.data.gmailAction === 'search') && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Search Query</label>
                <input
                  type="text"
                  value={selectedNode.data.gmailQuery || ''}
                  onChange={e => handleDataUpdate('gmailQuery', e.target.value)}
                  placeholder="in:inbox is:unread"
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Labels</label>
                <input
                  type="text"
                  value={selectedNode.data.gmailLabels?.join(', ') || ''}
                  onChange={e => handleDataUpdate('gmailLabels', 
                    e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  )}
                  placeholder="INBOX, UNREAD, IMPORTANT"
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Authentication</label>
            <select
              value={selectedNode.data.authentication?.type || 'oauth2'}
              onChange={e => handleDataUpdate('authentication', {
                type: e.target.value,
                credentials: {}
              })}
              className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="oauth2">OAuth 2.0</option>
              <option value="api_key">API Key</option>
              <option value="service_account">Service Account</option>
            </select>
          </div>

          {selectedNode.data.authentication?.type === 'oauth2' && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Client ID</label>
                <input
                  type="text"
                  value={selectedNode.data.authentication?.credentials?.clientId || ''}
                  onChange={e => handleDataUpdate('authentication', {
                    ...selectedNode.data.authentication,
                    credentials: {
                      ...selectedNode.data.authentication?.credentials,
                      clientId: e.target.value
                    }
                  })}
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Client Secret</label>
                <input
                  type="password"
                  value={selectedNode.data.authentication?.credentials?.clientSecret || ''}
                  onChange={e => handleDataUpdate('authentication', {
                    ...selectedNode.data.authentication,
                    credentials: {
                      ...selectedNode.data.authentication?.credentials,
                      clientSecret: e.target.value
                    }
                  })}
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </>
          )}

          {selectedNode.data.authentication?.type === 'api_key' && (
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">API Key</label>
              <input
                type="password"
                value={selectedNode.data.authentication?.credentials?.apiKey || ''}
                onChange={e => handleDataUpdate('authentication', {
                  ...selectedNode.data.authentication,
                  credentials: {
                    apiKey: e.target.value
                  }
                })}
                className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}

          {selectedNode.data.authentication?.type === 'service_account' && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Service Account Email</label>
                <input
                  type="text"
                  value={selectedNode.data.authentication?.credentials?.serviceAccountEmail || ''}
                  onChange={e => handleDataUpdate('authentication', {
                    ...selectedNode.data.authentication,
                    credentials: {
                      ...selectedNode.data.authentication?.credentials,
                      serviceAccountEmail: e.target.value
                    }
                  })}
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Private Key</label>
                <textarea
                  value={selectedNode.data.authentication?.credentials?.privateKey || ''}
                  onChange={e => handleDataUpdate('authentication', {
                    ...selectedNode.data.authentication,
                    credentials: {
                      ...selectedNode.data.authentication?.credentials,
                      privateKey: e.target.value
                    }
                  })}
                  placeholder="-----BEGIN PRIVATE KEY-----..."
                  className="w-full bg-[#3c3c3e] rounded-xl px-4 py-2 text-white/90 border border-[#4c4c4e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 font-mono"
                  rows={4}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}