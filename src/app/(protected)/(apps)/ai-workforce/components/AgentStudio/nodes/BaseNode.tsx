import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface BaseNodeProps {
  data: {
    label: string;
    icon: React.ReactNode;
  };
  isConnectable?: boolean;
  sourcePosition?: Position;
  targetPosition?: Position;
}

export const BaseNode = memo(({
  data,
  isConnectable = true,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: BaseNodeProps) => {
  return (
    <div className="px-4 py-2 shadow-xl rounded-xl border border-[#3c3c3e] bg-[#2c2c2e] min-w-[150px]">
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-[#3c3c3e]"
      />
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-[#3c3c3e]">
          {data.icon}
        </div>
        <div className="text-sm font-medium text-white/90">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-[#3c3c3e]"
      />
    </div>
  );
});

BaseNode.displayName = 'BaseNode';