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
  Clock,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

const Sidebar = ({ activeTab, onTabChange, onNewProject, user, onSignIn, onSignUp }) => {
  const { signOut } = useAuth();
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'projects', icon: FileText, label: 'Projects' },
    { id: 'templates', icon: Sparkles, label: 'Templates' },
    { id: 'assets', icon: Image, label: 'Assets' },
    { id: 'timeline', icon: Clock, label: 'Timeline' },
    { id: 'layers', icon: Layers, label: 'Layers' },
  ];

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      onTabChange('home');
    }
  };

  return (
    <div className="w-64 h-full glass-effect rounded-r-xl p-4 space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white mb-2">AnimateFlow</h1>
        {user ? (
          <Button onClick={onNewProject} className="w-full">
            <Play size={16} className="mr-2" />
            New Animation
          </Button>
        ) : (
          <div className="space-y-2">
            <Button onClick={onSignIn} variant="outline" className="w-full">
              Sign In
            </Button>
            <Button onClick={onSignUp} className="w-full">
              Get Started
            </Button>
          </div>
        )}
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

      <div className="pt-4 border-t border-white/20 space-y-2">
        {user && (
          <div className="px-3 py-2 text-white/70 text-sm">
            <div className="flex items-center space-x-2 mb-2">
              <User size={16} />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        )}
        
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150">
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </button>
        
        {user && (
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
