import React, { memo } from 'react';
import { Position } from 'reactflow';
import { Globe } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const APINode = memo(({ data, isConnectable }: any) => (
  <BaseNode
    data={{
      ...data,
      icon: <Globe className="w-4 h-4 text-orange-500" />
    }}
    isConnectable={isConnectable}
    sourcePosition={Position.Right}
    targetPosition={Position.Left}
  />
));

APINode.displayName = 'APINode';