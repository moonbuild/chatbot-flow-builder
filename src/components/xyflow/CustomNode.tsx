import { Handle, Position } from '@xyflow/react';
import { MessageCircleMore } from 'lucide-react';

import './customNode.css';

const CustomNode = ({
  data,
  selected,
}: {
  data: {
    title: string;
    description?: string;
    iconPath: string;
    configuration: unknown;
  };
  selected?: boolean;
}) => {
  const { title, description, iconPath } = data;

  return (
    <div className={`node ${selected ? 'node-selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-label-box">
        <div className="node-label-left">
          <MessageCircleMore color={'var(--text-1)'} size={10} />
          <span className="node-label">{title}</span>
        </div>
        <div className="node-label-right">
          <img className="node-icon-img" src={iconPath} />
        </div>
      </div>
      <div className="node-content">
        <span className="node-content-message">
          {description?.trim().length === 0 ? 'Enter a Text' : description}
        </span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;
