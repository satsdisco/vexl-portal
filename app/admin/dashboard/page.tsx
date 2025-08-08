'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Presentation, 
  Users, 
  FileText,
  Settings,
  BarChart3,
  Plus,
  Play,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  Eye,
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import { animations } from '@/lib/animations';
import PolishedLoader from '@/components/PolishedLoader';
import { presentationAPI, convertFromStrapiFormat } from '@/lib/strapi-service';

interface Presentation {
  id: string;
  title: string;
  sections: number;
  lastEdited: string;
  status: 'draft' | 'published';
  views?: number;
}

interface Stats {
  totalPresentations: number;
  totalViews: number;
  activeUsers: number;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPresentations: 0,
    totalViews: 0,
    activeUsers: 0,
    lastUpdated: new Date().toLocaleDateString()
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Try to load from Strapi first
      const result = await presentationAPI.getAll('*');
      
      if (result.success && result.data.length > 0) {
        // Convert Strapi format to frontend format
        const formattedPresentations = result.data.map(convertFromStrapiFormat);
        setPresentations(formattedPresentations);
        setStats({
          totalPresentations: formattedPresentations.length,
          totalViews: formattedPresentations.reduce((acc: number, p: any) => acc + (p.views || 0), 0),
          activeUsers: Math.floor(Math.random() * 100) + 50,
          lastUpdated: new Date().toLocaleDateString()
        });
      } else {
        // Fallback to localStorage if Strapi is empty or unavailable
        const storedPresentations = localStorage.getItem('vexl-presentations');
        if (storedPresentations) {
          const parsed = JSON.parse(storedPresentations);
          setPresentations(parsed);
          setStats({
            totalPresentations: parsed.length,
            totalViews: parsed.reduce((acc: number, p: Presentation) => acc + (p.views || 0), 0),
            activeUsers: Math.floor(Math.random() * 100) + 50,
            lastUpdated: new Date().toLocaleDateString()
          });
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to localStorage on error
      const storedPresentations = localStorage.getItem('vexl-presentations');
      if (storedPresentations) {
        const parsed = JSON.parse(storedPresentations);
        setPresentations(parsed);
        setStats({
          totalPresentations: parsed.length,
          totalViews: parsed.reduce((acc: number, p: Presentation) => acc + (p.views || 0), 0),
          activeUsers: Math.floor(Math.random() * 100) + 50,
          lastUpdated: new Date().toLocaleDateString()
        });
      }
    }
    
    setTimeout(() => setLoading(false), 500);
  };

  const deletePresentation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this presentation?')) return;
    
