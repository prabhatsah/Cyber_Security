"use client";

import { RefObject, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeTypes,
  ReactFlowInstance 
} from "reactflow";
import "reactflow/dist/style.css";

import TreeNode from "./TreeNode";
import { getLayoutedElements } from "../../utils/getAutoTreeLayout";
import { v4 } from "uuid";

const nodeTypes: NodeTypes = {
  treeNode: TreeNode,
};

export default function HierchicalView({nodeData, edgeData, search}: {nodeData: Node[], edgeData: Edge[], search: RefObject<HTMLInputElement | null>, currentRole: string}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(nodeData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgeData);

  //const [searchTerm, setSearchTerm] = useState('');
  //const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const createNewNode = useCallback((source: string) => {
    const nodeid = v4();
    const newNodeData = {
      id: nodeid,
      type: "treeNode",
      position: { x: 0, y: 0 },
      data: { 
        label: "Node", 
        expanded: true , 
        deviceCount: 0, 
        commandsCount: 0, 
        nodeViewType: 'custom',
        showCommandConfigure: nodes[0].data.showCommandConfigure
      },
      style: { backgroundColor: 'transparent', color: '#000' },
      
    }

    const newEdgeData = {
      id: v4(),
      source: source,
      target: newNodeData.id
    }
    
    const updatedNodes = [...nodes, newNodeData];
    const updatedEdges = [...edges, newEdgeData];

    const layouted = getLayoutedElements(updatedNodes, updatedEdges);
    
    setNodes(layouted);
    setEdges(updatedEdges);
  },[edges, nodes, setEdges, setNodes]);

  const handleSearch = useCallback((searchTerm: string) => {
    const foundNode = nodes.find(
      (node) => ( node.data.label?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (foundNode) {
      // foundNode.style = { backgroundColor: 'yellow', color: '#000' }

      // setTimeout(()=>{foundNode.style = { backgroundColor: 'transparent', color: '#000' }}, 3000)

      reactFlowInstance?.setCenter(foundNode.position.x, foundNode.position.y, {
        zoom: 1.5,
        duration: 2000,
      });

      // Highlight
      //setHighlightedNodeId(foundNode.id);

      // Remove highlight after a while
      //setTimeout(() => setHighlightedNodeId(null), 3000);
    } else {
      alert('Node not found');
    }
  }, [nodes, reactFlowInstance]);

  // if (search.current) {
  //   search.current.addEventListener('keyup', (e) => {
  //     if (e.key === 'Enter' && search.current) {
  //       setSearchTerm(search.current.value)
  //       handleSearch()
  //     }
  //   });
  // }

  useEffect(() => {
    const node = search.current;
    if (!node || !reactFlowInstance) return; // 👈 wait until ready
  
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch(node.value);
      }
    };
  
    node.addEventListener('keyup', handleKeyUp);
  
    return () => {
      node.removeEventListener('keyup', handleKeyUp);
    };
  }, [search, reactFlowInstance, handleSearch]); // 👈 include deps

  const customnode = nodeData.filter(obj=>obj.id == '4');

  if(customnode.length)
  customnode[0].data.addNewNode = createNewNode;

  const getChildEdges = useCallback((nodeId: string): Edge[] => {
    return edges.filter((edge) => edge.source === nodeId);
  }, [edges]);

  const getAllDescendants = useCallback((nodeId: string, visited = new Set<string>()): string[] => {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);

    const childEdges = getChildEdges(nodeId);
    const children = childEdges.map(edge => edge.target);
    const descendants = [...children];

    children.forEach(childId => {
      descendants.push(...getAllDescendants(childId, visited));
    });

    return descendants;
  }, [getChildEdges]);

  const getAffectedEdges = useCallback((nodeId: string, descendants: string[]): Edge[] => {
    return edges.filter(edge => 
      edge.source === nodeId || 
      descendants.includes(edge.source) ||
      descendants.includes(edge.target)
    );
  }, [edges]);

  const toggleNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const node = nds.find((n) => n.id === nodeId);
      if (!node) return nds;

      const newExpanded = !node.data.expanded;
      const descendants = getAllDescendants(nodeId);

      return nds.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              expanded: newExpanded,
            },
          };
        } else if (descendants.includes(n.id)) {
          return {
            ...n,
            hidden: !newExpanded,
            data: {
              ...n.data,
              expanded: false,
            },
          };
        }
        return n;
      });
    });

    setEdges((eds) => {
      const descendants = getAllDescendants(nodeId);
      const affectedEdges = getAffectedEdges(nodeId, descendants);
      
      return eds.map((edge) => {
        if (affectedEdges.find(e => e.id === edge.id)) {
          const sourceNode = nodes.find((n) => n.id === nodeId);
          const isExpanded = sourceNode?.data.expanded;
          return {
            ...edge,
            hidden: isExpanded,
          };
        }
        return edge;
      });
    });
  }, [nodes, getAllDescendants, getAffectedEdges, setNodes, setEdges]);

  const nodesWithHandlers = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onToggle: () => toggleNode(node.id),
    },
  }));

  useEffect(() => {
    setNodes(getLayoutedElements(nodeData, edgeData));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full">
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          onInit={setReactFlowInstance}
        >
          <Background />
          <Controls />
        </ReactFlow>
    </div>
  );
}