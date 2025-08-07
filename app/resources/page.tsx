'use client';

import { motion } from 'framer-motion';
import { Download, FileText, Video, Image, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
  const resources = [
    {
      category: 'Presentation Materials',
      items: [
        { name: 'Vexl Workshop Slides', type: 'PDF', size: '2.4 MB', icon: FileText },
        { name: 'Ambassador Pitch Deck', type: 'PDF', size: '1.8 MB', icon: FileText },
        { name: 'Quick Start Guide', type: 'PDF', size: '800 KB', icon: FileText }
      ]
    },
    {
      category: 'Marketing Assets',
      items: [
        { name: 'Vexl Logo Pack', type: 'ZIP', size: '5.2 MB', icon: Image },
        { name: 'Social Media Templates', type: 'ZIP', size: '3.1 MB', icon: Image },
        { name: 'Print Materials', type: 'ZIP', size: '12.4 MB', icon: Image }
      ]
    },
    {
      category: 'Video Content',
      items: [
        { name: 'Introduction to Vexl', type: 'MP4', size: '45 MB', icon: Video },
        { name: 'How P2P Trading Works', type: 'MP4', size: '32 MB', icon: Video },
        { name: 'Privacy Features Demo', type: 'MP4', size: '28 MB', icon: Video }
      ]
    }
  ];
  
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-800 rounded transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Resources</h1>
            <p className="text-gray-400 text-sm">Download materials and guides</p>
          </div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.a
            href="https://vexl.it"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h3 className="font-bold">Vexl Website</h3>
              <p className="text-sm text-gray-400">Official site</p>
            </div>
            <ExternalLink className="text-yellow-400" size={20} />
          </motion.a>
          
          <motion.a
            href="#"
            className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <h3 className="font-bold">Brand Guidelines</h3>
              <p className="text-sm text-gray-400">Style guide</p>
            </div>
            <FileText className="text-yellow-400" size={20} />
          </motion.a>
          
          <motion.a
            href="#"
            className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h3 className="font-bold">FAQ</h3>
              <p className="text-sm text-gray-400">Common questions</p>
            </div>
            <FileText className="text-yellow-400" size={20} />
          </motion.a>
        </div>
        
        {/* Resources by Category */}
        {resources.map((category, categoryIndex) => (
          <motion.section
            key={categoryIndex}
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: categoryIndex * 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {category.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition cursor-pointer border border-gray-800 hover:border-yellow-400"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: categoryIndex * 0.2 + index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                        <Icon className="text-yellow-400" size={20} />
                      </div>
                      <span className="text-xs text-gray-500">{item.type}</span>
                    </div>
                    <h3 className="font-bold mb-1">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{item.size}</span>
                      <button className="text-yellow-400 hover:text-yellow-500 transition">
                        <Download size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
        
        {/* Help Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Need Custom Materials?</h3>
          <p className="text-gray-400 mb-4">
            Contact the Vexl team for custom presentations or materials tailored to your community.
          </p>
          <button className="px-6 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition">
            Request Materials
          </button>
        </div>
      </div>
    </div>
  );
}