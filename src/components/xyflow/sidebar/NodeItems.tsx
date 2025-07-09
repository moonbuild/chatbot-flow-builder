import { MessageSquareMore } from 'lucide-react';

const NodeItems = () => {
  return (
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
    </div>
  );
};
export default NodeItems;
