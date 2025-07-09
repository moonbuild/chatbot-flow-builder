import { BotMessageSquare, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useFlowStore } from '../../stores/flowStore';
import { deleteLocalFlow, saveFlow } from '../../utils/localFlowStore';

import './navbar.css';

const Navbar = () => {
  const { nodes, edges } = useFlowStore();

  const isFlowValid = () => {
    const invalidConnections = nodes.some(
      (n) => !edges.some((edg) => edg.source === n.id || edg.target === n.id),
    );
    if (invalidConnections) {
      toast.error('Cannot Save Flow');
      return;
    }
    saveFlow({ nodes, edges });
  };

  return (
    <nav className="navbar">
      <div className="app-name-box">
        <BotMessageSquare size={20} />
        <span className="app-name">Chatbot Flow</span>
      </div>
      <div className="nav-right">
        <button className="delete-changes" onClick={deleteLocalFlow}>
          <Trash2 className="trash-icon" size={18} />
          Delete Local Storage
        </button>
        <button className="save-changes" onClick={isFlowValid}>
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
