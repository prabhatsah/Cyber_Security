import React from 'react';
import { Trash2 } from 'lucide-react';
import type { App } from '../../types/agent';

interface AppListProps {
  apps: App[];
  selectedApp: string | null;
  onAppSelect: (appId: string) => void;
  onAppDelete: (appId: string) => void;
}

export function AppList({ apps, selectedApp, onAppSelect, onAppDelete }: AppListProps) {
  return (
    <div className="space-y-2">
      {apps.map(app => (
        <div
          key={app.id}
          className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${app.id === selectedApp
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
            }`}
        >
          <button
            onClick={() => onAppSelect(app.id)}
            className="flex-1 flex items-center gap-3"
          >
            {app.icon}
            <span className="text-left">{app.name}</span>
          </button>
          <button
            onClick={() => onAppDelete(app.id)}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
}