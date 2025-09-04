import React, { useState } from 'react';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { Play, Edit3, Trash2, Download, Plus, Clock, Calendar } from 'lucide-react';

const ProjectDashboard = ({ projects = [], onOpenProject, onDeleteProject, onNewProject }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete.id);
    }
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">My Projects</h2>
          <p className="text-white/70">Manage your animation projects</p>
        </div>
        <Button onClick={onNewProject}>
          <Plus size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Play size={48} className="mx-auto text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-white/70 mb-6">Create your first animation to get started</p>
          <Button onClick={onNewProject}>
            <Plus size={16} className="mr-2" />
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="glass-effect rounded-xl p-4 hover:bg-white/15 transition-all duration-200">
              <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 rounded-lg mb-4 flex items-center justify-center">
                <Play size={32} className="text-white/60" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white mb-1">{project.name}</h3>
                  <div className="flex items-center text-xs text-white/60 space-x-3">
                    <span className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(project.updatedAt)}
                    </span>
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {project.duration || 5}s
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onOpenProject(project)}
                  >
                    <Edit3 size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClick(project)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-white/80">
            Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="flex-1"
            >
              Delete
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDashboard;