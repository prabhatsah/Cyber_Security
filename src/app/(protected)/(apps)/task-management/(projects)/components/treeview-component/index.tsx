'use client';
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Circle } from 'lucide-react';

interface TreeNode {
  id: string;
  label: string;
  description?: string;
  status?: 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED';
  dateRange?: string;
  plannedHours?: number;
  actualHours?: number;
  children?: TreeNode[];
}

interface TreeViewProps {
  data: TreeNode[];
}

interface TreeNodeProps {
  node: TreeNode;
  level: number;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className="flex items-center py-3 px-2 rounded cursor-pointer"
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <span className="w-5 h-5 flex items-center justify-center">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 " />
            ) : (
              <ChevronRight className="w-4 h-4 " />
            )
          ) : (
            <Circle className="w-2 h-2 " />
          )}
        </span>
        <div className="flex-grow ml-1">
          <div className="flex items-center justify-between">
            <span className=" font-medium">{node.label}</span>
            {node.status && <StatusBadge status={node.status} />}
          </div>
          {node.description && (
            <p className="text-sm  mt-0.5">{node.description}</p>
          )}
          {(node.plannedHours || node.actualHours) && (
            <div className="flex gap-4 mt-1 text-sm ">
              {node.plannedHours && <span>Planned: {node.plannedHours}h</span>}
              {node.actualHours && <span>Actual: {node.actualHours}h</span>}
            </div>
          )}
          {node.dateRange && (
            <div className="text-sm  mt-0.5">{node.dateRange}</div>
          )}
        </div>
      </div>
      {isExpanded && hasChildren && (
        <div className="ml-2">
          {node.children?.map((child) => (
            <TreeNodeComponent 
              key={child.id} 
              node={child} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  return (
    <div className="max-h-[700px] overflow-auto">
      {data.map((node) => (
        <TreeNodeComponent key={node.id} node={node} level={0} />
      ))}
    </div>
  );
};

export default TreeView;