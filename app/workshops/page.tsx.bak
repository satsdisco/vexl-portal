'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Clock, Users, Edit, Play, Trash2, Search } from 'lucide-react';
import { strapiClient, auth } from '@/lib/strapi';

interface Workshop {
  id: number;
  documentId: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  slides: Array<{id: string; type: string; title: string}>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function WorkshopsPage() {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchWorkshops();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWorkshops = async () => {
    try {
      const { data } = await strapiClient.get('/workshops?populate=*');
      setWorkshops(data.data || []);
    } catch (error) {
      console.error('Failed to fetch workshops:', error);
    }
    setLoading(false);
  };

  const deleteWorkshop = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    
    try {
      await strapiClient.delete(`/workshops/${documentId}`);
      fetchWorkshops();
    } catch (error) {
      console.error('Failed to delete workshop:', error);
    }
  };

  const filteredWorkshops = workshops.filter(w => 
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading workshops...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-2xl font-bold text-yellow-400">
                VEXL
              </Link>
              <span className="text-gray-400">/ Workshops</span>
            </div>
            <Link
              href="/workshops/new"
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition"
            >
              <Plus size={18} />
              <span>Create Workshop</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search workshops..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Workshops Grid */}
        {filteredWorkshops.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">No workshops yet</h2>
            <p className="text-gray-400 mb-6">Create your first workshop to get started</p>
            <Link
              href="/workshops/new"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition"
            >
              <Plus size={20} />
              <span>Create Workshop</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <div
                key={workshop.documentId}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-yellow-400 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{workshop.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    workshop.status === 'published' 
                      ? 'bg-green-900 text-green-400' 
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {workshop.status || 'draft'}
                  </span>
                </div>
                
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {workshop.description || 'No description'}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{workshop.duration || 30} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{workshop.slides?.length || 0} slides</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/workshops/${workshop.documentId}/edit`}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded transition"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </Link>
                  <Link
                    href={`/workshops/${workshop.documentId}/present`}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-400 text-black font-bold hover:bg-yellow-500 rounded transition"
                  >
                    <Play size={16} />
                    <span>Present</span>
                  </Link>
                  <button
                    onClick={() => deleteWorkshop(workshop.documentId)}
                    className="p-2 bg-red-900 hover:bg-red-800 rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}