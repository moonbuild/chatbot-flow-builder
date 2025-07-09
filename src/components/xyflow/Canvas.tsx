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

  const raw = loadFlow(); // fetch nodes, edges from localstorage

  // if raw is null then we fetch sample nodes and edges.
  const initialNodes: CustomNodeUnion[] = raw?.nodes ?? sampleNodes;

  const initialEdges: Edge[] = raw?.edges ?? sampleEdges;

  // customizing UI for each node via type
  const nodeTypes: NodeTypes = {
    message: CustomNode,
    trigger: CustomNode, //dummmy type to show it is done like this
  };

  const [selectedNode, setSelectedNode] = useState<CustomNodeUnion | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      // Find if source of connection has an edge already
      const sourceEdgeConnections = edges.find((edg) => edg.source === connection.source);
      if (sourceEdgeConnections) {
        toast.error('Source Handle can only have one connection');
        return;
      }
      // Else Add Edge
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
      // To handle the node drop
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !instance) return;

      // reactflow coords is different from screen coords, so we convert!
      const position = instance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      // We add node to that position
      addNode(type, position);
    },
    [instance],
  );

  //handles dnd event to allow dropping elements
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move'; //sets drop effect for user indication
  };

  useEffect(() => {
    /** When application loads
     * We find if any node has property 'selected = true' if so, open config sidebar
     * We set the nodes/edges with default nodes/edges and its positions
     */
    const initialSelectedNode = initialNodes.find((n) => n.selected);
    if (initialSelectedNode) setSelectedNode(initialSelectedNode);

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  return (
    <div className="canvas">
      {/* Container for React Flow */}
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
            {/* Built in UI controls: zoom, fit view, zoom lock */}
            <Controls />
            {/* Shows a very useful pannable overview map */}
            <MiniMap zoomable pannable style={{ background: 'var(--contrast)', height: 120 }} />
            {/* Dotted Background for UI */}
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      {/* Sidebar for config or node items */}
      <div className="sidebar">
        {selectedNode && selectedNode.type === 'message' ? (
          // if a message node is selected show its appropriate configuration panel
          <MessageConfig selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
        ) : (
          // Otherwise show available draggable node items
          <div className="sidebar">
            <NodeItems />
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
