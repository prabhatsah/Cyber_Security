import React, { memo } from 'react';
import { Position } from 'reactflow';
import { Cpu } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const ProcessingNode = memo(({ data, isConnectable }: any) => (
  <BaseNode
    data={{
      ...data,
      icon: <Cpu className="w-4 h-4 text-purple-500" />
    }}
    isConnectable={isConnectable}
    sourcePosition={Position.Right}
    targetPosition={Position.Left}
  />
));

ProcessingNode.displayName = 'ProcessingNode';