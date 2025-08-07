'use client';

import { motion } from 'framer-motion';
import { Download, Users, ArrowRight, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface GetStartedCTAProps {
  interactive?: boolean;
}

export function GetStartedCTA({ interactive = true }: GetStartedCTAProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  
  const steps = [
    { icon: Download, title: "Download Vexl", description: "Available on iOS & Android", color: "green" },
    { icon: Users, title: "Import Contacts", description: "Find your trusted network", color: "blue" },
    { icon: ArrowRight, title: "Start Trading", description: "P2P Bitcoin, your way", color: "yellow" }
  ];
  
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl md:text-5xl font-black text-yellow-400 mb-8">
          Ready to Join the Revolution?
        </h2>
        
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredStep === index;
            
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => interactive && setHoveredStep(index)}
                onMouseLeave={() => interactive && setHoveredStep(null)}
              >
                <motion.div
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isHovered 
                      ? 'bg-yellow-400/10 border-yellow-400' 
                      : 'bg-gray-900 border-gray-700'
                  }`}
                  animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    step.color === 'green' ? 'bg-green-500' :
                    step.color === 'blue' ? 'bg-blue-500' :
                    'bg-yellow-400'
                  }`}>
                    <Icon className="text-black" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </motion.div>
                
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-600"
                    animate={isHovered ? { x: 5 } : { x: 0 }}
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* QR Code Section */}
        <motion.div
          className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border-2 border-yellow-400"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg">
                {/* QR Code Placeholder */}
                <div className="w-full h-full bg-black rounded flex items-center justify-center">
                  <Smartphone className="text-white" size={48} />
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">Scan to download</p>
            </div>
            
            <div className="text-left">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Join 50,000+ Users Trading P2P
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> No KYC Required
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Complete Privacy
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Your Network, Your Rules
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Available Worldwide
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
        
        {/* Final CTA */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button className="px-8 py-4 bg-yellow-400 text-black font-black text-lg rounded-lg hover:bg-yellow-500 transition transform hover:scale-105">
            Download Vexl Now →
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Available for iOS and Android • No email required
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}