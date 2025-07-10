import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Bug, Save, Upload, Download } from 'lucide-react';
import { nodeTypes } from './nodes';
import type { AgentNode, AgentEdge } from '../../types/agent-studio';

interface AgentCanvasProps {
  nodes: AgentNode[];
  edges: AgentEdge[];
  onNodesChange: (nodes: AgentNode[]) => void;
  onEdgesChange: (edges: AgentEdge[]) => void;
  onNodeSelect: (node: AgentNode | null) => void;
  onInit: (instance: ReactFlowInstance) => void;
  onSave?: () => void;
  onImport?: () => void;
  onTest?: () => void;
  onDryRun?: () => void;
}

export function AgentCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
  onInit,
  onSave,
  onImport,
  onTest,
  onDryRun
}: AgentCanvasProps) {
  const { getNode } = useReactFlow();

  const handleNodesChange = useCallback((changes: any[]) => {
    const updatedNodes = applyNodeChanges(changes, nodes) as AgentNode[];
    onNodesChange(updatedNodes);
  }, [nodes, onNodesChange]);

  const handleEdgesChange = useCallback((changes: any[]) => {
    const updatedEdges = applyEdgeChanges(changes, edges) as AgentEdge[];
    onEdgesChange(updatedEdges);
  }, [edges, onEdgesChange]);

  const handleConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return;
    
    const newEdge: AgentEdge = {
      id: `edge-${Date.now()}`,
      source: params.source,
      target: params.target,
      type: 'smoothstep'
    };
    onEdgesChange([...edges, newEdge]);
  }, [edges, onEdgesChange]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const selectedNode = getNode(node.id);
    if (selectedNode) {
      onNodeSelect(selectedNode as AgentNode);
    }
  }, [getNode, onNodeSelect]);

  const handlePaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div className="relative w-full h-[calc(100vh-12rem)]">
      {/* Testing Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#1c1c1e] p-2 rounded-xl border border-[#2c2c2e] shadow-lg">
        <button
          onClick={onDryRun}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          title="Run workflow simulation"
        >
          <Bug className="w-5 h-5" />
          Dry Run
        </button>
        <button
          onClick={onTest}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
          title="Execute workflow"
        >
          <Play className="w-5 h-5" />
          Test
        </button>
        <div className="w-px h-8 bg-[#2c2c2e]" />
        <button
          onClick={onSave}
          className="p-2 rounded-xl hover:bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
          title="Save workflow"
        >
          <Save className="w-5 h-5" />
        </button>
        <button
          onClick={onImport}
          className="p-2 rounded-xl hover:bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
          title="Import workflow"
        >
          <Upload className="w-5 h-5" />
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3c3c3e' }
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#3c3c3e" gap={16} />
        <Controls className="!bg-[#2c2c2e] !border-[#3c3c3e] !rounded-xl" />
        <MiniMap
          nodeStrokeColor="#3c3c3e"
          nodeColor="#2c2c2e"
          nodeBorderRadius={8}
          className="!bg-[#2c2c2e] !border-[#3c3c3e] !rounded-xl"
        />
      </ReactFlow>
    </div>
  );
}