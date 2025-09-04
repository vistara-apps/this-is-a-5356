import React from 'react';
import Button from './ui/Button';
import { Play, Star } from 'lucide-react';

const TemplateLibrary = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 'social-post',
      name: 'Social Media Post',
      description: 'Perfect for Instagram and Facebook posts',
      category: 'Social Media',
      preview: '/api/placeholder/300/200',
      difficulty: 'Beginner',
      duration: '3s',
      elements: [
        {
          id: 'text1',
          type: 'text',
          name: 'Main Title',
          content: 'Your Brand',
          x: 0, y: -50, scale: 1, rotation: 0,
          fontSize: 32,
          color: '#ffffff',
          keyframes: [
            { time: 0, x: -200, y: -50, scale: 0.5, rotation: 0 },
            { time: 1, x: 0, y: -50, scale: 1, rotation: 0 },
            { time: 2, x: 0, y: -50, scale: 1.1, rotation: 0 },
            { time: 3, x: 0, y: -50, scale: 1, rotation: 0 }
          ]
        },
        {
          id: 'shape1',
          type: 'shape',
          name: 'Background',
          x: 0, y: 50, scale: 1, rotation: 0,
          width: 200, height: 80,
          color: '#8B5CF6',
          keyframes: [
            { time: 0, x: 0, y: 50, scale: 0, rotation: 0 },
            { time: 0.5, x: 0, y: 50, scale: 1, rotation: 0 },
            { time: 2.5, x: 0, y: 50, scale: 1, rotation: 0 },
            { time: 3, x: 0, y: 50, scale: 0, rotation: 0 }
          ]
        }
      ]
    },
    {
      id: 'logo-intro',
      name: 'Logo Introduction',
      description: 'Animated logo reveal for videos',
      category: 'Branding',
      preview: '/api/placeholder/300/200',
      difficulty: 'Intermediate',
      duration: '4s',
      elements: [
        {
          id: 'logo1',
          type: 'text',
          name: 'Logo Text',
          content: 'LOGO',
          x: 0, y: 0, scale: 1, rotation: 0,
          fontSize: 48,
          color: '#F97316',
          keyframes: [
            { time: 0, x: 0, y: 0, scale: 0, rotation: 180 },
            { time: 1, x: 0, y: 0, scale: 1.2, rotation: 0 },
            { time: 2, x: 0, y: 0, scale: 1, rotation: 0 },
            { time: 4, x: 0, y: 0, scale: 1, rotation: 0 }
          ]
        }
      ]
    },
    {
      id: 'text-reveal',
      name: 'Text Reveal',
      description: 'Smooth text animation with effects',
      category: 'Typography',
      preview: '/api/placeholder/300/200',
      difficulty: 'Beginner',
      duration: '2s',
      elements: [
        {
          id: 'reveal-text',
          type: 'text',
          name: 'Reveal Text',
          content: 'Hello World!',
          x: 0, y: 0, scale: 1, rotation: 0,
          fontSize: 36,
          color: '#06B6D4',
          keyframes: [
            { time: 0, x: -300, y: 0, scale: 1, rotation: 0 },
            { time: 1, x: 0, y: 0, scale: 1, rotation: 0 },
            { time: 2, x: 0, y: 0, scale: 1, rotation: 0 }
          ]
        }
      ]
    },
    {
      id: 'bouncing-elements',
      name: 'Bouncing Elements',
      description: 'Fun bouncing animation with multiple elements',
      category: 'Effects',
      preview: '/api/placeholder/300/200',
      difficulty: 'Advanced',
      duration: '5s',
      elements: [
        {
          id: 'bounce1',
          type: 'shape',
          name: 'Circle 1',
          x: -100, y: 0, scale: 1, rotation: 0,
          width: 60, height: 60,
          color: '#EF4444',
          keyframes: [
            { time: 0, x: -100, y: 0, scale: 1, rotation: 0 },
            { time: 1, x: -100, y: -100, scale: 1.2, rotation: 0 },
            { time: 2, x: -100, y: 0, scale: 1, rotation: 0 },
            { time: 3, x: -100, y: -80, scale: 1.1, rotation: 0 },
            { time: 4, x: -100, y: 0, scale: 1, rotation: 0 },
            { time: 5, x: -100, y: 0, scale: 1, rotation: 0 }
          ]
        },
        {
          id: 'bounce2',
          type: 'shape',
          name: 'Circle 2',
          x: 100, y: 0, scale: 1, rotation: 0,
          width: 60, height: 60,
          color: '#84CC16',
          keyframes: [
            { time: 0, x: 100, y: 0, scale: 1, rotation: 0 },
            { time: 0.5, x: 100, y: -120, scale: 1.3, rotation: 0 },
            { time: 1.5, x: 100, y: 0, scale: 1, rotation: 0 },
            { time: 2.5, x: 100, y: -90, scale: 1.2, rotation: 0 },
            { time: 3.5, x: 100, y: 0, scale: 1, rotation: 0 },
            { time: 5, x: 100, y: 0, scale: 1, rotation: 0 }
          ]
        }
      ]
    }
  ];

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Template Library</h2>
        <p className="text-white/70">Choose from our collection of professionally designed animation templates</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">All</Button>
          {categories.map(category => (
            <Button key={category} variant="outline" size="sm">
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="glass-effect rounded-xl p-4 hover:bg-white/15 transition-all duration-200">
            <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 rounded-lg mb-4 flex items-center justify-center text-white/60">
              <Play size={32} />
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                <p className="text-sm text-white/70">{template.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="bg-white/10 px-2 py-1 rounded">{template.category}</span>
                <span>{template.difficulty}</span>
                <span>{template.duration}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onSelectTemplate(template)}
                >
                  Use Template
                </Button>
                <Button variant="outline" size="sm">
                  <Star size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;