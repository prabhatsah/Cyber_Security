import React from 'react';
import { FileInput as Input, FileOutput as Output, GitBranch, Database, Globe, Cpu, Webhook, Mail, Calendar, FileClock as FileCloud, MessageSquare, Github, Brain } from 'lucide-react';
import type { NodeType } from '../../types/agent-studio';

interface ToolboxPanelProps {
  onNodeAdd: (type: NodeType) => void;
}

const nodeTypes = [
  { type: 'input', label: 'Input', icon: Input, color: 'text-blue-500' },
  { type: 'processing', label: 'Processing', icon: Cpu, color: 'text-purple-500' },
  { type: 'output', label: 'Output', icon: Output, color: 'text-green-500' },
  { type: 'decision', label: 'Decision', icon: GitBranch, color: 'text-yellow-500' },
  { type: 'api', label: 'API', icon: Globe, color: 'text-orange-500' },
  { type: 'database', label: 'Database', icon: Database, color: 'text-red-500' },
  { type: 'webhook', label: 'Webhook', icon: Webhook, color: 'text-pink-500' },
  { type: 'gmail', label: 'Gmail', icon: Mail, color: 'text-red-500' },
  { type: 'gcalendar', label: 'Calendar', icon: Calendar, color: 'text-blue-500' },
  { type: 'gdrive', label: 'Drive', icon: FileCloud, color: 'text-yellow-500' },
  { type: 'slack', label: 'Slack', icon: MessageSquare, color: 'text-green-500' },
  { type: 'github', label: 'GitHub', icon: Github, color: 'text-gray-500' },
  { type: 'openai', label: 'OpenAI', icon: Brain, color: 'text-green-500' },
  { type: 'buffer', label: 'Buffer', icon: Database, color: 'text-yellow-500' },
  { type: 'memory', label: 'Memory', icon: Cpu, color: 'text-purple-500' }
] as const;

export function ToolboxPanel({ onNodeAdd }: ToolboxPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white/90">Components</h3>
      <div className="space-y-2">
        {nodeTypes.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => onNodeAdd(type)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#3c3c3e] hover:bg-[#4c4c4e] transition-colors"
          >
            <div className="p-2 rounded-lg bg-[#2c2c2e]">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}