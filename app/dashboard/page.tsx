'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/strapi';
import { LogOut, Plus, Presentation, User } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{username?: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = async () => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const result = await auth.getMe();
    if (result.success) {
      setUser(result.user);
    } else {
      router.push('/login');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
              <h1 className="text-2xl font-bold text-yellow-400">VEXL</h1>
              <span className="text-gray-400">Ambassador Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">
                Welcome, {user?.username || 'Ambassador'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Workshop Card */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-yellow-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Plus size={32} className="text-yellow-400" />
              <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded">NEW</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Create Workshop</h3>
            <p className="text-gray-400 text-sm">
              Start building your own Vexl presentation
            </p>
          </div>

          {/* My Workshops Card */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-yellow-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Presentation size={32} className="text-yellow-400" />
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">0 WORKSHOPS</span>
            </div>
            <h3 className="text-xl font-bold mb-2">My Workshops</h3>
            <p className="text-gray-400 text-sm">
              View and manage your presentations
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-yellow-400 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <User size={32} className="text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">My Profile</h3>
            <p className="text-gray-400 text-sm">
              Update your information and settings
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">0</div>
            <div className="text-gray-400 text-sm mt-1">Workshops Created</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">0</div>
            <div className="text-gray-400 text-sm mt-1">Total Views</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">0</div>
            <div className="text-gray-400 text-sm mt-1">Active Sessions</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">🚀</div>
            <div className="text-gray-400 text-sm mt-1">Ready to Start</div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-12 bg-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Vexl Ambassador Portal</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            You&apos;re all set up and ready to create amazing Vexl presentations. 
            Start by creating your first workshop or explore the templates to get inspired.
          </p>
          <button className="mt-6 px-6 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition">
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}