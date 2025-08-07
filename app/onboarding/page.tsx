'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Check, Users, Shield, Globe, Download } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to Vexl",
      icon: Globe,
      content: "Join the peer-to-peer Bitcoin revolution. Trade Bitcoin directly with people you trust, without intermediaries.",
      action: "Let's Start"
    },
    {
      title: "How It Works",
      icon: Users,
      content: "Vexl connects you with your existing network. Import contacts, find trusted traders, and maintain complete privacy.",
      action: "Next"
    },
    {
      title: "Your Privacy Matters",
      icon: Shield,
      content: "No KYC. No data collection. No centralized servers. Your trades stay between you and your trading partner.",
      action: "Continue"
    },
    {
      title: "Get the App",
      icon: Download,
      content: "Download Vexl on your phone to start trading. Available for iOS and Android.",
      action: "Complete Setup"
    }
  ];
  
  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      window.location.href = '/dashboard';
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                  index <= currentStep ? 'bg-yellow-400' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="text-center"
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-8 bg-yellow-400 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Icon className="text-black" size={48} />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-6">{currentStepData.title}</h1>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            {currentStepData.content}
          </p>
          
          <button
            onClick={nextStep}
            className="group px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition inline-flex items-center gap-2"
          >
            {currentStepData.action}
            <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
          </button>
        </motion.div>
        
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-8 text-gray-400 hover:text-white transition"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}