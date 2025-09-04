import React, { useRef, useState } from 'react';
import Button from './ui/Button';
import { Upload, Image, Type, Square, Plus } from 'lucide-react';

const AssetUploader = ({ onAddElement }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newElement = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'image',
            name: file.name,
            src: e.target.result,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            width: 100,
            height: 100,
            keyframes: []
          };
          onAddElement(newElement);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const addTextElement = () => {
    const newElement = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      name: 'Text Element',
      content: 'New Text',
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      fontSize: 24,
      color: '#ffffff',
      keyframes: []
    };
    onAddElement(newElement);
  };

  const addShapeElement = () => {
    const newElement = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'shape',
      name: 'Shape Element',
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      width: 100,
      height: 100,
      color: '#8B5CF6',
      keyframes: []
    };
    onAddElement(newElement);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Assets & Elements</h2>
        <p className="text-white/70">Add images, text, and shapes to your animation</p>
      </div>

      {/* Quick add elements */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Add Elements</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="secondary" 
            className="flex flex-col items-center py-4 h-auto"
            onClick={addTextElement}
          >
            <Type size={24} className="mb-2" />
            <span>Add Text</span>
          </Button>
          <Button 
            variant="secondary" 
            className="flex flex-col items-center py-4 h-auto"
            onClick={addShapeElement}
          >
            <Square size={24} className="mb-2" />
            <span>Add Shape</span>
          </Button>
        </div>
      </div>

      {/* File upload area */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Upload Images</h3>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            dragOver 
              ? 'border-accent bg-accent/10' 
              : 'border-white/30 hover:border-white/50 hover:bg-white/5'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} className="mx-auto mb-4 text-white/60" />
          <h4 className="text-lg font-medium text-white mb-2">Upload Images</h4>
          <p className="text-white/70 mb-4">
            Drag and drop images here, or click to browse
          </p>
          <Button variant="outline">
            <Image size={16} className="mr-2" />
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      </div>

      <div className="text-xs text-white/60 space-y-1">
        <p>Supported formats: JPG, PNG, GIF, SVG</p>
        <p>Max file size: 10MB per image</p>
      </div>
    </div>
  );
};

export default AssetUploader;