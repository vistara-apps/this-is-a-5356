import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';

const Canvas = ({ 
  elements = [], 
  isPlaying = false, 
  onPlayPause, 
  onReset, 
  onExport,
  currentTime = 0,
  duration = 5 
}) => {
  const canvasRef = useRef(null);

  const getElementTransform = (element, time) => {
    if (!element.keyframes || element.keyframes.length === 0) {
      return { x: element.x || 0, y: element.y || 0, scale: element.scale || 1, rotation: element.rotation || 0 };
    }

    // Find the appropriate keyframes for interpolation
    const keyframes = element.keyframes.sort((a, b) => a.time - b.time);
    
    if (time <= keyframes[0].time) {
      return keyframes[0];
    }
    
    if (time >= keyframes[keyframes.length - 1].time) {
      return keyframes[keyframes.length - 1];
    }

    // Find surrounding keyframes
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (time >= keyframes[i].time && time <= keyframes[i + 1].time) {
        const t = (time - keyframes[i].time) / (keyframes[i + 1].time - keyframes[i].time);
        return {
          x: keyframes[i].x + (keyframes[i + 1].x - keyframes[i].x) * t,
          y: keyframes[i].y + (keyframes[i + 1].y - keyframes[i].y) * t,
          scale: keyframes[i].scale + (keyframes[i + 1].scale - keyframes[i].scale) * t,
          rotation: keyframes[i].rotation + (keyframes[i + 1].rotation - keyframes[i].rotation) * t,
        };
      }
    }

    return keyframes[0];
  };

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Canvas</h2>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm" onClick={onReset}>
            <RotateCcw size={16} />
          </Button>
          <Button variant="secondary" size="sm" onClick={onPlayPause}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download size={16} className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div 
        ref={canvasRef}
        className="relative w-full h-96 canvas-area flex items-center justify-center overflow-hidden"
      >
        {elements.map((element, index) => {
          const transform = getElementTransform(element, currentTime);
          
          return (
            <motion.div
              key={element.id || index}
              className="absolute"
              initial={false}
              animate={{
                x: transform.x,
                y: transform.y,
                scale: transform.scale,
                rotate: transform.rotation,
              }}
              transition={{ duration: 0.1, ease: "linear" }}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {element.type === 'text' ? (
                <div 
                  className="text-white font-semibold select-none"
                  style={{ 
                    fontSize: `${element.fontSize || 24}px`,
                    color: element.color || '#ffffff'
                  }}
                >
                  {element.content || 'Sample Text'}
                </div>
              ) : element.type === 'shape' ? (
                <div
                  className="rounded-lg"
                  style={{
                    width: `${element.width || 100}px`,
                    height: `${element.height || 100}px`,
                    backgroundColor: element.color || '#8B5CF6',
                  }}
                />
              ) : element.type === 'image' ? (
                <img
                  src={element.src}
                  alt={element.alt || 'Animation element'}
                  className="max-w-none"
                  style={{
                    width: `${element.width || 100}px`,
                    height: `${element.height || 100}px`,
                  }}
                />
              ) : null}
            </motion.div>
          );
        })}

        {elements.length === 0 && (
          <div className="text-white/60 text-center">
            <p className="text-lg mb-2">Your canvas is empty</p>
            <p className="text-sm">Add elements from templates or create your own</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;