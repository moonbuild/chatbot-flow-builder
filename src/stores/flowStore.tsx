import { create } from 'zustand';
import type { Node, Edge, ReactFlowInstance } from '@xyflow/react';

type FlowStore = {
  instance: ReactFlowInstance<Node, Edge> | null;
  setInstance: (instance: ReactFlowInstance<Node, Edge>) => void;
};

export const useFlowStore = create<FlowStore>((set) => ({
  instance: null,
  setInstance: (instance) => set({ instance }),
}));
