import React, { memo } from 'react';
import { Position } from 'reactflow';
import { FileInput } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const InputNode = memo(({ data, isConnectable }: any) => (
  <BaseNode
    data={{
      ...data,
      icon: <FileInput className="w-4 h-4 text-blue-500" />
    }}
    isConnectable={isConnectable}
    sourcePosition={Position.Right}
  />
));

InputNode.displayName = 'InputNode';