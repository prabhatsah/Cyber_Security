import React, { memo } from 'react';
import { Position } from 'reactflow';
import { Database } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const DatabaseNode = memo(({ data, isConnectable }: any) => (
  <BaseNode
    data={{
      ...data,
      icon: <Database className="w-4 h-4 text-red-500" />
    }}
    isConnectable={isConnectable}
    sourcePosition={Position.Right}
    targetPosition={Position.Left}
  />
));

DatabaseNode.displayName = 'DatabaseNode';