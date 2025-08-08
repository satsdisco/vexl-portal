'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Users, Plus, Search, BookOpen, Star } from 'lucide-react';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import Link from 'next/link';
import PolishedLoader from '@/components/PolishedLoader';
import { presentationAPI, convertFromStrapiFormat } from '@/lib/strapi-service';

export default function WorkshopList() {
  const [presentations, setPresentations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      // Load from Strapi ONLY - no localStorage fallback
      const { strapiFetch } = await import('@/lib/strapi-fetch');
      const response = await strapiFetch.getPresentations({
        populate: 'sections',
        sort: 'createdAt:desc'
      });
      
      if (response.data && response.data.length > 0) {
        const formatted = response.data.map(item => ({
          id: item.id.toString(),
          slug: item.attributes.slug,
          title: item.attributes.title,
          description: item.attributes.description,
          duration: (item.attributes as any).duration || '30 min',
          difficulty: (item.attributes as any).difficulty || 'Beginner',
          isTemplate: (item.attributes as any).isTemplate || false,
          isMaster: (item.attributes as any).isMaster || false,
          sections: item.attributes.sections?.data?.length || 0,
          author: 'Vexl Team'
        }));
        setPresentations(formatted);
      } else {
        setPresentations([]);
      }
    } catch (error) {
      console.error('Error loading presentations from Strapi:', error);
      setPresentations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPresentations = presentations.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <PolishedLoader text="Loading workshops..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span style={{ color: vexlBrand.colors.primary.yellow }}>Workshop</span> Library
              </h1>
              <p className="text-gray-400">Interactive presentations to spread the Vexl message</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/admin/builder"
                className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Create New
              </Link>
              
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search workshops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:border-yellow-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Presentations Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresentations.map((presentation) => (
            <motion.div
              key={presentation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{presentation.title}</h3>
                    {presentation.isTemplate && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-bold rounded">
                        <Star size={12} />
                        TEMPLATE
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {presentation.description || 'No description available'}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {presentation.duration || 30} min
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} />
                    {presentation.sections?.length || presentation.sections || 0} sections
                  </span>
                  {presentation.author && (
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {presentation.author}
                    </span>
                  )}
                </div>

                {/* Difficulty Badge */}
                {presentation.difficulty && (
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${
                      presentation.difficulty === 'beginner' 
                        ? 'bg-green-500/20 text-green-400'
                        : presentation.difficulty === 'intermediate'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {presentation.difficulty.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/workshop/${presentation.slug || presentation.id}`}
                    className="flex-1 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition flex items-center justify-center gap-2"
                  >
                    <Play size={16} />
                    {presentation.isMaster ? 'View Masterclass' : 'Start Workshop'}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPresentations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No workshops found</p>
            <Link
              href="/admin/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
            >
              <Plus size={18} />
              Create Your First Workshop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}