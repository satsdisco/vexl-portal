'use client';

import { motion } from 'framer-motion';
import { Users, Shield, Globe, Star } from 'lucide-react';

interface Club {
  name: string;
  members: number;
  location: string;
  trusted: boolean;
  description: string;
}

interface ClubsShowcaseProps {
  clubs?: Club[];
  interactive?: boolean;
}

export function ClubsShowcase({ 
  clubs = [
    { name: "Prague Bitcoin Club", members: 250, location: "Prague, CZ", trusted: true, description: "Weekly meetups, verified traders" },
    { name: "Berlin BTC Traders", members: 180, location: "Berlin, DE", trusted: true, description: "Focus on privacy and security" },
    { name: "London P2P Network", members: 320, location: "London, UK", trusted: false, description: "Large community, daily trades" },
    { name: "NYC Bitcoin Meetup", members: 450, location: "New York, US", trusted: true, description: "Established 2019, trusted network" }
  ],
  interactive = true 
}: ClubsShowcaseProps) {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto p-8">
      {clubs.map((club, index) => (
        <motion.div
          key={index}
          className="relative p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 hover:border-yellow-400 transition-all cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={interactive ? { scale: 1.05 } : {}}
        >
          {club.trusted && (
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
              <Shield size={16} className="text-white" />
            </div>
          )}
          
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-yellow-400/10 rounded-lg">
              <Users className="text-yellow-400" size={24} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{club.members}</div>
              <div className="text-xs text-gray-400">members</div>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2">{club.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <Globe size={14} />
            <span>{club.location}</span>
          </div>
          <p className="text-sm text-gray-500">{club.description}</p>
          
          {interactive && (
            <button className="mt-4 w-full py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition">
              Join Club
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}