import React, { useState } from 'react';
import { Plus, X, Save, Trash2, Power } from 'lucide-react';
import type { EventPattern } from '../../types/events';

interface EventPatternsProps {
  patterns: EventPattern[];
  isCreating: boolean;
  onPatternCreate: (pattern: EventPattern) => void;
  onPatternUpdate: (id: string, updates: Partial<EventPattern>) => void;
  onPatternDelete: (id: string) => void;
  onCancelCreate: () => void;
}

export function EventPatterns({
  patterns,
  isCreating,
  onPatternCreate,
  onPatternUpdate,
  onPatternDelete,
  onCancelCreate
}: EventPatternsProps) {
  const [newPattern, setNewPattern] = useState<Partial<EventPattern>>({
    events: [],
    condition: 'AND',
    threshold: {
      type: 'percentage',
      value: 0,
      timeWindow: 3600
    },
    priority: 'medium',
    domains: [],
    active: true
  });

  const handleCreate = () => {
    if (!newPattern.name || !newPattern.description) return;

    onPatternCreate({
      id: crypto.randomUUID(),
      ...newPattern as Required<EventPattern>
    });

    setNewPattern({
      events: [],
      condition: 'AND',
      threshold: {
        type: 'percentage',
        value: 0,
        timeWindow: 3600
      },
      priority: 'medium',
      domains: [],
      active: true
    });
  };

  return (
    <div className="space-y-6">
      {isCreating && (
        <div className="bg-[#3c3c3e] rounded-xl p-6 border border-[#4c4c4e]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white/90">New Event Pattern</h3>
            <button
              onClick={onCancelCreate}
              className="p-2 rounded-xl hover:bg-[#4c4c4e] text-white/60 hover:text-white/90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Pattern Name</label>
              <input
                type="text"
                value={newPattern.name || ''}
                onChange={e => setNewPattern(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
              <textarea
                value={newPattern.description || ''}
                onChange={e => setNewPattern(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Threshold Type</label>
                <select
                  value={newPattern.threshold?.type || 'percentage'}
                  onChange={e => setNewPattern(prev => ({
                    ...prev,
                    threshold: { ...prev.threshold!, type: e.target.value as 'percentage' | 'absolute' }
                  }))}
                  className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="percentage">Percentage</option>
                  <option value="absolute">Absolute</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Threshold Value</label>
                <input
                  type="number"
                  value={newPattern.threshold?.value || 0}
                  onChange={e => setNewPattern(prev => ({
                    ...prev,
                    threshold: { ...prev.threshold!, value: Number(e.target.value) }
                  }))}
                  className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Priority</label>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map(priority => (
                  <button
                    key={priority}
                    onClick={() => setNewPattern(prev => ({ ...prev, priority }))}
                    className={`flex-1 p-2 rounded-xl border capitalize transition-colors ${
                      newPattern.priority === priority
                        ? 'bg-blue-500 border-blue-600 text-white'
                        : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onCancelCreate}
                className="px-4 py-2 rounded-xl bg-[#2c2c2e] text-white/90 hover:bg-[#4c4c4e]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Pattern
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {patterns.map(pattern => (
          <div
            key={pattern.id}
            className="bg-[#3c3c3e] rounded-xl p-6 border border-[#4c4c4e]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-white/90">{pattern.name}</h3>
                <p className="text-sm text-white/60 mt-1">{pattern.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPatternUpdate(pattern.id, { active: !pattern.active })}
                  className={`p-2 rounded-xl transition-colors ${
                    pattern.active
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-[#2c2c2e] text-white/60'
                  }`}
                >
                  <Power className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onPatternDelete(pattern.id)}
                  className="p-2 rounded-xl hover:bg-red-500/20 text-white/60 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-white/60">Threshold</span>
                <p className="text-white/90">
                  {pattern.threshold.value}
                  {pattern.threshold.type === 'percentage' ? '%' : ''} in{' '}
                  {pattern.threshold.timeWindow / 60} minutes
                </p>
              </div>
              <div>
                <span className="text-sm text-white/60">Condition</span>
                <p className="text-white/90">{pattern.condition}</p>
              </div>
              <div>
                <span className="text-sm text-white/60">Priority</span>
                <p className={`text-white/90 capitalize ${
                  pattern.priority === 'high'
                    ? 'text-red-500'
                    : pattern.priority === 'medium'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}>
                  {pattern.priority}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-sm text-white/60">Events</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {pattern.events.map(event => (
                  <span
                    key={event}
                    className="px-2 py-1 rounded-lg bg-[#2c2c2e] text-white/90 text-sm"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}