import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Timeline from './components/Timeline';
import PropertyPanel from './components/PropertyPanel';
import Modal from './components/ui/Modal';
import WizardSteps from './components/WizardSteps';
import TemplateLibrary from './components/TemplateLibrary';
import AssetUploader from './components/AssetUploader';
import ProjectDashboard from './components/ProjectDashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showWizard, setShowWizard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [animationTimer, setAnimationTimer] = useState(null);

  // Handle authentication state changes
  useEffect(() => {
    if (!loading) {
      if (!user && activeTab !== 'home') {
        // Redirect to home if user is not authenticated and trying to access protected content
        setActiveTab('home');
      }
    }
  }, [user, loading, activeTab]);

  // Sample projects for demo (will be replaced with real data from backend)
  useEffect(() => {
    if (user) {
      const sampleProjects = [
        {
          id: 'demo-1',
          name: 'Welcome Animation',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-16T14:30:00Z',
          duration: 5,
          elements: [
            {
              id: 'welcome-text',
              type: 'text',
              name: 'Welcome Text',
              content: 'Welcome to AnimateFlow!',
              x: 0, y: 0, scale: 1, rotation: 0,
              fontSize: 32, color: '#ffffff',
              keyframes: [
                { time: 0, x: -300, y: 0, scale: 0.5, rotation: 0 },
                { time: 1.5, x: 0, y: 0, scale: 1, rotation: 0 },
                { time: 3.5, x: 0, y: 0, scale: 1, rotation: 0 },
                { time: 5, x: 300, y: 0, scale: 0.5, rotation: 0 }
              ]
            }
          ]
        }
      ];
      setProjects(sampleProjects);
    } else {
      setProjects([]);
    }
  }, [user]);

  // Animation playback
  useEffect(() => {
    if (isPlaying && currentProject) {
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= (currentProject.duration || 5)) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 100);
      setAnimationTimer(timer);
    } else {
      if (animationTimer) {
        clearInterval(animationTimer);
        setAnimationTimer(null);
      }
    }

    return () => {
      if (animationTimer) {
        clearInterval(animationTimer);
      }
    };
  }, [isPlaying, currentProject]);

  const handleNewProject = () => {
    if (!user) {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }
    setShowWizard(true);
  };

  const handleWizardComplete = (projectData) => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: projectData.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration: 5,
      elements: createElementsFromTemplate(projectData.template, projectData.customization)
    };
    
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    setActiveTab('timeline');
    setShowWizard(false);
  };

  const handleSignInClick = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleTabChange = (tab) => {
    if (!user && tab !== 'home') {
      setAuthMode('signin');
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tab);
  };

  const createElementsFromTemplate = (templateId, customization) => {
    const baseElement = {
      id: `element-${Date.now()}`,
      type: 'text',
      name: 'Main Text',
      content: customization.text,
      x: 0, y: 0, scale: 1, rotation: 0,
      fontSize: 32,
      color: customization.color
    };

    switch (templateId) {
      case 'bounce':
        return [{
          ...baseElement,
          keyframes: [
            { time: 0, x: 0, y: 0, scale: 1, rotation: 0 },
            { time: 1, x: 0, y: -100, scale: 1.2, rotation: 0 },
            { time: 2, x: 0, y: 0, scale: 1, rotation: 0 },
            { time: 3, x: 0, y: -50, scale: 1.1, rotation: 0 },
            { time: 4, x: 0, y: 0, scale: 1, rotation: 0 }
          ]
        }];
      case 'fade':
        return [{
          ...baseElement,
          keyframes: [
            { time: 0, x: 0, y: 0, scale: 0, rotation: 0 },
            { time: 1, x: 0, y: 0, scale: 1, rotation: 0 },
            { time: 4, x: 0, y: 0, scale: 1, rotation: 0 },
            { time: 5, x: 0, y: 0, scale: 0, rotation: 0 }
          ]
        }];
      case 'slide':
        return [{
          ...baseElement,
          keyframes: [
            { time: 0, x: -300, y: 0, scale: 1, rotation: 0 },
            { time: 1.5, x: 0, y: 0, scale: 1, rotation: 0 },
            { time: 3.5, x: 0, y: 0, scale: 1, rotation: 0 },
            { time: 5, x: 300, y: 0, scale: 1, rotation: 0 }
          ]
        }];
      case 'spin':
        return [{
          ...baseElement,
          keyframes: [
            { time: 0, x: 0, y: 0, scale: 1, rotation: 0 },
            { time: 2.5, x: 0, y: 0, scale: 1, rotation: 360 },
            { time: 5, x: 0, y: 0, scale: 1, rotation: 720 }
          ]
        }];
      default:
        return [baseElement];
    }
  };

  const handleSelectTemplate = (template) => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: template.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration: parseFloat(template.duration) || 5,
      elements: template.elements
    };
    
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    setActiveTab('timeline');
  };

  const handleOpenProject = (project) => {
    setCurrentProject(project);
    setActiveTab('timeline');
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
      setActiveTab('home');
    }
  };

  const handleUpdateElement = (elementId, updates) => {
    if (!currentProject) return;

    const updatedElements = currentProject.elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );

    const updatedProject = {
      ...currentProject,
      elements: updatedElements,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));

    if (selectedElement?.id === elementId) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  };

  const handleAddElement = (element) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      elements: [...currentProject.elements, element],
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedElement(element);
  };

  const handleDeleteElement = (elementId) => {
    if (!currentProject) return;

    const updatedElements = currentProject.elements.filter(el => el.id !== elementId);
    const updatedProject = {
      ...currentProject,
      elements: updatedElements,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const handleDuplicateElement = (element) => {
    const duplicatedElement = {
      ...element,
      id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${element.name} Copy`,
      x: (element.x || 0) + 20,
      y: (element.y || 0) + 20
    };
    handleAddElement(duplicatedElement);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleExport = () => {
    alert('Export functionality would generate GIF/MP4 files here');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <ProjectDashboard
            projects={projects}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onNewProject={handleNewProject}
          />
        );
      case 'templates':
        return <TemplateLibrary onSelectTemplate={handleSelectTemplate} />;
      case 'assets':
        return <AssetUploader onAddElement={handleAddElement} />;
      case 'timeline':
      case 'layers':
        if (!currentProject) {
          return (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white/60">
                <p className="text-lg mb-4">No project open</p>
                <p>Create a new project or open an existing one to start animating</p>
              </div>
            </div>
          );
        }
        return (
          <div className="flex-1 flex flex-col">
            <Canvas
              elements={currentProject.elements}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onExport={handleExport}
              currentTime={currentTime}
              duration={currentProject.duration}
            />
            <Timeline
              elements={currentProject.elements}
              duration={currentProject.duration}
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
              onUpdateElement={handleUpdateElement}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
            />
          </div>
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-6">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                AnimateFlow
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Craft stunning animated images with guided ease
              </p>
              <div className="space-y-4">
                <p className="text-white/70">
                  Create professional animations without the complexity. 
                  Our guided workflow helps you build beautiful animations step by step.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleNewProject}
                    className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200"
                  >
                    Start Creating
                  </button>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="px-8 py-3 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
                  >
                    Browse Templates
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading AnimateFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="flex h-screen">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onNewProject={handleNewProject}
          user={user}
          onSignIn={handleSignInClick}
          onSignUp={handleSignUpClick}
        />
        
        <div className="flex-1 flex">
          {renderMainContent()}
          
          {(activeTab === 'timeline' || activeTab === 'layers') && currentProject && (
            <PropertyPanel
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
              onDuplicateElement={handleDuplicateElement}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        title="Create New Animation"
        className="max-w-4xl"
      >
        <WizardSteps
          onComplete={handleWizardComplete}
          onClose={() => setShowWizard(false)}
        />
      </Modal>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
}

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
