'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  PlayCircle, 
  PlusCircle, 
  Users, 
  Trophy,
  BookOpen,
  TrendingUp,
  Calendar,
  ArrowRight,
  Sparkles,
  LogOut,
  Settings
} from 'lucide-react';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import PolishedLoader from '@/components/PolishedLoader';

interface UserStats {
  workshopsCompleted: number;
  peopleReached: number;
  lastActive: string;
  level: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Ambassador');
  const [stats, setStats] = useState<UserStats>({
    workshopsCompleted: 0,
    peopleReached: 0,
    lastActive: new Date().toLocaleDateString(),
    level: 'Beginner'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Load user data
    const storedName = localStorage.getItem('userName') || 'Ambassador';
    setUserName(storedName);
    
    // Load or generate stats
    const storedStats = localStorage.getItem('userStats');
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    } else {
      const newStats = {
        workshopsCompleted: Math.floor(Math.random() * 10),
        peopleReached: Math.floor(Math.random() * 100) + 20,
        lastActive: new Date().toLocaleDateString(),
        level: 'Rising Star'
      };
      setStats(newStats);
      localStorage.setItem('userStats', JSON.stringify(newStats));
    }

    setTimeout(() => setIsLoading(false), 500);
  }, [router]);

  const quickActions = [
    {
      icon: PlayCircle,
      title: 'Start Workshop',
      description: 'Launch the interactive presentation',
      link: '/workshop',
      color: vexlBrand.colors.primary.yellow,
      primary: true
    },
    {
      icon: PlusCircle,
      title: 'Create Custom',
      description: 'Build your own presentation',
      link: '/admin/builder',
      color: vexlBrand.colors.semantic.success
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with other ambassadors',
      link: '/community',
      color: vexlBrand.colors.semantic.info
    },
    {
      icon: BookOpen,
      title: 'Resources',
      description: 'Marketing materials & guides',
      link: '/resources',
      color: vexlBrand.colors.semantic.warning
    }
  ];

  const achievements = [
    { name: 'First Steps', description: 'Complete your first workshop', completed: true },
    { name: 'Network Builder', description: 'Reach 50 people', completed: stats.peopleReached >= 50 },
    { name: 'Master Presenter', description: 'Complete 10 workshops', completed: stats.workshopsCompleted >= 10 },
    { name: 'Community Leader', description: 'Host a local meetup', completed: false }
  ];

  if (isLoading) {
    return <PolishedLoader text="Loading your dashboard..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b" style={{ borderColor: vexlBrand.colors.gray[800] }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div 
                className="text-2xl font-black"
                style={{ color: vexlBrand.colors.primary.yellow }}
              >
                VEXL
              </div>
              <span className="text-sm text-gray-400">Dashboard</span>
            </Link>
            
            <nav className="flex items-center gap-4">
              <Link 
                href="/admin/dashboard"
                className="text-gray-400 hover:text-white transition"
              >
                Admin
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/login');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2">
            Welcome back, <span style={{ color: vexlBrand.colors.primary.yellow }}>{userName}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Ready to spread the P2P Bitcoin revolution?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div 
            className="p-6 rounded-xl border"
            style={{ 
              backgroundColor: vexlBrand.colors.gray[900],
              borderColor: vexlBrand.colors.gray[800]
            }}
          >
            <Trophy className="text-yellow-400 mb-3" size={24} />
            <div className="text-2xl font-bold mb-1">{stats.level}</div>
            <div className="text-sm text-gray-400">Ambassador Level</div>
          </div>

          <div 
            className="p-6 rounded-xl border"
            style={{ 
              backgroundColor: vexlBrand.colors.gray[900],
              borderColor: vexlBrand.colors.gray[800]
            }}
          >
            <PlayCircle className="text-green-400 mb-3" size={24} />
            <div className="text-2xl font-bold mb-1">{stats.workshopsCompleted}</div>
            <div className="text-sm text-gray-400">Workshops Completed</div>
          </div>

          <div 
            className="p-6 rounded-xl border"
            style={{ 
              backgroundColor: vexlBrand.colors.gray[900],
              borderColor: vexlBrand.colors.gray[800]
            }}
          >
            <Users className="text-blue-400 mb-3" size={24} />
            <div className="text-2xl font-bold mb-1">{stats.peopleReached}</div>
            <div className="text-sm text-gray-400">People Reached</div>
          </div>

          <div 
            className="p-6 rounded-xl border"
            style={{ 
              backgroundColor: vexlBrand.colors.gray[900],
              borderColor: vexlBrand.colors.gray[800]
            }}
          >
            <Calendar className="text-purple-400 mb-3" size={24} />
            <div className="text-lg font-bold mb-1">{stats.lastActive}</div>
            <div className="text-sm text-gray-400">Last Active</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={action.link}
                    className="block p-6 rounded-xl border hover:scale-105 transition-all group"
                    style={{ 
                      backgroundColor: action.primary 
                        ? vexlBrand.colors.primary.yellow + '10'
                        : vexlBrand.colors.gray[900],
                      borderColor: action.primary 
                        ? vexlBrand.colors.primary.yellow
                        : vexlBrand.colors.gray[800]
                    }}
                  >
                    <Icon 
                      className="mb-3 group-hover:scale-110 transition"
                      style={{ color: action.color }}
                      size={32}
                    />
                    <h3 className="font-bold mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{action.description}</p>
                    <div className="flex items-center text-sm font-medium"
                      style={{ color: action.primary ? vexlBrand.colors.primary.yellow : 'white' }}
                    >
                      {action.primary ? 'Start Now' : 'Open'}
                      <ArrowRight className="ml-1 group-hover:translate-x-1 transition" size={14} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="p-4 rounded-lg border flex items-center gap-4"
                style={{ 
                  backgroundColor: vexlBrand.colors.gray[900],
                  borderColor: achievement.completed 
                    ? vexlBrand.colors.primary.yellow 
                    : vexlBrand.colors.gray[800]
                }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.completed 
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-gray-800 text-gray-600'
                }`}>
                  {achievement.completed ? <Trophy size={20} /> : <Sparkles size={20} />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${achievement.completed ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-8 rounded-xl text-center"
          style={{ 
            background: `linear-gradient(135deg, ${vexlBrand.colors.primary.yellow}20, transparent)`,
            border: `1px solid ${vexlBrand.colors.primary.yellow}40`
          }}
        >
          <h2 className="text-2xl font-bold mb-3">Ready to Make an Impact?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Every workshop you run brings us closer to a world of truly peer-to-peer Bitcoin trading. 
            No KYC. No surveillance. Just freedom.
          </p>
          <Link
            href="/workshop"
            className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-lg hover:scale-105 transition"
            style={{ 
              backgroundColor: vexlBrand.colors.primary.yellow,
              color: vexlBrand.colors.primary.black
            }}
          >
            <PlayCircle size={20} />
            Start Workshop Now
          </Link>
        </motion.div>
      </main>
    </div>
  );
}