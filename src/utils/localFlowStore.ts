import type { Edge } from '@xyflow/react';
import toast from 'react-hot-toast';

import type { CustomNodeUnion } from '../types/nodes/nodes-metadata';

// saves nodes and edges to localStorage under key 'flow'
const saveFlow = ({ nodes, edges }: { nodes: CustomNodeUnion[]; edges: Edge[] }) => {
  const flowData = {
    nodes,
    edges,
  };
  localStorage.setItem('flow', JSON.stringify(flowData));
  toast.success('Flow Successfully saved');
};

// Retrieves nodes and edges from localStorage under key 'flow'
// Returns null if it doesnt exist or invalid
const loadFlow = (): { nodes: CustomNodeUnion[]; edges: Edge[] } | null => {
  const raw = localStorage.getItem('flow');
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return { nodes: data.nodes, edges: data.edges };
  } catch {
    return null;
  }
};

// safely removes saved flow data from localstorage
const deleteLocalFlow = () => {
  localStorage.removeItem('flow');
  toast.success('Flow Deleted from Local Storage');
};
export { saveFlow, loadFlow, deleteLocalFlow };
