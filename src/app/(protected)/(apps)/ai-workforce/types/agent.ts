export interface Task {
  id: string;
  name: string;
  description: string;
  type: 'scheduled' | 'on-demand' | 'event-triggered';
  schedule?: string; // Cron expression for scheduled tasks
  trigger?: string; // Event trigger condition
  steps: TaskStep[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun?: Date;
  nextRun?: Date;
}

export interface TaskStep {
  id: string;
  name: string;
  description: string;
  action: string;
  parameters: Record<string, any>;
  order: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'idle' | 'busy';
  specialty: string;
  domainId: string;
  appId?: string;
  tasks?: Task[];
  capabilities?: string[];
  configuration?: AgentConfiguration;
}

export interface AgentConfiguration {
  language: string;
  responseStyle: 'concise' | 'detailed' | 'technical';
  autonomyLevel: 'supervised' | 'semi-autonomous' | 'autonomous';
  learningEnabled: boolean;
  maxConcurrentTasks: number;
  allowedActions: string[];
}

export interface PersonalAssistant {
  id: string;
  name: string;
  gender: 'male' | 'female';
  avatar: string;
  voice: Voice;
  notificationPreferences: NotificationPreference[];
}

export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: string;
  accent?: string;
}

export interface NotificationPreference {
  agentId: string;
  appId?: string;
  events: string[];
  priority: 'low' | 'medium' | 'high';
  notifyVia: ('voice' | 'message' | 'alert')[];
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
}

export interface CreateDomainForm {
  name: string;
  description: string;
}

export interface CreateSubDomainForm {
  name: string;
  description: string;
  parentId: string;
}

export interface CreateAppForm {
  name: string;
  description: string;
}

export interface CreateAgentForm {
  name: string;
  role: string;
  specialty: string;
  domainId: string;
  subDomainId?: string;
  appId?: string;
}