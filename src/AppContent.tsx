import { Toaster } from 'react-hot-toast';

import Navbar from './components/navbar/Navbar';
import Canvas from './components/xyflow/Canvas';

export default function AppContent() {
  return (
    <div className="app-content">
      <Navbar />
      <Canvas />
      <Toaster />
    </div>
  );
}
