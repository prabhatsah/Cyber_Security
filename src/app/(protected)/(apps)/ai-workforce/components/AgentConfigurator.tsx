import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { AgentConfiguration } from '../types/agent';

interface AgentConfiguratorProps {
  config: AgentConfiguration;
  onSave: (config: AgentConfiguration) => void;
  onCancel: () => void;
}

export function AgentConfigurator({ config, onSave, onCancel }: AgentConfiguratorProps) {
  const [configuration, setConfiguration] = useState<AgentConfiguration>(config);

  return (
    <div className="bg-[#1c1c1e] rounded-3xl border border-[#2c2c2e] p-6 w-[500px] max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white/90">Agent Configuration</h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl hover:bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Language</label>
          <select
            value={configuration.language}
            onChange={e => setConfiguration(prev => ({ ...prev, language: e.target.value }))}
            className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Response Style</label>
          <div className="grid grid-cols-3 gap-3">
            {['concise', 'detailed', 'technical'].map(style => (
              <button
                key={style}
                onClick={() => setConfiguration(prev => ({ ...prev, responseStyle: style as any }))}
                className={`p-3 rounded-xl border capitalize transition-colors ${
                  configuration.responseStyle === style
                    ? 'bg-blue-500 border-blue-600 text-white'
                    : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Autonomy Level</label>
          <div className="grid grid-cols-3 gap-3">
            {['supervised', 'semi-autonomous', 'autonomous'].map(level => (
              <button
                key={level}
                onClick={() => setConfiguration(prev => ({ ...prev, autonomyLevel: level as any }))}
                className={`p-3 rounded-xl border capitalize transition-colors ${
                  configuration.autonomyLevel === level
                    ? 'bg-blue-500 border-blue-600 text-white'
                    : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
                }`}
              >
                {level.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Learning</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfiguration(prev => ({ ...prev, learningEnabled: true }))}
              className={`flex-1 p-3 rounded-xl border transition-colors ${
                configuration.learningEnabled
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
              }`}
            >
              Enabled
            </button>
            <button
              onClick={() => setConfiguration(prev => ({ ...prev, learningEnabled: false }))}
              className={`flex-1 p-3 rounded-xl border transition-colors ${
                !configuration.learningEnabled
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
              }`}
            >
              Disabled
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Max Concurrent Tasks</label>
          <input
            type="number"
            min="1"
            max="10"
            value={configuration.maxConcurrentTasks}
            onChange={e => setConfiguration(prev => ({ ...prev, maxConcurrentTasks: parseInt(e.target.value) }))}
            className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Allowed Actions</label>
          <div className="space-y-2">
            {['message', 'query', 'analyze', 'execute', 'schedule'].map(action => (
              <label key={action} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={configuration.allowedActions.includes(action)}
                  onChange={e => {
                    const checked = e.target.checked;
                    setConfiguration(prev => ({
                      ...prev,
                      allowedActions: checked
                        ? [...prev.allowedActions, action]
                        : prev.allowedActions.filter(a => a !== action)
                    }));
                  }}
                  className="rounded border-[#3c3c3e] bg-[#2c2c2e] text-blue-500 focus:ring-blue-500/20"
                />
                <span className="text-white/90 capitalize">{action}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(configuration)}
            className="flex-1 bg-blue-500 text-white rounded-xl py-3 hover:bg-blue-600 transition-colors"
          >
            Save Configuration
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-[#2c2c2e] text-white/90 rounded-xl py-3 hover:bg-[#3c3c3e] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}