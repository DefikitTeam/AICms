'use client'

import {
  addEdge,
  Background,
  Edge,
  Node,
  NodeOrigin,
  OnConnect,
  ProOptions,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import AgentNode from './nodes/agent-node';
import CentralNode from './nodes/central-node';

import useForceLayout from '@/app/_hooks/use-force-layout';
import { useCallback } from 'react';

const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true };

const nodeOrigin: NodeOrigin = [0.5, 0.5];

const defaultEdgeOptions = { style: { stroke: '#d19900', strokeWidth: 2, zIndex: 1000 } };

const nodeTypes = {
  central: CentralNode,
  agent: AgentNode,
};

interface Props {
  strength?: number;
  distance?: number;
  nodes: Node[];
  edges: Edge[];
}

// Separate the flow component to ensure context is available
const Flow: React.FC<Props> = ({ strength = -500, distance = 150, nodes: initialNodes, edges: initialEdges }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const dragEvents = useForceLayout({ 
    strength,
    distance,
    oscillationStrength: 0.1
  });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      proOptions={proOptions}
      onConnect={onConnect}
      onNodeDragStart={dragEvents.start}
      onNodeDrag={dragEvents.drag}
      onNodeDragStop={dragEvents.stop}
      nodeOrigin={nodeOrigin}
      defaultEdgeOptions={defaultEdgeOptions}
      panOnDrag={false}
      zoomOnDoubleClick={false}
      zoomOnScroll={false}
      fitView
    >
      <Background />
    </ReactFlow>
  );
}

// Wrap the flow component with the provider
const AgentGraph: React.FC<Props> = (props) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <Flow {...props} />
      </ReactFlowProvider>
    </div>
  );
}

export default AgentGraph;
