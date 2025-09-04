import React, { useState, useRef } from 'react';
import Button from './ui/Button';
import Slider from './ui/Slider';
import { Plus, Trash2, Copy } from 'lucide-react';

const Timeline = ({ 
  elements = [], 
  duration = 5, 
  currentTime = 0, 
  onTimeChange, 
  onAddKeyframe, 
  onDeleteKeyframe, 
  onUpdateElement,
  selectedElement,
  onSelectElement 
}) => {
  const timelineRef = useRef(null);
  const [draggedKeyframe, setDraggedKeyframe] = useState(null);

  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / rect.width) * duration;
    onTimeChange(Math.max(0, Math.min(duration, newTime)));
  };

  const handleKeyframeMove = (elementId, keyframeIndex, newTime) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const updatedKeyframes = [...element.keyframes];
    updatedKeyframes[keyframeIndex] = {
      ...updatedKeyframes[keyframeIndex],
      time: Math.max(0, Math.min(duration, newTime))
    };

    onUpdateElement(elementId, { keyframes: updatedKeyframes });
  };

  const addKeyframe = (elementId) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const newKeyframe = {
      time: currentTime,
      x: selectedElement?.x || 0,
      y: selectedElement?.y || 0,
      scale: selectedElement?.scale || 1,
      rotation: selectedElement?.rotation || 0,
    };

    const updatedKeyframes = [...(element.keyframes || []), newKeyframe]
      .sort((a, b) => a.time - b.time);

    onUpdateElement(elementId, { keyframes: updatedKeyframes });
  };

  return (
    <div className="h-48 glass-effect rounded-t-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Timeline</h3>
        <div className="flex items-center space-x-2">
          <span className="text-white/70 text-sm">
            {currentTime.toFixed(1)}s / {duration}s
          </span>
          {selectedElement && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => addKeyframe(selectedElement.id)}
            >
              <Plus size={14} className="mr-1" />
              Add Keyframe
            </Button>
          )}
        </div>
      </div>

      {/* Timeline scrubber */}
      <div className="space-y-2">
        <div 
          ref={timelineRef}
          className="relative h-8 bg-white/10 rounded-lg cursor-pointer overflow-hidden"
          onClick={handleTimelineClick}
        >
          <div className="timeline-track absolute top-1/2 left-0 right-0 transform -translate-y-1/2" />
          
          {/* Current time indicator */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white z-10 transition-all duration-100"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />

          {/* Keyframe markers */}
          {elements.map(element => 
            element.keyframes?.map((keyframe, index) => (
              <div
                key={`${element.id}-${index}`}
                className="keyframe-marker absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20"
                style={{ left: `${(keyframe.time / duration) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTimeChange(keyframe.time);
                  onSelectElement(element);
                }}
                title={`${element.name || 'Element'} - ${keyframe.time.toFixed(1)}s`}
              />
            ))
          )}
        </div>

        <Slider
          value={currentTime}
          onChange={onTimeChange}
          min={0}
          max={duration}
          step={0.1}
          label="Time"
        />
      </div>

      {/* Element tracks */}
      <div className="space-y-2 max-h-24 overflow-y-auto">
        {elements.map((element, index) => (
          <div 
            key={element.id}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-150 ${
              selectedElement?.id === element.id 
                ? 'bg-white/20' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => onSelectElement(element)}
          >
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-white text-sm font-medium flex-1">
              {element.name || `Element ${index + 1}`}
            </span>
            <span className="text-white/60 text-xs">
              {element.keyframes?.length || 0} keyframes
            </span>
          </div>
        ))}
        
        {elements.length === 0 && (
          <p className="text-white/60 text-sm text-center py-4">
            No elements in timeline
          </p>
        )}
      </div>
    </div>
  );
};

export default Timeline;