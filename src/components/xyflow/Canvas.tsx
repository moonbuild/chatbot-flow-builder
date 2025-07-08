import { useCallback, useState } from 'react';
import { ArrowLeft, MessageSquareMore } from 'lucide-react';
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Connection,
  type Node,
  type NodeMouseHandler,
  type XYPosition,
} from '@xyflow/react';

import { useFlowStore } from '../../stores/flowStore';

import CustomMessageNode, { type MessageNodeData } from './CustomMessageNode';

import '@xyflow/react/dist/style.css';
import './canvas.css';

const Canvas = () => {
  const { instance, setInstance } = useFlowStore();

  const nodeTypes = {
    message: CustomMessageNode,
  };

  const initialNodes = [
    {
      id: '1',
      type: 'message',
      position: { x: 0, y: 0 },
      data: {
        label: 'Send Message',
        configuration: {
          message: 'Hello I am Mourya Pranay, a Full Stack Developer',
        },
      },
    },
    {
      id: '2',
      type: 'message',
      position: { x: 0, y: 100 },
      data: {
        label: 'Send Message',
        configuration: {
          message: 'How does the UI look?, Please let me know',
        },
      },
    },
    {
      id: '3',
      type: 'message',
      position: { x: 0, y: 200 },
      data: {
        label: 'Send Message',
        configuration: {
          message:
            'This is just a sample message that has been repeated | This is just a sample message that has been repeated | This is just a sample message that has been repeated | This is just a sample message that has been repeated',
        },
      },
    },
  ];

  const initialEdges = [
    {
      id: 'e1',
      source: '1',
      target: '2',
    },
  ];
  // const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((e) => addEdge(params, e));
    },
    [setEdges],
  );

  const onNodeClick: NodeMouseHandler<Node> = (_, node) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const addNode = (position: XYPosition) => {
    const newNode = {
      id: `${new Date()}`,
      type: 'message',
      position,
      data: {
        label: 'Send Message',
        configuration: {
          message: '',
        },
      },
    };
    console.log('add Node', newNode);
    setNodes((allNodes) => allNodes.concat(newNode));
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
      addNode(position);
    },
    [instance],
  );

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  const isValidConnection = useCallback(
    (
      connection:
        | Connection
        | {
            id: string;
            source: string;
            target: string;
          },
    ) => {
      const targetConnections = edges.filter((edge) => edge.target === connection.target).length;
      const maxConnections = 1;
      return targetConnections < maxConnections;
    },
    [edges],
  );
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
            isValidConnection={isValidConnection}
            fitView
          >
            <Controls />
            <MiniMap zoomable pannable style={{ background: 'var(--contrast)', height: 120 }} />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      {selectedNode ? (
        <div className="sidebar">
          <div className="sidebar-title-box">
            <ArrowLeft
              style={{ position: 'absolute', left: 0 }}
              size={18}
              onClick={() => setSelectedNode(null)}
            />
            <span className="sidebar-title">Message</span>
          </div>

          <div className="sidebar-content">
            <div className="message-box">
              <span className="light-text">Text</span>
              <textarea className="sidebar-textarea" placeholder="Enter Your Message">
                {(selectedNode.data as MessageNodeData).configuration.message}
              </textarea>
            </div>
          </div>
        </div>
      ) : (
        <div className="sidebar">
          <div className="node-items">
            <div
              className="node-item"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'message');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <MessageSquareMore className="node-icon" size={24} />
              <span className="node-title">Message</span>
            </div>
            <div
              className="node-item"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'message');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <MessageSquareMore className="node-icon" size={24} />
              <span className="node-title">Message</span>
            </div>
            <div
              className="node-item"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'message');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <MessageSquareMore className="node-icon" size={24} />
              <span className="node-title">Message</span>
            </div>
            <div
              className="node-item"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'message');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <MessageSquareMore className="node-icon" size={24} />
              <span className="node-title">Message</span>
            </div>
            <div
              className="node-item"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'message');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <MessageSquareMore className="node-icon" size={24} />
              <span className="node-title">Message</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
