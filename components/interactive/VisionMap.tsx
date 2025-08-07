'use client';

import { motion } from 'framer-motion';
import { MapPin, Users, Globe, Shield } from 'lucide-react';

interface VisionMapProps {
  interactive?: boolean;
}

export function VisionMap({ interactive = true }: VisionMapProps) {
  const milestones = [
    { year: "2024", title: "Foundation", description: "Launch core P2P trading", icon: Shield, status: "completed" },
    { year: "2025", title: "Growth", description: "100,000+ active users", icon: Users, status: "current" },
    { year: "2026", title: "Expansion", description: "Global club network", icon: Globe, status: "future" },
    { year: "2027", title: "Revolution", description: "Redefine Bitcoin trading", icon: MapPin, status: "future" }
  ];
  
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-yellow-400 via-gray-600 to-gray-800"></div>
        
        {/* Milestones */}
        <div className="space-y-12">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            const isLeft = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Content */}
                <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <motion.div
                    className={`p-6 rounded-lg border-2 ${
                      milestone.status === 'completed' 
                        ? 'bg-green-900/20 border-green-700' 
                        : milestone.status === 'current'
                        ? 'bg-yellow-400/10 border-yellow-400'
                        : 'bg-gray-900 border-gray-700'
                    }`}
                    whileHover={interactive ? { scale: 1.05 } : {}}
                  >
                    <div className={`text-2xl font-bold mb-2 ${
                      milestone.status === 'completed' 
                        ? 'text-green-400' 
                        : milestone.status === 'current'
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                    }`}>
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-400">{milestone.description}</p>
                  </motion.div>
                </div>
                
                {/* Center Icon */}
                <div className="w-2/12 flex justify-center">
                  <motion.div
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' 
                        ? 'bg-green-500' 
                        : milestone.status === 'current'
                        ? 'bg-yellow-400'
                        : 'bg-gray-700'
                    }`}
                    whileHover={interactive ? { scale: 1.2, rotate: 360 } : {}}
                    transition={{ type: "spring" }}
                  >
                    <Icon className={`${
                      milestone.status === 'completed' || milestone.status === 'current'
                        ? 'text-black' 
                        : 'text-gray-400'
                    }`} size={24} />
                    
                    {milestone.status === 'current' && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-yellow-400"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ opacity: 0.3 }}
                      />
                    )}
                  </motion.div>
                </div>
                
                {/* Empty space for alignment */}
                <div className="w-5/12"></div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Progress Indicator */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="inline-block px-6 py-3 bg-yellow-400 text-black font-bold rounded-full">
            We are here → Building the future of P2P Bitcoin trading
          </div>
        </motion.div>
      </div>
    </div>
  );
}