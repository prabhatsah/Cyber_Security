import dagre from 'dagre';
import { Node } from 'reactflow';

const nodeWidth = 150;  // Set min width
const nodeHeight = 60;  // Set height

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLayoutedElements = (nodes: Node[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 30, edgesep: 20, ranksep: 100 });

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: dagreNode.x - nodeWidth / 2, y: dagreNode.y - nodeHeight / 2 }
    };
  });
};
