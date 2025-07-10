import React, { useState } from 'react';
import { Plus, X, Save, Trash2, Power } from 'lucide-react';
import type { EventRule } from '../../types/events';

interface EventConfigurationProps {
  rules: EventRule[];
  onRuleCreate: (rule: EventRule) => void;
  onRuleUpdate: (id: string, updates: Partial<EventRule>) => void;
  onRuleDelete: (id: string) => void;
}

export function EventConfiguration({
  rules,
  onRuleCreate,
  onRuleUpdate,
  onRuleDelete
}: EventConfigurationProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState<Partial<EventRule>>({
    events: [],
    aggregation: {
      type: 'count',
      threshold: 1,
      timeWindow: 300
    },
    notification: {
      priority: 'medium',
      channels: ['message'],
      template: ''
    },
    active: true
  });

  const handleCreate = () => {
    if (!newRule.name || !newRule.description) return;

    onRuleCreate({
      id: crypto.randomUUID(),
      ...newRule as Required<EventRule>
    });

    setNewRule({
      events: [],
      aggregation: {
        type: 'count',
        threshold: 1,
        timeWindow: 300
      },
      notification: {
        priority: 'medium',
        channels: ['message'],
        template: ''
      },
      active: true
    });
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white/90">Notification Rules</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          New Rule
        </button>
      </div>

      {isCreating && (
        <div className="bg-[#3c3c3e] rounded-xl p-6 border border-[#4c4c4e]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white/90">New Notification Rule</h3>
            <button
              onClick={() => setIsCreating(false)}
              className="p-2 rounded-xl hover:bg-[#4c4c4e] text-white/60 hover:text-white/90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Rule Name</label>
              <input
                type="text"
                value={newRule.name || ''}
                onChange={e => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
              <textarea
                value={newRule.description || ''}
                onChange={e => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Aggregation Type</label>
                <select
                  value={newRule.aggregation?.type || 'count'}
                  onChange={e => setNewRule(prev => ({
                    ...prev,
                    aggregation: { ...prev.aggregation!, type: e.target.value as 'count' | 'sum' }
                  }))}
                  className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="count">Count</option>
                  <option value="sum">Sum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Threshold</label>
                <input
                  type="number"
                  value={newRule.aggregation?.threshold || 1}
                  onChange={e => setNewRule(prev => ({
                    ...prev,
                    aggregation: { ...prev.aggregation!, threshold: Number(e.target.value) }
                  }))}
                  className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Notification Template</label>
              <textarea
                value={newRule.notification?.template || ''}
                onChange={e => setNewRule(prev => ({
                  ...prev,
                  notification: { ...prev.notification!, template: e.target.value }
                }))}
                placeholder="Use {count} and {timeWindow} as placeholders"
                className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Notification Channels</label>
              <div className="flex gap-3">
                {['voice', 'message', 'alert'].map(channel => (
                  <button
                    key={channel}
                    onClick={() => {
                      const current = newRule.notification?.channels || [];
                      setNewRule(prev => ({
                        ...prev,
                        notification: {
                          ...prev.notification!,
                          channels: current.includes(channel)
                            ? current.filter(c => c !== channel)
                            : [...current, channel]
                        }
                      }));
                    }}
                    className={`flex-1 p-2 rounded-xl border capitalize transition-colors ${
                      newRule.notification?.channels?.includes(channel)
                        ? 'bg-blue-500 border-blue-600 text-white'
                        : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-[#2c2c2e] text-white/90 hover:bg-[#4c4c4e]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {rules.map(rule => (
          <div
            key={rule.id}
            className="bg-[#3c3c3e] rounded-xl p-6 border border-[#4c4c4e]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-white/90">{rule.name}</h3>
                <p className="text-sm text-white/60 mt-1">{rule.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRuleUpdate(rule.id, { active: !rule.active })}
                  className={`p-2 rounded-xl transition-colors ${
                    rule.active
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-[#2c2c2e] text-white/60'
                  }`}
                >
                  <Power className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onRuleDelete(rule.id)}
                  className="p-2 rounded-xl hover:bg-red-500/20 text-white/60 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-white/60">Aggregation</span>
                <p className="text-white/90">
                  {rule.aggregation.type === 'count' ? 'Count' : 'Sum'}{' '}
                  {rule.aggregation.threshold} in{' '}
                  {rule.aggregation.timeWindow / 60} minutes
                </p>
              </div>
              <div>
                <span className="text-sm text-white/60">Priority</span>
                <p className={`text-white/90 capitalize ${
                  rule.notification.priority === 'high'
                    ? 'text-red-500'
                    : rule.notification.priority === 'medium'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}>
                  {rule.notification.priority}
                </p>
              </div>
              <div>
                <span className="text-sm text-white/60">Channels</span>
                <div className="flex gap-2 mt-1">
                  {rule.notification.channels.map(channel => (
                    <span
                      key={channel}
                      className="px-2 py-1 rounded-lg bg-[#2c2c2e] text-white/90 text-sm capitalize"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-sm text-white/60">Events</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {rule.events.map(event => (
                  <span
                    key={event}
                    className="px-2 py-1 rounded-lg bg-[#2c2c2e] text-white/90 text-sm"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <span className="text-sm text-white/60">Template</span>
              <p className="text-white/90 mt-1">{rule.notification.template}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}