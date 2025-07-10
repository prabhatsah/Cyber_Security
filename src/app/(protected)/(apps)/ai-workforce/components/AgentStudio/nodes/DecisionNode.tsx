import React, { memo } from 'react';
import { Position } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const DecisionNode = memo(({ data, isConnectable }: any) => (
  <BaseNode
    data={{
      ...data,
      icon: <GitBranch className="w-4 h-4 text-yellow-500" />
    }}
    isConnectable={isConnectable}
    sourcePosition={Position.Right}
    targetPosition={Position.Left}
  />
));

DecisionNode.displayName = 'DecisionNode';