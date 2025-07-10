import React, { memo } from 'react';
import { Position } from 'reactflow';
import { FileOutput } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const OutputNode = memo(({ data, isConnectable }: any) => (
  <BaseNode
    data={{
      ...data,
      icon: <FileOutput className="w-4 h-4 text-green-500" />
    }}
    isConnectable={isConnectable}
    targetPosition={Position.Left}
  />
));

OutputNode.displayName = 'OutputNode';