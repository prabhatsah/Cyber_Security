import React, { useState } from 'react';
import { Play, Save, Code, CheckCircle, XCircle, Bug, Zap, Loader } from 'lucide-react';
import type { AgentNode, AgentEdge, ModelConfig } from '../../types/agent-studio';

interface WorkflowPanelProps {
  nodes: AgentNode[];
  edges: AgentEdge[];
  modelConfig: ModelConfig;
}

interface TestResult {
  nodeId: string;
  status: 'success' | 'error' | 'running';
  input?: any;
  output?: any;
  error?: string;
  duration?: number;
}

export function WorkflowPanel({ nodes, edges, modelConfig }: WorkflowPanelProps) {
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleDryRun = async () => {
    setIsTestRunning(true);
    setTestResults([]);
    setLogs(prev => [...prev, 'Starting dry run...']);

    try {
      // Validate input
      let inputData;
      try {
        inputData = JSON.parse(testInput);
      } catch (error) {
        throw new Error('Invalid JSON input');
      }

      // Find input nodes
      const inputNodes = nodes.filter(n => n.type === 'input');
      if (inputNodes.length === 0) {
        throw new Error('No input nodes found in workflow');
      }

      // Start with input nodes
      for (const node of inputNodes) {
        await processNode(node, inputData);
      }

      setLogs(prev => [...prev, 'Dry run completed successfully']);
    } catch (error) {
      setLogs(prev => [...prev, `Error: ${error.message}`]);
    } finally {
      setIsTestRunning(false);
    }
  };

  const processNode = async (node: AgentNode, input: any) => {
    setTestResults(prev => [...prev, {
      nodeId: node.id,
      status: 'running',
      input
    }]);

    try {
      const startTime = performance.now();
      let output;

      switch (node.type) {
        case 'input':
          output = validateInput(input, node.data);
          break;

        case 'processing':
          output = await processData(input, node.data);
          break;

        case 'api':
          output = await mockApiCall(input, node.data);
          break;

        case 'database':
          output = await mockDatabaseOperation(input, node.data);
          break;

        case 'decision':
          output = evaluateCondition(input, node.data);
          break;

        case 'output':
          output = input;
          break;
      }

      const duration = performance.now() - startTime;

      setTestResults(prev => prev.map(r => 
        r.nodeId === node.id 
          ? { ...r, status: 'success', output, duration }
          : r
      ));

      // Process next nodes
      const nextEdges = edges.filter(e => e.source === node.id);
      for (const edge of nextEdges) {
        const nextNode = nodes.find(n => n.id === edge.target);
        if (nextNode) {
          await processNode(nextNode, output);
        }
      }
    } catch (error) {
      setTestResults(prev => prev.map(r => 
        r.nodeId === node.id 
          ? { ...r, status: 'error', error: error.message }
          : r
      ));
    }
  };

  const validateInput = (input: any, nodeData: any) => {
    if (nodeData.validation?.schema) {
      try {
        const schema = JSON.parse(nodeData.validation.schema);
        // Basic schema validation
        if (schema.type && typeof input !== schema.type) {
          throw new Error(`Invalid input type. Expected ${schema.type}`);
        }
      } catch (error) {
        throw new Error('Invalid schema or input validation failed');
      }
    }
    return input;
  };

  const processData = async (input: any, nodeData: any) => {
    switch (nodeData.processingType) {
      case 'transform':
        if (nodeData.transformFunction) {
          try {
            // Safely evaluate transform function
            const fn = new Function('input', nodeData.transformFunction);
            return fn(input);
          } catch (error) {
            throw new Error('Transform function execution failed');
          }
        }
        return input;

      case 'filter':
        if (nodeData.filterCondition) {
          try {
            const fn = new Function('input', `return ${nodeData.filterCondition}`);
            return fn(input) ? input : null;
          } catch (error) {
            throw new Error('Filter condition evaluation failed');
          }
        }
        return input;

      case 'aggregate':
        if (!Array.isArray(input)) {
          throw new Error('Aggregate requires array input');
        }
        switch (nodeData.aggregateFunction) {
          case 'sum':
            return input.reduce((a, b) => a + b, 0);
          case 'avg':
            return input.reduce((a, b) => a + b, 0) / input.length;
          case 'count':
            return input.length;
          case 'min':
            return Math.min(...input);
          case 'max':
            return Math.max(...input);
          default:
            return input;
        }

      default:
        return input;
    }
  };

  const mockApiCall = async (input: any, nodeData: any) => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!nodeData.endpoint) {
      throw new Error('API endpoint not configured');
    }

    // Mock response based on method
    switch (nodeData.method) {
      case 'GET':
        return { status: 200, data: input };
      case 'POST':
        return { status: 201, data: { id: Date.now(), ...input } };
      case 'PUT':
        return { status: 200, data: { ...input, updated: true } };
      case 'DELETE':
        return { status: 204 };
      default:
        throw new Error('Invalid HTTP method');
    }
  };

  const mockDatabaseOperation = async (input: any, nodeData: any) => {
    // Simulate database latency
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!nodeData.operation) {
      throw new Error('Database operation not configured');
    }

    // Mock database operations
    switch (nodeData.operation) {
      case 'read':
        return { rows: [input], count: 1 };
      case 'write':
        return { id: Date.now(), ...input };
      case 'update':
        return { ...input, updated: true };
      case 'delete':
        return { deleted: true };
      default:
        throw new Error('Invalid database operation');
    }
  };

  const evaluateCondition = (input: any, nodeData: any) => {
    if (!nodeData.condition) {
      throw new Error('Decision condition not configured');
    }

    try {
      const fn = new Function('input', `return ${nodeData.condition}`);
      return fn(input);
    } catch (error) {
      throw new Error('Condition evaluation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white/90">Deployment</h2>
          <p className="text-white/60">Test and deploy your AI agent workflow</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDryRun}
            disabled={isTestRunning}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTestRunning ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Running Test
              </>
            ) : (
              <>
                <Bug className="w-5 h-5" />
                Dry Run
              </>
            )}
          </button>
          <button
            onClick={() => {}}
            disabled={deploymentStatus === 'deploying'}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-5 h-5" />
            Deploy
          </button>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="bg-[#2c2c2e] rounded-xl p-4 border border-[#3c3c3e]">
        <h3 className="text-lg font-medium text-white/90 mb-4">Test Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Test Input (JSON)</label>
            <textarea
              value={testInput}
              onChange={e => setTestInput(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full bg-[#1c1c1e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 font-mono"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white/90">Test Results</h3>
          <div className="space-y-2">
            {testResults.map(result => {
              const node = nodes.find(n => n.id === result.nodeId);
              return (
                <div
                  key={result.nodeId}
                  className="bg-[#2c2c2e] rounded-xl p-4 border border-[#3c3c3e]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        result.status === 'success'
                          ? 'bg-green-500'
                          : result.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-blue-500 animate-pulse'
                      }`} />
                      <span className="font-medium text-white/90">
                        {node?.data.label || result.nodeId}
                      </span>
                      <span className="text-sm text-white/60">
                        ({node?.type})
                      </span>
                    </div>
                    {result.duration && (
                      <span className="text-sm text-white/60">
                        {result.duration.toFixed(2)}ms
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Input</label>
                      <pre className="bg-[#1c1c1e] rounded-lg p-3 text-sm text-white/80 overflow-auto">
                        {JSON.stringify(result.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">
                        {result.status === 'error' ? 'Error' : 'Output'}
                      </label>
                      <pre className={`bg-[#1c1c1e] rounded-lg p-3 text-sm overflow-auto ${
                        result.status === 'error' ? 'text-red-400' : 'text-white/80'
                      }`}>
                        {result.status === 'error'
                          ? result.error
                          : JSON.stringify(result.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="bg-[#2c2c2e] rounded-xl p-4 border border-[#3c3c3e]">
        <h3 className="text-lg font-medium text-white/90 mb-4">Logs</h3>
        <div className="font-mono text-sm bg-[#1c1c1e] rounded-lg p-4 h-48 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-white/60">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}