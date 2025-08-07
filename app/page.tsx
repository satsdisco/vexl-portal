'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle, Users, BookOpen, Trophy, Sparkles, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

export default function PortalHome() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const features = [
    {
      icon: PlayCircle,
      title: "Interactive Workshop",
      description: "Experience the complete P2P Bitcoin trading journey",
      link: "/workshop",
      color: "from-yellow-400 to-yellow-600",
      delay: 0.1
    },
    {
      icon: Trophy,
      title: "Games & Quizzes",
      description: "Test your knowledge and earn achievements",
      link: "/games",
      color: "from-green-400 to-green-600",
      delay: 0.2
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with other ambassadors worldwide",
      link: "/community",
      color: "from-blue-400 to-blue-600",
      delay: 0.3
    },
    {
      icon: BookOpen,
      title: "Resources",
      description: "Access marketing materials and guides",
      link: "/resources",
      color: "from-purple-400 to-purple-600",
      delay: 0.4
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "100+", label: "Cities", icon: Globe },
    { value: "0%", label: "KYC Required", icon: Shield },
    { value: "24/7", label: "P2P Trading", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-black to-gray-900/20" />
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 p-6 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-black text-yellow-400">VEXL</div>
          <div className="text-sm text-gray-400">Ambassador Portal</div>
        </div>
        <nav className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-yellow-400 transition">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-300 hover:text-yellow-400 transition">
                Profile
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/login');
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 px-6 py-20 text-center max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your Network is Your
          <span className="block text-yellow-400">Net Worth</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Welcome to the Vexl Ambassador Portal - your hub for spreading the P2P Bitcoin revolution
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            href="/presentation/demo"
            className="group px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition flex items-center justify-center gap-2"
          >
            View Full Presentation
            <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
          </Link>
          <Link 
            href="/onboarding"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition flex items-center justify-center gap-2"
          >
            <PlayCircle size={20} />
            New Ambassador?
          </Link>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="relative z-10 px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon className="text-yellow-400 mx-auto mb-3" size={32} />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="relative z-10 px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Ambassador Tools & Resources
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: feature.delay }}
                >
                  <Link href={feature.link}>
                    <div className="group relative h-full p-8 bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg hover:border-yellow-400 transition-all cursor-pointer overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition`} />
                      
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                          <Icon className="text-black" size={24} />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-400 mb-4">
                          {feature.description}
                        </p>
                        
                        <div className="flex items-center text-yellow-400 font-bold">
                          <span>Explore</span>
                          <ArrowRight className="ml-2 group-hover:translate-x-2 transition" size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="relative z-10 px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Spread the Revolution?</h2>
            <p className="text-gray-300 mb-8">
              Join thousands of ambassadors building the future of P2P Bitcoin trading
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/workshop"
                className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
              >
                Start Interactive Workshop
              </Link>
              <Link 
                href="/resources"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Download Resources
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 Vexl Ambassador Portal
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition">
              Terms
            </Link>
            <Link href="/support" className="text-gray-400 hover:text-yellow-400 text-sm transition">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}