    try {
      // Try to delete from Strapi
      const result = await presentationAPI.delete(id);
      
      if (result.success) {
        // Update local state
        const updated = presentations.filter(p => p.id !== id);
        setPresentations(updated);
        
        // Also update localStorage as backup
        localStorage.setItem('vexl-presentations', JSON.stringify(updated));
      } else {
        // Fallback to localStorage only
        const updated = presentations.filter(p => p.id !== id);
        setPresentations(updated);
        localStorage.setItem('vexl-presentations', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error deleting presentation:', error);
      // Fallback to localStorage only
      const updated = presentations.filter(p => p.id !== id);
      setPresentations(updated);
      localStorage.setItem('vexl-presentations', JSON.stringify(updated));
    }
  };

  const filteredPresentations = presentations.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'presentations', label: 'Presentations', icon: Presentation },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return <PolishedLoader text="Loading dashboard..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b" style={{ borderColor: vexlBrand.colors.gray[800] }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div 
                  className="text-2xl font-black"
                  style={{ color: vexlBrand.colors.primary.yellow }}
                >
                  VEXL
                </div>
                <span className="text-sm text-gray-400">Admin</span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link 
                href="/admin/builder"
                className="px-4 py-2 font-bold rounded-lg flex items-center gap-2 transition hover:scale-105"
                style={{ 
                  backgroundColor: vexlBrand.colors.primary.yellow,
                  color: vexlBrand.colors.primary.black
                }}
              >
                <Plus size={18} />
                Create Presentation
              </Link>
              
              <Link 
                href="/"
                className="text-gray-400 hover:text-white transition"
              >
                Exit Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className="w-64 min-h-screen border-r"
          style={{ 
            backgroundColor: vexlBrand.colors.gray[950],
            borderColor: vexlBrand.colors.gray[800]
          }}
        >
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-yellow-400 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  style={activeTab === tab.id ? {
                    backgroundColor: vexlBrand.colors.primary.yellow,
                    color: vexlBrand.colors.primary.black
                  } : {}}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  className="p-6 rounded-xl border"
                  style={{ 
                    backgroundColor: vexlBrand.colors.gray[900],
                    borderColor: vexlBrand.colors.gray[800]
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Presentation className="text-yellow-400" size={24} />
                    <TrendingUp className="text-green-400" size={16} />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.totalPresentations}</div>
                  <div className="text-sm text-gray-400">Total Presentations</div>
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl border"
                  style={{ 
                    backgroundColor: vexlBrand.colors.gray[900],
                    borderColor: vexlBrand.colors.gray[800]
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Eye className="text-blue-400" size={24} />
                    <TrendingUp className="text-green-400" size={16} />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.totalViews}</div>
                  <div className="text-sm text-gray-400">Total Views</div>
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl border"
                  style={{ 
                    backgroundColor: vexlBrand.colors.gray[900],
                    borderColor: vexlBrand.colors.gray[800]
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Users className="text-green-400" size={24} />
                    <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded">Live</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.activeUsers}</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl border"
                  style={{ 
                    backgroundColor: vexlBrand.colors.gray[900],
                    borderColor: vexlBrand.colors.gray[800]
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="text-purple-400" size={24} />
                  </div>
                  <div className="text-lg font-bold mb-1">{stats.lastUpdated}</div>
                  <div className="text-sm text-gray-400">Last Updated</div>
                </motion.div>
              </div>

              {/* Recent Presentations */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recent Presentations</h2>
                  <Link 
                    href="/admin/builder"
                    className="text-yellow-400 hover:underline text-sm"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {presentations.slice(0, 3).map((presentation, index) => (
                    <motion.div
                      key={presentation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: vexlBrand.colors.gray[900],
                        borderColor: vexlBrand.colors.gray[800]
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold">{presentation.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          presentation.status === 'published'
                            ? 'bg-green-400/20 text-green-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {presentation.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-3">
                        {presentation.sections} sections • {presentation.lastEdited}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/builder?id=${presentation.id}`}
                          className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded text-center text-sm transition"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/presentation/${presentation.id}`}
                          className="flex-1 py-2 text-center text-sm rounded transition"
                          style={{ 
                            backgroundColor: vexlBrand.colors.primary.yellow,
                            color: vexlBrand.colors.primary.black
                          }}
                        >
                          Present
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link
                    href="/admin/builder"
                    className="p-4 rounded-lg border text-center hover:border-yellow-400 transition group"
                    style={{ 
                      backgroundColor: vexlBrand.colors.gray[900],
                      borderColor: vexlBrand.colors.gray[800]
                    }}
                  >
                    <Plus className="mx-auto mb-2 group-hover:text-yellow-400 transition" size={24} />
                    <span className="text-sm">New Presentation</span>
                  </Link>
                  
                  <button
                    className="p-4 rounded-lg border text-center hover:border-yellow-400 transition group"
                    style={{ 
                      backgroundColor: vexlBrand.colors.gray[900],
                      borderColor: vexlBrand.colors.gray[800]
                    }}
                  >
                    <Upload className="mx-auto mb-2 group-hover:text-yellow-400 transition" size={24} />
                    <span className="text-sm">Import</span>
                  </button>
                  
                  <button
                    className="p-4 rounded-lg border text-center hover:border-yellow-400 transition group"
                    style={{ 
                      backgroundColor: vexlBrand.colors.gray[900],
                      borderColor: vexlBrand.colors.gray[800]
                    }}
                  >
                    <Download className="mx-auto mb-2 group-hover:text-yellow-400 transition" size={24} />
                    <span className="text-sm">Export</span>
                  </button>
                  
                  <Link
                    href="/admin/settings"
                    className="p-4 rounded-lg border text-center hover:border-yellow-400 transition group"
                    style={{ 
                      backgroundColor: vexlBrand.colors.gray[900],
                      borderColor: vexlBrand.colors.gray[800]
                    }}
                  >
                    <Settings className="mx-auto mb-2 group-hover:text-yellow-400 transition" size={24} />
                    <span className="text-sm">Settings</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'presentations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">All Presentations</h1>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search presentations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  
                  <button className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-yellow-400 transition">
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPresentations.map((presentation, index) => (
                  <motion.div
                    key={presentation.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border rounded-lg overflow-hidden hover:border-yellow-400 transition"
                    style={{ 
                      backgroundColor: vexlBrand.colors.gray[900],
                      borderColor: vexlBrand.colors.gray[800]
                    }}
                  >
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
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{presentation.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span>{presentation.sections} sections</span>
                        <span>{presentation.lastEdited}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/builder?id=${presentation.id}`}
                          className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded text-center transition flex items-center justify-center gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </Link>
                        <Link
                          href={`/presentation/${presentation.id}`}
                          className="flex-1 py-2 font-bold rounded text-center transition flex items-center justify-center gap-1"
                          style={{ 
                            backgroundColor: vexlBrand.colors.primary.yellow,
                            color: vexlBrand.colors.primary.black
                          }}
                        >
                          <Play size={14} />
                          Present
                        </Link>
                        <button
                          onClick={() => deletePresentation(presentation.id)}
                          className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Add New Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: filteredPresentations.length * 0.05 }}
                >
                  <Link
                    href="/admin/builder"
                    className="h-full min-h-[300px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-yellow-400 transition group"
                    style={{ 
                      backgroundColor: vexlBrand.colors.gray[900] + '50',
                      borderColor: vexlBrand.colors.gray[700]
                    }}
                  >
                    <Plus className="text-gray-600 group-hover:text-yellow-400 mb-3 transition" size={48} />
                    <span className="text-gray-400 group-hover:text-white transition">Create New</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold mb-8">Analytics</h1>
              
              <div className="p-8 rounded-lg border text-center"
                style={{ 
                  backgroundColor: vexlBrand.colors.gray[900],
                  borderColor: vexlBrand.colors.gray[800]
                }}
              >
                <BarChart3 className="mx-auto text-gray-600 mb-4" size={64} />
                <p className="text-gray-400">Analytics dashboard coming soon</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold mb-8">Settings</h1>
              
              <div className="max-w-2xl space-y-6">
                <div className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: vexlBrand.colors.gray[900],
                    borderColor: vexlBrand.colors.gray[800]
                  }}
                >
                  <h2 className="text-xl font-bold mb-4">Presentation Defaults</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Default Theme</label>
                      <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                        <option>Vexl Dark</option>
                        <option>Vexl Light</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Auto-save Interval</label>
                      <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                        <option>Every 30 seconds</option>
                        <option>Every minute</option>
                        <option>Every 5 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: vexlBrand.colors.gray[900],
                    borderColor: vexlBrand.colors.gray[800]
                  }}
                >
                  <h2 className="text-xl font-bold mb-4">Export & Backup</h2>
                  <div className="space-y-4">
                    <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                      Export All Presentations
                    </button>
                    <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                      Create Backup
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}