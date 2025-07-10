import React, { useState, useCallback, useRef } from 'react';
import { ReactFlowProvider, ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';
import { Bot, Workflow, Settings, Database, Code, Play, Save, Download, Upload, Plus, Zap, Book, Activity, Sparkles } from 'lucide-react';
import { AgentCanvas } from './AgentCanvas';
import { ModelConfigurator } from './ModelConfigurator';
import { WorkflowPanel } from './WorkflowPanel';
import { MetricsPanel } from './MetricsPanel';
import { ToolboxPanel } from './ToolboxPanel';
import { PropertiesPanel } from './PropertiesPanel';
import type { AgentNode, AgentEdge, ModelConfig } from '../../types/agent-studio';

export function AgentStudio() {
  const [activeTab, setActiveTab] = useState<'design' | 'train' | 'deploy'>('design');
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);
  const [nodes, setNodes] = useState<AgentNode[]>([]);
  const [edges, setEdges] = useState<AgentEdge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    baseModel: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNodeSelect = useCallback((node: AgentNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleNodeAdd = useCallback((type: NodeType) => {
    const newNode: AgentNode = {
      id: `node-${Date.now()}`,
      type,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: `New ${type}` }
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setEdges(prev => prev.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const handleSaveWorkflow = useCallback(() => {
    if (!reactFlowInstance) {
      alert('Please wait for the canvas to initialize');
      return;
    }

    const workflow = {
      nodes: reactFlowInstance.getNodes(),
      edges: reactFlowInstance.getEdges(),
      modelConfig,
      version: '1.0',
      timestamp: new Date().toISOString(),
      viewport: reactFlowInstance.getViewport()
    };
    
    downloadFile(`ai-ikon-workflow-${Date.now()}.json`, JSON.stringify(workflow, null, 2));
  }, [reactFlowInstance, modelConfig]);

  const handleImportClick = useCallback(() => {
    if (!reactFlowInstance) {
      alert('Please wait for the canvas to initialize');
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [reactFlowInstance]);

  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !reactFlowInstance) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const workflow = JSON.parse(content);

        if (!workflow.nodes || !workflow.edges || !workflow.modelConfig) {
          throw new Error('Invalid workflow file structure');
        }

        const importedNodes = workflow.nodes.map((node: any) => ({
          ...node,
          type: node.type || 'default',
          data: node.data || { label: node.id }
        }));

        const importedEdges = workflow.edges.map((edge: any) => ({
          ...edge,
          type: edge.type || 'default'
        }));

        if (workflow.viewport) {
          reactFlowInstance.setViewport(workflow.viewport);
        }

        setNodes(importedNodes);
        setEdges(importedEdges);
        setModelConfig(workflow.modelConfig);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error importing workflow:', error);
        alert('Failed to import workflow. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }, [reactFlowInstance]);

  const handleInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      <div className="border-b border-[#2c2c2e]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <div className="relative">
                    <Workflow className="w-8 h-8 text-white" />
                    <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  AI Ikon Studio
                </h1>
                <p className="text-white/60">Design, Train, and Deploy AI Workflows</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'design'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#2c2c2e] text-white/60 hover:text-white/90'
              }`}
            >
              <Workflow className="w-5 h-5" />
              Design
            </button>
            <button
              onClick={() => setActiveTab('train')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'train'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#2c2c2e] text-white/60 hover:text-white/90'
              }`}
            >
              <Book className="w-5 h-5" />
              Train
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'deploy'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#2c2c2e] text-white/60 hover:text-white/90'
              }`}
            >
              <Zap className="w-5 h-5" />
              Deploy
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="w-64 bg-[#2c2c2e] rounded-3xl border border-[#3c3c3e] p-4">
            <ToolboxPanel onNodeAdd={handleNodeAdd} />
          </div>

          <div className="flex-1 bg-[#2c2c2e] rounded-3xl border border-[#3c3c3e] overflow-hidden">
            <ReactFlowProvider>
              {activeTab === 'design' && (
                <AgentCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={setNodes}
                  onEdgesChange={setEdges}
                  onNodeSelect={handleNodeSelect}
                  onInit={handleInit}
                  onSave={handleSaveWorkflow}
                  onImport={handleImportClick}
                  onTest={() => setActiveTab('deploy')}
                  onDryRun={() => {
                    setActiveTab('deploy');
                    setTimeout(() => {
                      const dryRunButton = document.querySelector('[data-test-id="dry-run-button"]');
                      if (dryRunButton instanceof HTMLButtonElement) {
                        dryRunButton.click();
                      }
                    }, 100);
                  }}
                />
              )}
              {activeTab === 'train' && (
                <ModelConfigurator
                  config={modelConfig}
                  onChange={setModelConfig}
                />
              )}
              {activeTab === 'deploy' && (
                <div className="p-6">
                  <WorkflowPanel
                    nodes={nodes}
                    edges={edges}
                    modelConfig={modelConfig}
                  />
                </div>
              )}
            </ReactFlowProvider>
          </div>

          <div className="w-80 space-y-6">
            <div className="bg-[#2c2c2e] rounded-3xl border border-[#3c3c3e] p-4">
              <PropertiesPanel
                selectedNode={selectedNode}
                onNodeUpdate={(updates) => {
                  if (!selectedNode) return;
                  setNodes(prev =>
                    prev.map(node =>
                      node.id === selectedNode.id
                        ? { ...node, ...updates }
                        : node
                    )
                  );
                }}
                onNodeDelete={handleNodeDelete}
              />
            </div>

            <div className="bg-[#2c2c2e] rounded-3xl border border-[#3c3c3e] p-4">
              <MetricsPanel
                nodes={nodes}
                edges={edges}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}