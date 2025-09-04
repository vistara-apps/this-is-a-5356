import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const WizardSteps = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState({
    name: '',
    template: null,
    customization: {
      text: 'Hello World',
      color: '#8B5CF6',
      animation: 'fade'
    }
  });

  const steps = [
    {
      title: 'Project Setup',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Let's create your first animation!</h3>
          <Input
            placeholder="Enter project name"
            value={projectData.name}
            onChange={(e) => setProjectData({...projectData, name: e.target.value})}
          />
        </div>
      )
    },
    {
      title: 'Choose Template',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Pick a starting template</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'bounce', name: 'Bouncing Text', preview: '📝' },
              { id: 'fade', name: 'Fade In/Out', preview: '✨' },
              { id: 'slide', name: 'Slide Animation', preview: '➡️' },
              { id: 'spin', name: 'Spinning Logo', preview: '🔄' }
            ].map(template => (
              <button
                key={template.id}
                onClick={() => setProjectData({...projectData, template: template.id})}
                className={`p-4 rounded-lg border-2 transition-all duration-150 ${
                  projectData.template === template.id
                    ? 'border-accent bg-accent/20 text-white'
                    : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40'
                }`}
              >
                <div className="text-2xl mb-2">{template.preview}</div>
                <div className="text-sm font-medium">{template.name}</div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Customize',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Customize your animation</h3>
          <Input
            placeholder="Enter your text"
            value={projectData.customization.text}
            onChange={(e) => setProjectData({
              ...projectData, 
              customization: {...projectData.customization, text: e.target.value}
            })}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Color</label>
            <div className="flex space-x-2">
              {['#8B5CF6', '#F97316', '#06B6D4', '#84CC16', '#EF4444'].map(color => (
                <button
                  key={color}
                  onClick={() => setProjectData({
                    ...projectData,
                    customization: {...projectData.customization, color}
                  })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all duration-150 ${
                    projectData.customization.color === color
                      ? 'border-white scale-110'
                      : 'border-white/30'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return projectData.name.trim().length > 0;
      case 1: return projectData.template !== null;
      case 2: return projectData.customization.text.trim().length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(projectData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-150 ${
                index <= currentStep
                  ? 'bg-accent text-white'
                  : 'bg-white/20 text-white/60'
              }`}
            >
              {index < currentStep ? <Check size={16} /> : index + 1}
            </div>
          ))}
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">{steps[currentStep].title}</h2>
        {steps[currentStep].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={currentStep === 0 ? onClose : handlePrev}
        >
          {currentStep === 0 ? 'Cancel' : (
            <>
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!isStepValid()}
        >
          {currentStep === steps.length - 1 ? 'Create Animation' : (
            <>
              Next
              <ChevronRight size={16} className="ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default WizardSteps;