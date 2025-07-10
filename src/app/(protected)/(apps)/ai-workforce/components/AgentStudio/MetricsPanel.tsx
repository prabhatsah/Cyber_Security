import React from 'react';
import { Activity } from 'lucide-react';
import type { AgentNode, AgentEdge } from '../../types/agent-studio';

interface MetricsPanelProps {
  nodes: AgentNode[];
  edges: AgentEdge[];
}

export function MetricsPanel({ nodes, edges }: MetricsPanelProps) {
  const metrics = {
    complexity: calculateComplexity(nodes, edges),
    efficiency: calculateEfficiency(nodes, edges),
    reliability: calculateReliability(nodes)
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-white/60" />
        <h3 className="text-lg font-medium text-white/90">Metrics</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-white/60">Complexity</span>
            <span className="text-sm text-white/90">{metrics.complexity}%</span>
          </div>
          <div className="h-2 bg-[#3c3c3e] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${metrics.complexity}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-white/60">Efficiency</span>
            <span className="text-sm text-white/90">{metrics.efficiency}%</span>
          </div>
          <div className="h-2 bg-[#3c3c3e] rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${metrics.efficiency}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-white/60">Reliability</span>
            <span className="text-sm text-white/90">{metrics.reliability}%</span>
          </div>
          <div className="h-2 bg-[#3c3c3e] rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${metrics.reliability}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions to calculate metrics
function calculateComplexity(nodes: AgentNode[], edges: AgentEdge[]): number {
  const maxComplexity = 100;
  const nodeWeight = 0.4;
  const edgeWeight = 0.6;

  const nodeComplexity = Math.min((nodes.length / 10) * 100, 100);
  const edgeComplexity = Math.min((edges.length / 15) * 100, 100);

  return Math.round(nodeComplexity * nodeWeight + edgeComplexity * edgeWeight);
}

function calculateEfficiency(nodes: AgentNode[], edges: AgentEdge[]): number {
  const maxNodes = 20;
  const maxEdges = 30;
  const efficiency = 100 - (
    (nodes.length / maxNodes + edges.length / maxEdges) * 50
  );
  return Math.max(Math.round(efficiency), 0);
}

function calculateReliability(nodes: AgentNode[]): number {
  const hasInput = nodes.some(n => n.type === 'input');
  const hasOutput = nodes.some(n => n.type === 'output');
  const hasProcessing = nodes.some(n => n.type === 'processing');

  let reliability = 100;

  if (!hasInput) reliability -= 30;
  if (!hasOutput) reliability -= 30;
  if (!hasProcessing) reliability -= 20;

  return Math.max(reliability, 0);
}