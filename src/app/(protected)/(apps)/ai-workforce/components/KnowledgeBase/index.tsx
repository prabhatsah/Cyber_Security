import React, { useState } from 'react';
import { Book, Filter, AlertTriangle, Clock, Zap, Settings, Info, ChevronDown, Search, Plus } from 'lucide-react';
import { EventHistory } from './EventHistory';
import { EventPatterns } from './EventPatterns';
import { EventConfiguration } from './EventConfiguration';
import type { EventPattern, EventHistoryItem, EventRule } from '../../types/events';

export function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<'history' | 'patterns' | 'config'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [isCreatingPattern, setIsCreatingPattern] = useState(false);

  const [eventHistory, setEventHistory] = useState<EventHistoryItem[]>([
    {
      id: '1',
      event: 'data.anomaly',
      message: 'Unusual pattern detected in financial data: 25% spike in transaction volume',
      timestamp: new Date(),
      domain: 'finance',
      priority: 'high',
      agentId: '1',
      acknowledged: true
    },
    // Add more historical events...
  ]);

  const [eventPatterns, setEventPatterns] = useState<EventPattern[]>([
    {
      id: '1',
      name: 'High Volume Transactions',
      description: 'Detect unusual spikes in transaction volume',
      events: ['transaction.volume', 'transaction.frequency'],
      condition: 'AND',
      threshold: {
        type: 'percentage',
        value: 25,
        timeWindow: 3600 // 1 hour in seconds
      },
      priority: 'high',
      domains: ['finance'],
      active: true
    },
    // Add more patterns...
  ]);

  const [eventRules, setEventRules] = useState<EventRule[]>([
    {
      id: '1',
      name: 'Critical System Events',
      description: 'Aggregate critical system events before notification',
      events: ['system.error', 'system.critical'],
      aggregation: {
        type: 'count',
        threshold: 3,
        timeWindow: 300 // 5 minutes in seconds
      },
      notification: {
        priority: 'high',
        channels: ['voice', 'message'],
        template: 'Multiple critical system events detected: {count} events in the last {timeWindow}'
      },
      active: true
    },
    // Add more rules...
  ]);

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Book className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Knowledge Base</h1>
              <p className="text-white/60">Event Management and Pattern Recognition</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#2c2c2e] rounded-xl pl-10 pr-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 w-64"
              />
            </div>
            <button
              onClick={() => setIsCreatingPattern(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Pattern
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white'
                : 'bg-[#2c2c2e] text-white/60 hover:text-white/90'
            }`}
          >
            <Clock className="w-5 h-5" />
            Event History
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'patterns'
                ? 'bg-blue-500 text-white'
                : 'bg-[#2c2c2e] text-white/60 hover:text-white/90'
            }`}
          >
            <Zap className="w-5 h-5" />
            Event Patterns
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'config'
                ? 'bg-blue-500 text-white'
                : 'bg-[#2c2c2e] text-white/60 hover:text-white/90'
            }`}
          >
            <Settings className="w-5 h-5" />
            Configuration
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Filters:</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setSelectedDomain(null)}
              className="flex items-center gap-2 bg-[#2c2c2e] px-4 py-2 rounded-xl text-white/90 hover:bg-[#3c3c3e] transition-colors"
            >
              Domain
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setSelectedPriority(null)}
              className="flex items-center gap-2 bg-[#2c2c2e] px-4 py-2 rounded-xl text-white/90 hover:bg-[#3c3c3e] transition-colors"
            >
              Priority
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#2c2c2e] rounded-3xl border border-[#3c3c3e] p-6">
          {activeTab === 'history' && (
            <EventHistory
              events={eventHistory}
              onEventAcknowledge={(id) => {
                setEventHistory(prev =>
                  prev.map(event =>
                    event.id === id ? { ...event, acknowledged: true } : event
                  )
                );
              }}
            />
          )}
          {activeTab === 'patterns' && (
            <EventPatterns
              patterns={eventPatterns}
              onPatternCreate={(pattern) => {
                setEventPatterns(prev => [...prev, pattern]);
                setIsCreatingPattern(false);
              }}
              onPatternUpdate={(id, updates) => {
                setEventPatterns(prev =>
                  prev.map(pattern =>
                    pattern.id === id ? { ...pattern, ...updates } : pattern
                  )
                );
              }}
              onPatternDelete={(id) => {
                setEventPatterns(prev => prev.filter(pattern => pattern.id !== id));
              }}
              isCreating={isCreatingPattern}
              onCancelCreate={() => setIsCreatingPattern(false)}
            />
          )}
          {activeTab === 'config' && (
            <EventConfiguration
              rules={eventRules}
              onRuleCreate={(rule) => {
                setEventRules(prev => [...prev, rule]);
              }}
              onRuleUpdate={(id, updates) => {
                setEventRules(prev =>
                  prev.map(rule =>
                    rule.id === id ? { ...rule, ...updates } : rule
                  )
                );
              }}
              onRuleDelete={(id) => {
                setEventRules(prev => prev.filter(rule => rule.id !== id));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}