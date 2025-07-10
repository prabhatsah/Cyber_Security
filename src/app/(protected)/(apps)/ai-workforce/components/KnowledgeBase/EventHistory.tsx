import React from 'react';
import { Check, AlertTriangle, Clock } from 'lucide-react';
import type { EventHistoryItem } from '../../types/events';

interface EventHistoryProps {
  events: EventHistoryItem[];
  onEventAcknowledge: (id: string) => void;
}

export function EventHistory({ events, onEventAcknowledge }: EventHistoryProps) {
  return (
    <div className="space-y-4">
      {events.map(event => (
        <div
          key={event.id}
          className={`p-4 rounded-xl border ${
            event.acknowledged
              ? 'bg-[#3c3c3e] border-[#4c4c4e]'
              : 'bg-blue-500/10 border-blue-500/20'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              event.priority === 'high'
                ? 'bg-red-500/20'
                : event.priority === 'medium'
                ? 'bg-yellow-500/20'
                : 'bg-green-500/20'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                event.priority === 'high'
                  ? 'text-red-500'
                  : event.priority === 'medium'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white/90">{event.event}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                  {!event.acknowledged && (
                    <button
                      onClick={() => onEventAcknowledge(event.id)}
                      className="p-1 rounded-lg hover:bg-[#4c4c4e] text-white/60 hover:text-white/90 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-white/80 mt-1">{event.message}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-[#3c3c3e] text-white/60">
                  {event.domain}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}