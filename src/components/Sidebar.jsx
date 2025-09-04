import React from 'react';
import { 
  Home, 
  FileText, 
  Image, 
  Play, 
  Download, 
  Settings,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import Button from './ui/Button';

const Sidebar = ({ activeTab, onTabChange, onNewProject }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'projects', icon: FileText, label: 'Projects' },
    { id: 'templates', icon: Sparkles, label: 'Templates' },
    { id: 'assets', icon: Image, label: 'Assets' },
    { id: 'timeline', icon: Clock, label: 'Timeline' },
    { id: 'layers', icon: Layers, label: 'Layers' },
  ];

  return (
    <div className="w-64 h-full glass-effect rounded-r-xl p-4 space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white mb-2">AnimateFlow</h1>
        <Button onClick={onNewProject} className="w-full">
          <Play size={16} className="mr-2" />
          New Animation
        </Button>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-150 ${
                activeTab === item.id 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-white/20">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150">
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;