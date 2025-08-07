'use client';

import { motion } from 'framer-motion';
import { Users, Globe, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const clubs = [
    { name: 'Prague Bitcoin Club', members: 250, location: 'Prague, CZ', nextMeetup: 'Tomorrow' },
    { name: 'Berlin P2P Traders', members: 180, location: 'Berlin, DE', nextMeetup: 'Friday' },
    { name: 'London Network', members: 320, location: 'London, UK', nextMeetup: 'Next Week' },
    { name: 'NYC Bitcoin Meetup', members: 450, location: 'New York, US', nextMeetup: 'Saturday' }
  ];
  
  const events = [
    { title: 'Introduction to Vexl Workshop', date: 'Aug 10', attendees: 45, type: 'Workshop' },
    { title: 'P2P Trading Best Practices', date: 'Aug 15', attendees: 67, type: 'Webinar' },
    { title: 'Privacy & Security Meetup', date: 'Aug 20', attendees: 32, type: 'Meetup' }
  ];
  
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-800 rounded transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Community Hub</h1>
            <p className="text-gray-400 text-sm">Connect with ambassadors worldwide</p>
          </div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Clubs', value: '127', icon: Users },
            { label: 'Countries', value: '45', icon: Globe },
            { label: 'Ambassadors', value: '5.2K', icon: Users },
            { label: 'Monthly Events', value: '89', icon: Calendar }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg p-4 text-center"
              >
                <Icon className="text-yellow-400 mx-auto mb-2" size={32} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Clubs */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Featured Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubs.map((club, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition cursor-pointer border border-gray-800 hover:border-yellow-400"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{club.name}</h3>
                  <span className="text-yellow-400 text-sm">Active</span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{club.members} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    <span>{club.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Next meetup: {club.nextMeetup}</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition">
                  Join Club
                </button>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Events */}
        <section>
          <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 transition"
              >
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <div className="text-sm text-gray-400 mt-1">
                    {event.date} • {event.attendees} attending • {event.type}
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition">
                  Register
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}