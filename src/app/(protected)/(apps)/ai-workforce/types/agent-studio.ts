import { Node, Edge } from 'reactflow';

export type NodeType = 'input' | 'processing' | 'output' | 'decision' | 'api' | 'database' | 'webhook' | 'gmail' | 'gcalendar' | 'gdrive' | 'slack' | 'github' | 'openai' | 'buffer' | 'memory';

export interface NodeData {
  label: string;
  // Processing node types
  processingType?: 'transform' | 'filter' | 'aggregate' | 'custom';
  transformFunction?: string;
  filterCondition?: string;
  aggregateFunction?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  
  // API node
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: string;
  authentication?: {
    type: 'none' | 'basic' | 'bearer' | 'oauth2';
    credentials?: Record<string, string>;
  };
  
  // Database node
  dbType?: 'postgres' | 'mysql' | 'mongodb' | 'redis';
  query?: string;
  operation?: 'read' | 'write' | 'update' | 'delete';
  table?: string;
  fields?: string[];
  
  // Decision node
  condition?: string;
  branches?: {
    true: string;
    false: string;
  };
  
  // Input/Output
  dataType?: 'json' | 'text' | 'binary' | 'number';
  format?: string;
  validation?: {
    required?: boolean;
    schema?: string;
  };

  // Webhook node
  webhookUrl?: string;
  webhookMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  webhookHeaders?: Record<string, string>;
  webhookPayload?: string;
  webhookTimeout?: number;

  // Gmail node
  gmailAction?: 'send' | 'read' | 'search' | 'draft';
  gmailQuery?: string;
  gmailLabels?: string[];
  emailTemplate?: {
    to: string;
    subject: string;
    body: string;
    attachments?: string[];
  };

  // Google Calendar node
  calendarAction?: 'create' | 'update' | 'delete' | 'list';
  calendarId?: string;
  eventDetails?: {
    summary: string;
    description?: string;
    start: string;
    end: string;
    attendees?: string[];
    location?: string;
  };

  // Google Drive node
  driveAction?: 'upload' | 'download' | 'list' | 'delete';
  driveFolderId?: string;
  driveFileId?: string;
  driveFileName?: string;
  driveFileType?: string;

  // Slack node
  slackAction?: 'message' | 'file' | 'reaction' | 'search';
  slackChannel?: string;
  slackMessage?: string;
  slackThreadTs?: string;
  slackReaction?: string;

  // GitHub node
  githubAction?: 'issue' | 'pr' | 'commit' | 'release';
  githubRepo?: string;
  githubOwner?: string;
  issueDetails?: {
    title: string;
    body: string;
    labels?: string[];
    assignees?: string[];
  };
  prDetails?: {
    title: string;
    body: string;
    base: string;
    head: string;
  };

  // OpenAI node
  openaiModel?: string;
  openaiPrompt?: string;
  openaiTemperature?: number;
  openaiMaxTokens?: number;
  openaiStop?: string[];
  openaiPresencePenalty?: number;
  openaiFrequencyPenalty?: number;
  openaiSystemMessage?: string;
  openaiFunction?: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };

  // Buffer node
  bufferSize?: number;
  bufferType?: 'fifo' | 'lifo';
  bufferOverflowBehavior?: 'drop' | 'error';
  bufferData?: any[];

  // Memory node
  memoryType?: 'key-value' | 'conversation' | 'vector';
  memoryKey?: string;
  memoryTTL?: number;
  memoryData?: Record<string, any>;
  memoryContext?: string[];
  memoryMaxSize?: number;
  vectorDimensions?: number;
  similarityThreshold?: number;
}

export interface AgentNode extends Node {
  type: NodeType;
  data: NodeData;
}

export interface AgentEdge extends Edge {
  condition?: string;
  transform?: string;
}

export interface ModelConfig {
  baseModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}