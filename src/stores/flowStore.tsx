import { create } from 'zustand';
import {
  type Node,
  type ReactFlowInstance,
  type OnNodesChange,
  applyNodeChanges,
  type XYPosition,
  type Edge,
  type OnEdgesChange,
  applyEdgeChanges,
  addEdge as addEdgeFn,
  type Connection,
} from '@xyflow/react';

import type {
  CustomNodeTypes,
  CustomNodeUnion,
  MessageNodeConfig,
  NodeConfigMap,
} from '../types/nodes/nodes-metadata';

type FlowStore = {
  // Reactflow instance reference (used to call other flow methods)
  instance: ReactFlowInstance<Node, Edge> | null;
  setInstance: (instance: ReactFlowInstance<Node, Edge>) => void;

  // Current nodes and edges in the flow
  nodes: CustomNodeUnion[];
  edges: Edge[];

  // Replace full nodes/edges state
  setNodes: (nodes: CustomNodeUnion[]) => void;
  setEdges: (edges: Edge[]) => void;

  // Updates nodes/edges on changes
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;

  // Add a new node or edge
  addNode: (type: CustomNodeUnion['type'], position: XYPosition) => void;
  addEdge: (connection: Connection | Edge) => void;

  // Update a nodes configuration by id and type
  updateNodeConfig: <T extends CustomNodeTypes>(
    id: string,
    type: T,
    newConfig: NodeConfigMap[T],
  ) => void;
};

export const useFlowStore = create<FlowStore>((set) => ({
  instance: null,
  setInstance: (instance) => set({ instance }),

  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  // Handle Node and Edge level changes like move, select, connect
  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as CustomNodeUnion[],
    })),
  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  // Add a new node of a 'specific type' at a given position
  addNode: (type, position) =>
    set((state) => {
      const id = crypto.randomUUID();
      let newNode: CustomNodeUnion;

      switch (type) {
        case 'message':
          // Create a message node with default config
          newNode = {
            id,
            type: 'message',
            position,
            data: {
              type: 'message',
              title: 'Send Message',
              description: '',
              iconPath: '/node-icons/whatsapp.svg',
              configuration: {
                messageText: '',
              },
            },
          };
          break;

        default:
          throw new Error(`Unknown node type: ${type}`);
      }

      return {
        nodes: [...state.nodes, newNode],
      };
    }),

  // Add a new edge between nodes
  addEdge: (connection) =>
    set((state) => ({
      edges: addEdgeFn(connection, state.edges),
    })),

  // Updates configuration for a node, using the type to find config shape
  updateNodeConfig: <T extends CustomNodeTypes>(
    id: string,
    type: T,
    newConfig: NodeConfigMap[T],
  ) => {
    set((state) => {
      const updatedNodes: CustomNodeUnion[] = state.nodes.map((node) => {
        if (node.id !== id || node.type !== type) return node;

        if (type === 'message' && node.type === 'message') {
          return {
            ...node,
            data: {
              ...node.data,
              // for message node we want to show the text message on the node, it may be different for other nodes.
              description: (newConfig as MessageNodeConfig).messageText.slice(0, 25),
              configuration: newConfig as MessageNodeConfig,
              type: 'message',
            },
          };
        }
        return node;
      });

      return { nodes: updatedNodes };
    });
  },
}));
