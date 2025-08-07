'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  screenshot?: string;
  action: 'tap' | 'swipe' | 'complete';
}

interface PhoneMockupProps {
  steps: Step[];
  interactive?: boolean;
  autoPlay?: boolean;
}

export function PhoneMockup({ steps, interactive = true, autoPlay = false }: PhoneMockupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompleted([...completed, steps[currentStep].id]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (interactive) {
      setCurrentStep(index);
    }
  };

  const current = steps[currentStep];

  return (
    <div className="flex items-center justify-center gap-12 h-full">
      {/* Phone Device */}
      <div className="relative">
        <motion.div 
          className="relative w-[300px] h-[600px] bg-gray-900 rounded-[40px] p-3 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Screen */}
          <div className="relative w-full h-full bg-black rounded-[30px] overflow-hidden">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-black/50 backdrop-blur z-10 flex items-center justify-between px-6">
              <span className="text-white text-xs">9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-3 bg-white rounded-sm"></div>
                <div className="w-4 h-3 bg-white rounded-sm"></div>
                <div className="w-4 h-3 bg-white rounded-sm"></div>
              </div>
            </div>
            
            {/* App Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className="absolute inset-0 pt-8"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Mock Screenshot or Content */}
                <div className="h-full bg-gradient-to-b from-gray-900 to-black p-6 flex flex-col">
                  {/* Vexl Header */}
                  <div className="text-center mb-8">
                    <div className="text-3xl font-black text-yellow-400">VEXL</div>
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    {current.action === 'tap' && (
                      <motion.div
                        className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <span className="text-3xl">👆</span>
                      </motion.div>
                    )}
                    
                    {current.action === 'swipe' && (
                      <motion.div
                        className="flex items-center gap-4"
                        animate={{ x: [0, 30, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <ChevronRight className="text-yellow-400" size={40} />
                        <ChevronRight className="text-yellow-400/60" size={40} />
                        <ChevronRight className="text-yellow-400/30" size={40} />
                      </motion.div>
                    )}
                    
                    {current.action === 'complete' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="text-white" size={48} />
                      </motion.div>
                    )}
                    
                    <div className="mt-8 text-center">
                      <h3 className="text-white text-xl font-bold mb-2">
                        {current.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {current.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Navigation Dots */}
                  <div className="flex justify-center gap-2 pb-4">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentStep 
                            ? 'bg-yellow-400 w-8' 
                            : completed.includes(steps[index].id)
                            ? 'bg-green-400'
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Phone Notch */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full"></div>
        </motion.div>
      </div>
      
      {/* Step Controls */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              index === currentStep
                ? 'bg-yellow-400 text-black'
                : completed.includes(step.id)
                ? 'bg-green-900/30 text-green-400 border border-green-800'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
            onClick={() => handleStepClick(index)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === currentStep
                  ? 'bg-black text-yellow-400'
                  : completed.includes(step.id)
                  ? 'bg-green-900 text-green-400'
                  : 'bg-gray-800 text-gray-500'
              }`}>
                {completed.includes(step.id) ? <Check size={16} /> : index + 1}
              </div>
              <div>
                <div className="font-bold">{step.title}</div>
                <div className="text-sm opacity-80">{step.description}</div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {interactive && currentStep < steps.length - 1 && (
          <motion.button
            className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
            onClick={handleNextStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Next Step →
          </motion.button>
        )}
      </div>
    </div>
  );
}