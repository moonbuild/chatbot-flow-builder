import { BotMessageSquare, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useFlowStore } from '../../stores/flowStore';
import { deleteLocalFlow, saveFlow } from '../../utils/localFlowStore';

import './navbar.css';

const Navbar = () => {
  const { nodes, edges } = useFlowStore(); //Please Check stores/flowStore.tsx for detailed info

  // validation logic and save to local storage if valid
  const isFlowValid = () => {
    //check if any node is not a source or target of any edge
    const invalidConnections = nodes.some(
      (n) => !edges.some((edg) => edg.source === n.id || edg.target === n.id),
    );
    // if invalid show error
    if (invalidConnections) {
      toast.error('Cannot Save Flow');
      return;
    }
    // if valid save the flow to local storage
    saveFlow({ nodes, edges });
  };

  return (
    <nav className="navbar">
      {/* Left Side: Icon and App Name */}
      <div className="app-name-box">
        <BotMessageSquare size={20} />
        <span className="app-name">Chatbot Flow</span>
      </div>
      {/* Right Side: Action buttons */}
      <div className="nav-right">
        {/* Deletes Saved flow from local storage */}
        <button className="delete-changes" onClick={deleteLocalFlow}>
          <Trash2 className="trash-icon" size={18} />
          Delete Local Storage
        </button>
        {/* validates and saves flow */}
        <button className="save-changes" onClick={isFlowValid}>
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
