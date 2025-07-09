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
  TriggerNodeConfig,
} from '../types/nodes/nodes-metadata';

type FlowStore = {
  instance: ReactFlowInstance<Node, Edge> | null;
  setInstance: (instance: ReactFlowInstance<Node, Edge>) => void;
  nodes: CustomNodeUnion[];
  edges: Edge[];
  setNodes: (nodes: CustomNodeUnion[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;

  addNode: (type: CustomNodeUnion['type'], position: XYPosition) => void;
  addEdge: (connection: Connection | Edge) => void;

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
  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as CustomNodeUnion[],
    })),
  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),
  addNode: (type, position) =>
    set((state) => {
      const id = crypto.randomUUID();
      let newNode: CustomNodeUnion;

      switch (type) {
        case 'message':
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
  addEdge: (connection) =>
    set((state) => ({
      edges: addEdgeFn(connection, state.edges),
    })),
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
              description: (newConfig as MessageNodeConfig).messageText.slice(0, 25),
              configuration: newConfig as MessageNodeConfig,
              type: 'message',
            },
          };
        }

        if (type === 'trigger' && node.type === 'trigger') {
          return {
            ...node,
            data: {
              ...node.data,
              configuration: newConfig as TriggerNodeConfig,
              type: 'trigger',
            },
          };
        }

        return node;
      });

      return { nodes: updatedNodes };
    });
  },
}));
