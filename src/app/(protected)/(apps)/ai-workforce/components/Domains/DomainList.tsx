import React from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { Domain, SubDomain } from '../../types/agent';

interface DomainListProps {
  domains: Domain[];
  subDomains: SubDomain[];
  selectedDomain: string | null;
  expandedDomains: string[];
  onDomainSelect: (domainId: string) => void;
  onDomainExpand: (domainId: string) => void;
  onDomainDelete: (domainId: string) => void;
  onSubDomainCreate: (domainId: string) => void;
  onSubDomainDelete: (subDomainId: string) => void;
}

export function DomainList({
  domains,
  subDomains,
  selectedDomain,
  expandedDomains,
  onDomainSelect,
  onDomainExpand,
  onDomainDelete,
  onSubDomainCreate,
  onSubDomainDelete
}: DomainListProps) {
  return (
    <div className="space-y-2">
      {domains.map(domain => (
        <div key={domain.id} className="space-y-2">
          <div
            className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
              domain.id === selectedDomain
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <button
              onClick={() => {
                onDomainExpand(domain.id);
                onDomainSelect(domain.id);
              }}
              className="flex-1 flex items-center gap-3"
            >
              {domain.icon}
              <span className="text-left">{domain.name}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedDomains.includes(domain.id) ? 'rotate-180' : ''
                }`}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSubDomainCreate(domain.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-blue-500/20 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4 text-blue-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDomainDelete(domain.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
          
          {expandedDomains.includes(domain.id) && (
            <div className="ml-6 space-y-2">
              {subDomains
                .filter(sd => sd.parentId === domain.id)
                .map(subDomain => (
                  <div
                    key={subDomain.id}
                    className="group flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full bg-current"></div>
                      <span>{subDomain.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubDomainDelete(subDomain.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}