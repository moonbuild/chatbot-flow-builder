import { Handle, Position } from '@xyflow/react';
import { MessageCircleMore } from 'lucide-react';

import './customMessageNode.css';

export type MessageNodeData = {
  label: string;
  configuration: {
    message: string;
  };
};
type Props = {
  id: string;
  selected: boolean;
  data: MessageNodeData;
};

const CustomMessageNode = ({ data, selected }: Props) => {
  return (
    <div className={`node ${selected ? 'node-selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-label-box">
        <div className="node-label-left">
          <MessageCircleMore color={'var(--text-1)'} size={10} />
          <span className="node-label">{data.label}</span>
        </div>
        <div className="node-label-right">
          <img className="node-icon-img" src="/node-icons/whatsapp.svg" />
        </div>
      </div>
      <div className="node-content">
        <span className="node-content-message">test message 1sdfsdfsdfsdfsdf</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomMessageNode;
