import React from 'react';
import { Brain, Thermometer, Hash, Zap, Repeat, Scale } from 'lucide-react';
import type { ModelConfig } from '../../types/agent-studio';

interface ModelConfiguratorProps {
  config: ModelConfig;
  onChange: (config: ModelConfig) => void;
}

export function ModelConfigurator({ config, onChange }: ModelConfiguratorProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/10 rounded-xl">
          <Brain className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Model Configuration</h2>
          <p className="text-white/60">Fine-tune your AI model parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Base Model</label>
            <select
              value={config.baseModel}
              onChange={e => onChange({ ...config, baseModel: e.target.value })}
              className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-2">Claude 2</option>
              <option value="llama-2">Llama 2</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white/60">Temperature</label>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/90">{config.temperature}</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={e => onChange({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>Deterministic</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white/60">Max Tokens</label>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/90">{config.maxTokens}</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="4096"
              step="1"
              value={config.maxTokens}
              onChange={e => onChange({ ...config, maxTokens: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white/60">Top P</label>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/90">{config.topP}</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onChange={e => onChange({ ...config, topP: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white/60">Frequency Penalty</label>
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/90">{config.frequencyPenalty}</span>
              </div>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={config.frequencyPenalty}
              onChange={e => onChange({ ...config, frequencyPenalty: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white/60">Presence Penalty</label>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/90">{config.presencePenalty}</span>
              </div>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={config.presencePenalty}
              onChange={e => onChange({ ...config, presencePenalty: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
        <h3 className="text-lg font-medium text-white/90 mb-2">Parameter Explanation</h3>
        <div className="space-y-2 text-sm text-white/60">
          <p><strong>Temperature:</strong> Controls randomness in the output. Higher values make the output more creative but less predictable.</p>
          <p><strong>Max Tokens:</strong> The maximum length of the generated response.</p>
          <p><strong>Top P:</strong> Controls diversity via nucleus sampling. Lower values make the output more focused.</p>
          <p><strong>Frequency Penalty:</strong> Reduces repetition by penalizing tokens based on their frequency in the text.</p>
          <p><strong>Presence Penalty:</strong> Reduces repetition by penalizing tokens that have appeared in the text at all.</p>
        </div>
      </div>
    </div>
  );
}