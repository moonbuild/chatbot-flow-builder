import type { Edge } from '@xyflow/react';
import toast from 'react-hot-toast';

import type { CustomNodeUnion } from '../types/nodes/nodes-metadata';

const saveFlow = ({ nodes, edges }: { nodes: CustomNodeUnion[]; edges: Edge[] }) => {
  const flowData = {
    nodes,
    edges,
  };
  localStorage.setItem('flow', JSON.stringify(flowData));
  toast.success('Flow Successfully saved');
};
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
const deleteLocalFlow = () => {
  localStorage.removeItem('flow');
  toast.success('Flow Deleted from Local Storage');
};
export { saveFlow, loadFlow, deleteLocalFlow };
