import { ArrowLeft } from 'lucide-react';
import React, { type SetStateAction } from 'react';

import type { CustomNodeUnion, MessageNode } from '../../../types/nodes/nodes-metadata';
import { useFlowStore } from '../../../stores/flowStore';

// Passing selectedNode setter to clear and update selection
interface MessageConfigProps {
  selectedNode: CustomNodeUnion;
  setSelectedNode: React.Dispatch<SetStateAction<CustomNodeUnion | null>>;
}

const MessageConfig = ({ selectedNode, setSelectedNode }: MessageConfigProps) => {
  const { updateNodeConfig } = useFlowStore();

  // only render for message nodes
  if (selectedNode.data.type !== 'message') return null;

  // typecast to MessageNode
  const messageNode = selectedNode as MessageNode;

  // handles textarea input and updates global + local state
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const messageText = e.target.value;

    // this updated internal nodes configuration
    updateNodeConfig(messageNode.id, 'message', {
      ...messageNode.data.configuration,
      messageText: messageText,
    });

    // update local selectedNode state
    setSelectedNode((prev) => {
      if (!prev || prev.data.type !== 'message') return null;
      return {
        ...prev,
        data: {
          ...prev.data,
          description: messageText.slice(0, 25),
          configuration: {
            ...prev.data.configuration,
            messageText,
          },
        },
      };
    });
  };

  return (
    <React.Fragment>
      {/* Title and Back Arrow for navigation */}
      <div className="sidebar-title-box">
        <ArrowLeft
          style={{ position: 'absolute', left: 0, cursor: 'pointer' }}
          size={18}
          onClick={() => setSelectedNode(null)}
        />
        <span className="sidebar-title">Message</span>
      </div>
      {/* Message textarea input */}
      <div className="sidebar-content">
        <div className="message-box">
          <span className="light-text">Text</span>
          <textarea
            className="sidebar-textarea"
            placeholder="Enter Your Message"
            value={messageNode.data.configuration.messageText}
            onChange={handleOnChange}
          ></textarea>
        </div>
      </div>
    </React.Fragment>
  );
};
export default MessageConfig;
