import { BotMessageSquare } from 'lucide-react';

import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="app-name-box">
        <BotMessageSquare size={20} />
        <span className="app-name">Chatbot Flow</span>
      </div>
      <div className="nav-right">
        <button className="save-changes">Save Changes</button>
      </div>
    </nav>
  );
};
export default Navbar;
