'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Users, Globe } from 'lucide-react';

interface EconomicsCalculatorProps {
  interactive?: boolean;
}

export function EconomicsCalculator({ interactive = true }: EconomicsCalculatorProps) {
  const [contacts, setContacts] = useState(10);
  const [avgContactsPerPerson] = useState(250);
  const [tradingPercentage, setTradingPercentage] = useState(5);
  
  const firstDegree = contacts;
  const secondDegree = contacts * avgContactsPerPerson;
  const potentialTraders = Math.round(secondDegree * (tradingPercentage / 100));
  const totalReach = firstDegree + secondDegree;
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calculator Input */}
        <motion.div
          className="p-6 bg-gray-900 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-bold text-yellow-400 mb-6">Your Network Size</h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Your Trusted Contacts
              </label>
              {interactive ? (
                <div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={contacts}
                    onChange={(e) => setContacts(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-2xl font-bold text-white mt-2">{contacts}</div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-white">{contacts}</div>
              )}
            </div>
            
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                % Interested in Bitcoin Trading
              </label>
              {interactive ? (
                <div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={tradingPercentage}
                    onChange={(e) => setTradingPercentage(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-2xl font-bold text-white mt-2">{tradingPercentage}%</div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-white">{tradingPercentage}%</div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Results Display */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-green-400" size={20} />
                <span className="text-gray-400">Direct Connections</span>
              </div>
              <motion.div 
                className="text-2xl font-bold text-green-400"
                key={firstDegree}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {firstDegree}
              </motion.div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="text-blue-400" size={20} />
                <span className="text-gray-400">Extended Network</span>
              </div>
              <motion.div 
                className="text-2xl font-bold text-blue-400"
                key={secondDegree}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {secondDegree.toLocaleString()}
              </motion.div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-yellow-400" size={20} />
                <span className="text-gray-400">Potential Traders</span>
              </div>
              <motion.div 
                className="text-2xl font-bold text-yellow-400"
                key={potentialTraders}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                ~{potentialTraders.toLocaleString()}
              </motion.div>
            </div>
          </div>
          
          <motion.div
            className="p-6 bg-black border-2 border-yellow-400 rounded-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-sm text-gray-400 mb-2">Total Network Reach</div>
            <div className="text-4xl font-black text-yellow-400">
              {totalReach.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              people in your trusted network
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}