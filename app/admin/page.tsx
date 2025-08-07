'use client';

import { motion } from 'framer-motion';
import { Plus, Edit, Play, Copy, Trash2, Calendar, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminDashboard() {
  const [presentations, setPresentations] = useState([
    {
      id: '1',
      title: 'Vexl Official Workshop',
      slides: 11,
      lastEdited: '2 hours ago',
      status: 'published'
    },
    {
      id: '2', 
      title: 'Quick Introduction',
      slides: 5,
      lastEdited: '1 day ago',
      status: 'draft'
    }
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Presentation Manager</h1>
            <p className="text-gray-400 text-sm">Create and manage beautiful presentations</p>
          </div>
          <Link
            href="/admin/presentations"
            className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition flex items-center gap-2"
          >
            <Plus size={20} />
            New Presentation
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Presentations', value: '12', icon: FileText, color: 'text-yellow-400' },
            { label: 'Total Slides', value: '145', icon: Copy, color: 'text-blue-400' },
            { label: 'Views This Week', value: '3.2K', icon: Users, color: 'text-green-400' },
            { label: 'Last Updated', value: 'Today', icon: Calendar, color: 'text-purple-400' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg p-6 text-center"
              >
                <Icon className={`${stat.color} mx-auto mb-3`} size={32} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Presentations List */}
        <section>
          <h2 className="text-xl font-bold mb-6">Your Presentations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation, index) => (
              <motion.div
                key={presentation.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-yellow-400 transition group"
              >
                {/* Preview */}
                <div className="aspect-video bg-gradient-to-br from-yellow-400/20 to-gray-900 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-black text-yellow-400/30">VEXL</div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      presentation.status === 'published' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {presentation.status}
                    </span>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{presentation.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>{presentation.slides} slides</span>
                    <span>{presentation.lastEdited}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/presentations?id=${presentation.id}`}
                      className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded text-center transition"
                    >
                      <Edit size={16} className="inline mr-1" />
                      Edit
                    </Link>
                    <Link
                      href={`/workshop/preview/${presentation.id}`}
                      className="flex-1 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 text-center transition"
                    >
                      <Play size={16} className="inline mr-1" />
                      Present
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Add New Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: presentations.length * 0.1 }}
            >
              <Link
                href="/admin/presentations"
                className="h-full min-h-[300px] bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center hover:border-yellow-400 hover:bg-gray-900 transition group"
              >
                <Plus className="text-gray-600 group-hover:text-yellow-400 mb-3 transition" size={48} />
                <span className="text-gray-400 group-hover:text-white transition">Create New</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Template Library */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Template Library</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Trust vs Ratings', icon: '⭐', slides: 3 },
              { name: 'Privacy First', icon: '🔒', slides: 4 },
              { name: 'Network Effect', icon: '🕸️', slides: 2 },
              { name: 'Phone Demo', icon: '📱', slides: 5 },
              { name: 'Clubs Showcase', icon: '👥', slides: 3 },
              { name: 'Economics', icon: '📊', slides: 2 },
              { name: 'Security', icon: '🛡️', slides: 4 },
              { name: 'Call to Action', icon: '🚀', slides: 1 }
            ].map((template, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-900 hover:bg-gray-800 rounded-lg text-center transition hover:scale-105"
              >
                <div className="text-3xl mb-2">{template.icon}</div>
                <div className="text-sm font-bold">{template.name}</div>
                <div className="text-xs text-gray-500">{template.slides} slides</div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Help Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Need Help?</h3>
          <p className="text-gray-400 mb-4">
            This visual editor lets you create beautiful presentations like the original Vexl workshop.
            Click any text to edit it directly, or use the properties panel for detailed control.
          </p>
          <div className="flex gap-4">
            <Link href="/docs" className="text-yellow-400 hover:underline">
              View Documentation →
            </Link>
            <Link href="/workshop" className="text-yellow-400 hover:underline">
              See Example Workshop →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}