'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Home } from 'lucide-react';
import Link from 'next/link';

// Full-screen sections that adapt to content
const sections = [
  {
    id: 'trust-beats-ratings',
    type: 'comparison',
    content: (
      <section className="min-h-screen w-full bg-black text-white flex items-center justify-center p-8 md:p-16">
        <div className="max-w-7xl w-full">
          {/* Main Title - Large and Bold */}
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black text-center mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            TRUST BEATS<br />
            <span className="text-yellow-400">RATINGS</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 text-center mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Ratings create surveillance databases. Real trust creates freedom.
          </motion.p>
          
          {/* Yellow Banner */}
          <motion.div 
            className="bg-yellow-400 text-black py-6 px-8 mx-auto max-w-4xl mb-16"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-center mb-2">
              TRUST CAN'T BE RATED
            </h2>
            <p className="text-lg md:text-xl text-center">
              Trust isn't a number - it's people you know vouching for people they know
            </p>
          </motion.div>
          
          {/* Comparison Cards */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">
              Who would you rather trade with?
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* 5-Star Stranger */}
            <motion.div 
              className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-8 md:p-12"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-6xl md:text-8xl text-center mb-6">🤖</div>
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">
                5-Star Stranger
              </h3>
              <div className="text-yellow-400 text-3xl text-center mb-6">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-gray-400 text-center text-lg mb-4">
                "BitcoinTrader2024" - 500+ reviews
              </p>
              <p className="text-red-400 text-center text-lg font-bold">
                Could be anyone. Or anything.
              </p>
            </motion.div>
            
            {/* Your Friend's Plumber */}
            <motion.div 
              className="bg-gray-900 border-2 border-green-500 rounded-2xl p-8 md:p-12"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-6xl md:text-8xl text-center mb-6">👷</div>
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">
                Your Friend's Plumber
              </h3>
              <div className="text-gray-500 text-xl text-center mb-6">
                No ratings
              </div>
              <p className="text-gray-400 text-center text-lg mb-4">
                "Mike fixed my sink last week, trades bitcoin too"
              </p>
              <p className="text-green-400 text-center text-lg font-bold">
                Real person. Real trust.
              </p>
            </motion.div>
          </div>
          
          {/* Page indicator */}
          <div className="text-center mt-16 text-gray-600 text-sm">
            3 / 11
          </div>
        </div>
      </section>
    )
  },
  {
    id: 'privacy-first',
    type: 'privacy',
    content: (
      <section className="min-h-screen w-full bg-black text-white flex items-center justify-center p-8 md:p-16">
        <div className="max-w-7xl w-full">
          {/* Header Bar */}
          <div className="flex justify-between items-center mb-12 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-yellow-400 font-bold">vexl</span>
            </div>
            <div className="text-gray-400">P2P BITCOIN WITHOUT KYC</div>
            <div className="text-gray-400">VEXL.IT</div>
          </div>
          
          {/* Main Title */}
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            PRIVACY <span className="text-yellow-400">FIRST</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 text-center mb-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Bitcoin: A Peer-to-Peer Electronic Cash System
          </motion.p>
          
          <motion.p 
            className="text-2xl md:text-3xl text-center mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We refuse to track your trades because we refuse to become a honeypot
          </motion.p>
          
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            {['Data Collection', 'Privacy Tech', 'Import Strategy'].map((tab, i) => (
              <button
                key={i}
                className={`px-6 py-3 rounded-lg text-lg font-bold transition ${
                  i === 1 
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Yellow Banner */}
          <motion.div 
            className="bg-yellow-400 text-black py-6 px-8 mb-12"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-black text-center">
              YOUR PRIVACY IS MATHEMATICALLY GUARANTEED
            </h2>
          </motion.div>
          
          {/* Privacy Demo */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Your Phone */}
            <motion.div 
              className="bg-gray-900 rounded-2xl p-8"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl text-gray-400 mb-6">Your Phone</h3>
              <div className="space-y-3">
                <div className="bg-yellow-400 text-black p-4 rounded-lg font-bold">
                  <div className="text-lg">Pizza Palace</div>
                  <div className="text-sm opacity-75">+420 123 456 789</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="font-bold">John Bitcoin</div>
                  <div className="text-sm text-gray-400">+1 555 0123</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="font-bold">Coffee Shop</div>
                  <div className="text-sm text-gray-400">+420 987 654 321</div>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-6 text-center">
                Actual contact data
              </p>
            </motion.div>
            
            {/* Arrow */}
            <motion.div 
              className="hidden md:flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="text-yellow-400 text-4xl">→</div>
            </motion.div>
            
            {/* Vexl Servers */}
            <motion.div 
              className="bg-gray-900 rounded-2xl p-8 text-center"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl text-gray-400 mb-6">Vexl Servers</h3>
              
              <div className="bg-black p-6 rounded-lg mb-6">
                <div className="text-yellow-400 font-mono text-xl md:text-2xl mb-4">
                  #a8b2c9d4f7e1
                </div>
                <div className="text-gray-500 text-sm">
                  One-way hash (irreversible)
                </div>
              </div>
              
              <div className="text-8xl mb-4">🔒</div>
              
              <p className="text-lg text-gray-300">
                We literally cannot see your phone number
              </p>
              
              <p className="text-gray-500 text-sm mt-6">
                What we store
              </p>
            </motion.div>
          </div>
          
          {/* Page indicator */}
          <div className="text-center mt-16 text-gray-600 text-sm">
            4 / 11
          </div>
        </div>
      </section>
    )
  },
  {
    id: 'how-it-works',
    type: 'demo',
    content: (
      <section className="min-h-screen w-full bg-black text-white flex items-center justify-center p-8 md:p-16">
        <div className="max-w-7xl w-full">
          <motion.h1 
            className="text-6xl md:text-8xl font-black text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            HOW IT <span className="text-yellow-400">WORKS</span>
          </motion.h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Import Contacts', desc: 'Find your trusted network', icon: '📱' },
              { step: 2, title: 'Browse Offers', desc: 'See who wants to trade', icon: '🔍' },
              { step: 3, title: 'Make Contact', desc: 'Connect directly, no middleman', icon: '🤝' },
              { step: 4, title: 'Trade Freely', desc: 'Your terms, your way', icon: '✅' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-gray-900 rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <div className="text-yellow-400 text-4xl font-black mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }
];

export default function PresentationView() {
  const [currentSection, setCurrentSection] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const scrollToSection = (index: number) => {
    setCurrentSection(index);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        scrollToSection(currentSection + 1);
      }
      if (e.key === 'ArrowUp' && currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection]);
  
  return (
    <div className="relative">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800">
        <div className="flex justify-between items-center p-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-800 rounded transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="text-sm text-gray-400">
            Section {currentSection + 1} of {sections.length}
          </div>
          
          <Link href="/" className="p-2 hover:bg-gray-800 rounded transition">
            <Home size={24} />
          </Link>
        </div>
      </header>
      
      {/* Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="max-w-2xl w-full p-8">
                <h2 className="text-3xl font-bold text-yellow-400 mb-8">Sections</h2>
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(index)}
                      className={`w-full text-left p-6 rounded-lg transition ${
                        index === currentSection
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      <div className="text-xl font-bold">{section.id.replace(/-/g, ' ').toUpperCase()}</div>
                      <div className="text-sm opacity-70">Section {index + 1}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Current Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {sections[currentSection].content}
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-2">
        {currentSection > 0 && (
          <button
            onClick={() => scrollToSection(currentSection - 1)}
            className="p-4 bg-gray-900/90 backdrop-blur rounded-full hover:bg-gray-800 transition"
          >
            <ChevronDown size={24} className="rotate-180" />
          </button>
        )}
        {currentSection < sections.length - 1 && (
          <button
            onClick={() => scrollToSection(currentSection + 1)}
            className="p-4 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition animate-bounce"
          >
            <ChevronDown size={24} />
          </button>
        )}
      </div>
    </div>
  );
}