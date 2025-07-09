import { useCallback, useEffect, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type NodeMouseHandler,
  type NodeTypes,
} from '@xyflow/react';
import toast from 'react-hot-toast';

import { useFlowStore } from '../../stores/flowStore';
import type { CustomNodeUnion } from '../../types/nodes/nodes-metadata';
import { loadFlow } from '../../utils/localFlowStore';
import { sampleEdges, sampleNodes } from '../../utils/sampleFlowData';

import MessageConfig from './sidebar/MessageConfig';
import NodeItems from './sidebar/NodeItems';
import CustomNode from './CustomNode';

import '@xyflow/react/dist/style.css';
import './canvas.css';

const Canvas = () => {
  const {
    instance,
    setInstance,
    nodes,
    setNodes,
    onNodesChange,
    addNode,
    edges,
    setEdges,
    onEdgesChange,
    addEdge,
  } = useFlowStore();

  const raw = loadFlow();

  const initialNodes: CustomNodeUnion[] = raw?.nodes ?? sampleNodes;

  const initialEdges: Edge[] = raw?.edges ?? sampleEdges;

  const nodeTypes: NodeTypes = {
    message: CustomNode,
    trigger: CustomNode,
  };

  const [selectedNode, setSelectedNode] = useState<CustomNodeUnion | null>(null);

  const onConnect = useCallback(
    // update edges manually to set source, target
    (connection: Connection) => {
      const sourceEdgeConnections = edges.find((edg) => edg.source === connection.source);
      if (sourceEdgeConnections) {
        toast.error('Source Handle can only have one edge');
        return;
      }
      addEdge(connection);
    },
    [edges, setEdges],
  );

  const onNodeClick: NodeMouseHandler<CustomNodeUnion> = (_, node) => {
    setSelectedNode(node); // to open sidebar config of that node
  };

  const onPaneClick = () => {
    setSelectedNode(null); // when user clicks on canvas, the sidebar closes
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !instance) return;

      const position = instance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNode(type, position);
    },
    [instance],
  );

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  useEffect(() => {
    //when application loads, we set the nodes/edges with default nodes/edges and its positions
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  return (
    <div className="canvas">
      <div className="reactflow-container">
        <ReactFlowProvider>
          <ReactFlow
            onInit={(instance: any) => {
              setInstance(instance);
            }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            proOptions={{ hideAttribution: true }}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
          >
            <Controls />
            <MiniMap zoomable pannable style={{ background: 'var(--contrast)', height: 120 }} />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      <div className="sidebar">
        {selectedNode && selectedNode.type === 'message' ? (
          <MessageConfig selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
        ) : (
          <div className="sidebar">
            <NodeItems />
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
