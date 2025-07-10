export interface EventHistoryItem {
  id: string;
  event: string;
  message: string;
  timestamp: Date;
  domain: string;
  priority: 'low' | 'medium' | 'high';
  agentId: string;
  acknowledged: boolean;
}

export interface EventPattern {
  id: string;
  name: string;
  description: string;
  events: string[];
  condition: 'AND' | 'OR';
  threshold: {
    type: 'percentage' | 'absolute';
    value: number;
    timeWindow: number; // in seconds
  };
  priority: 'low' | 'medium' | 'high';
  domains: string[];
  active: boolean;
}

export interface EventRule {
  id: string;
  name: string;
  description: string;
  events: string[];
  aggregation: {
    type: 'count' | 'sum';
    threshold: number;
    timeWindow: number; // in seconds
  };
  notification: {
    priority: 'low' | 'medium' | 'high';
    channels: ('voice' | 'message' | 'alert')[];
    template: string;
  };
  active: boolean;
}