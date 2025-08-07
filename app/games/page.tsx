'use client';

import { motion } from 'framer-motion';
import { Trophy, Brain, Target, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  const games = [
    {
      id: 'bitcoin-quiz',
      title: 'Bitcoin Knowledge Quiz',
      description: 'Test your understanding of Bitcoin and P2P trading',
      icon: Brain,
      difficulty: 'Medium',
      questions: 10,
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'privacy-challenge',
      title: 'Privacy Challenge',
      description: 'Learn about protecting your identity while trading',
      icon: Shield,
      difficulty: 'Hard',
      questions: 15,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'network-builder',
      title: 'Network Builder',
      description: 'Simulate building your trading network',
      icon: Users,
      difficulty: 'Easy',
      questions: 8,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'trading-simulator',
      title: 'Trading Simulator',
      description: 'Practice P2P trading scenarios',
      icon: Target,
      difficulty: 'Medium',
      questions: 12,
      color: 'from-green-400 to-green-600'
    }
  ];
  
  const achievements = [
    { name: 'First Trade', description: 'Complete your first quiz', progress: 0, total: 1 },
    { name: 'Network Master', description: 'Score 100% on Network Builder', progress: 0, total: 1 },
    { name: 'Privacy Expert', description: 'Complete all privacy challenges', progress: 0, total: 5 },
    { name: 'Bitcoin Scholar', description: 'Answer 50 questions correctly', progress: 12, total: 50 }
  ];
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-800 rounded transition">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Games & Quizzes</h1>
              <p className="text-gray-400 text-sm">Test your knowledge and earn achievements</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            <span className="text-xl font-bold">1,250 XP</span>
          </div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Games Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Available Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition cursor-pointer border border-gray-800 hover:border-yellow-400"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition rounded-lg`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                        <Icon className="text-black" size={24} />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        game.difficulty === 'Easy' ? 'bg-green-900 text-green-400' :
                        game.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
                        'bg-red-900 text-red-400'
                      }`}>
                        {game.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">{game.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{game.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{game.questions} questions</span>
                      <button className="text-yellow-400 font-bold hover:text-yellow-500 transition">
                        Play →
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
        
        {/* Achievements */}
        <section>
          <h2 className="text-xl font-bold mb-6">Your Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg p-4 border border-gray-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{achievement.name}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                  <Zap className={`${
                    achievement.progress >= achievement.total ? 'text-yellow-400' : 'text-gray-600'
                  }`} size={20} />
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.total}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      className="bg-yellow-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Coming Soon */}
        <div className="mt-12 p-8 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 rounded-lg text-center">
          <Trophy className="text-yellow-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">Leaderboards Coming Soon!</h3>
          <p className="text-gray-400">
            Compete with other ambassadors worldwide and climb the ranks
          </p>
        </div>
      </div>
    </div>
  );
}

// Import Shield and Users icons
import { Shield, Users } from 'lucide-react';