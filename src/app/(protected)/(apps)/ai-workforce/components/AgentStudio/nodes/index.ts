import { InputNode } from './InputNode';
import { ProcessingNode } from './ProcessingNode';
import { OutputNode } from './OutputNode';
import { DecisionNode } from './DecisionNode';
import { APINode } from './APINode';
import { DatabaseNode } from './DatabaseNode';
import { GmailNode } from './GmailNode';

export const nodeTypes = {
  input: InputNode,
  processing: ProcessingNode,
  output: OutputNode,
  decision: DecisionNode,
  api: APINode,
  database: DatabaseNode,
  gmail: GmailNode
};