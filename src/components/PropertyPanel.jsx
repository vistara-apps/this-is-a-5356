import React from 'react';
import Slider from './ui/Slider';
import Input from './ui/Input';
import Button from './ui/Button';
import { Trash2, Copy, Eye, EyeOff } from 'lucide-react';

const PropertyPanel = ({ 
  selectedElement, 
  onUpdateElement, 
  onDeleteElement, 
  onDuplicateElement 
}) => {
  if (!selectedElement) {
    return (
      <div className="w-80 glass-effect rounded-l-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Properties</h3>
        <div className="text-center text-white/60 py-8">
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateProperty = (property, value) => {
    onUpdateElement(selectedElement.id, { [property]: value });
  };

  return (
    <div className="w-80 glass-effect rounded-l-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Properties</h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onDuplicateElement(selectedElement)}>
            <Copy size={14} />
          </Button>
          <Button variant="ghost" size="sm">
            <Eye size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDeleteElement(selectedElement.id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            placeholder="Element name"
            value={selectedElement.name || ''}
            onChange={(e) => updateProperty('name', e.target.value)}
          />
        </div>

        {/* Position Controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/80">Position</h4>
          <Slider
            label="X Position"
            value={selectedElement.x || 0}
            onChange={(value) => updateProperty('x', value)}
            min={-400}
            max={400}
            step={1}
          />
          <Slider
            label="Y Position"
            value={selectedElement.y || 0}
            onChange={(value) => updateProperty('y', value)}
            min={-200}
            max={200}
            step={1}
          />
        </div>

        {/* Transform Controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/80">Transform</h4>
          <Slider
            label="Scale"
            value={selectedElement.scale || 1}
            onChange={(value) => updateProperty('scale', value)}
            min={0.1}
            max={3}
            step={0.1}
          />
          <Slider
            label="Rotation"
            value={selectedElement.rotation || 0}
            onChange={(value) => updateProperty('rotation', value)}
            min={-180}
            max={180}
            step={1}
          />
        </div>

        {/* Type-specific controls */}
        {selectedElement.type === 'text' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/80">Text</h4>
            <Input
              placeholder="Text content"
              value={selectedElement.content || ''}
              onChange={(e) => updateProperty('content', e.target.value)}
            />
            <Slider
              label="Font Size"
              value={selectedElement.fontSize || 24}
              onChange={(value) => updateProperty('fontSize', value)}
              min={12}
              max={72}
              step={1}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Color</label>
              <input
                type="color"
                value={selectedElement.color || '#ffffff'}
                onChange={(e) => updateProperty('color', e.target.value)}
                className="w-full h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer"
              />
            </div>
          </div>
        )}

        {selectedElement.type === 'shape' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/80">Shape</h4>
            <Slider
              label="Width"
              value={selectedElement.width || 100}
              onChange={(value) => updateProperty('width', value)}
              min={10}
              max={300}
              step={1}
            />
            <Slider
              label="Height"
              value={selectedElement.height || 100}
              onChange={(value) => updateProperty('height', value)}
              min={10}
              max={300}
              step={1}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Color</label>
              <input
                type="color"
                value={selectedElement.color || '#8B5CF6'}
                onChange={(e) => updateProperty('color', e.target.value)}
                className="w-full h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer"
              />
            </div>
          </div>
        )}

        {selectedElement.type === 'image' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/80">Image</h4>
            <Slider
              label="Width"
              value={selectedElement.width || 100}
              onChange={(value) => updateProperty('width', value)}
              min={10}
              max={300}
              step={1}
            />
            <Slider
              label="Height"
              value={selectedElement.height || 100}
              onChange={(value) => updateProperty('height', value)}
              min={10}
              max={300}
              step={1}
            />
          </div>
        )}

        {/* Keyframes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/80">Animation</h4>
          <div className="text-xs text-white/60">
            Keyframes: {selectedElement.keyframes?.length || 0}
          </div>
          {selectedElement.keyframes?.map((keyframe, index) => (
            <div key={index} className="p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-white/70">
                Time: {keyframe.time.toFixed(1)}s
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;