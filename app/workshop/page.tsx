'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X, Home, Maximize2, Minimize2 } from 'lucide-react';
import { vexlWorkshopTemplate } from '@/lib/vexl-workshop-template';
import { WebOfTrust } from '@/components/interactive/WebOfTrust';
import { PhoneMockup } from '@/components/interactive/PhoneMockup';
import { ClubsShowcase } from '@/components/interactive/ClubsShowcase';
import { EconomicsCalculator } from '@/components/interactive/EconomicsCalculator';
import { VisionMap } from '@/components/interactive/VisionMap';
import { GetStartedCTA } from '@/components/interactive/GetStartedCTA';
import Link from 'next/link';

export default function InteractiveWorkshop() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const sections = vexlWorkshopTemplate.sections;
  const current = sections[currentSection];

  useEffect(() => {
    setProgress((currentSection / (sections.length - 1)) * 100);
  }, [currentSection, sections.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSection();
      if (e.key === 'ArrowLeft') prevSection();
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'f') setIsFullscreen(!isFullscreen);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection, isFullscreen]);

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderSection = () => {
    const content = current.content as any;

    // Special components
    if (content?.component) {
      switch (content.component) {
        case 'WebOfTrust':
          return (
            <WebOfTrust
              nodes={content.nodes || []}
              connections={content.connections || []}
              interactive={content.interactive !== false}
              expandable={content.expandable !== false}
              showCalculation={content.showCalculation !== false}
            />
          );
        
        case 'PhoneMockup':
          return (
            <PhoneMockup
              steps={content.steps || []}
              interactive={content.interactive !== false}
              autoPlay={content.autoPlay}
            />
          );
        
        case 'ClubsShowcase':
          return <ClubsShowcase clubs={content.clubs} interactive={content.interactive !== false} />;
        
        case 'MarketplaceView':
          return <MarketplaceView offers={content.offers || []} />;
        
        case 'EconomicsCalculator':
          return <EconomicsCalculator interactive={content.interactive !== false} />;
        
        case 'VisionMap':
          return <VisionMap interactive={content.interactive !== false} />;
        
        case 'GetStartedCTA':
          return <GetStartedCTA interactive={content.interactive !== false} />;
        
        case 'ContactImportDemo':
          return <ContactImportDemo contacts={content.contacts || []} />;
          
        case 'SecurityFeatures':
          return <SecurityFeatures features={content.features || []} />;
      }
    }

    // Default template rendering
    switch (current.template) {
      case 'hook':
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            {content?.showLogo && (
              <motion.div 
                className="text-6xl font-black text-yellow-400 mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                VEXL
              </motion.div>
            )}
            <motion.h1 
              className="text-5xl md:text-7xl font-black text-white mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {current.title}
            </motion.h1>
            {current.subtitle && (
              <motion.p 
                className="text-2xl text-gray-400 max-w-3xl"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {current.subtitle}
              </motion.p>
            )}
            {content?.mainMessage && (
              <motion.p 
                className="text-xl text-yellow-400 mt-8 max-w-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {content.mainMessage}
              </motion.p>
            )}
          </div>
        );

      case 'comparison':
        return (
          <div className="p-12 h-full flex flex-col justify-center">
            <h2 className="text-4xl font-black text-yellow-400 text-center mb-12">{current.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
              <motion.div 
                className="bg-red-900/20 border-2 border-red-600 rounded-lg p-8"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h3 className="text-2xl font-bold text-red-400 mb-6">{content?.leftTitle}</h3>
                <ul className="space-y-4">
                  {content?.leftItems?.map((item: string, index: number) => (
                    <motion.li 
                      key={index}
                      className="text-gray-300"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-green-900/20 border-2 border-green-600 rounded-lg p-8"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h3 className="text-2xl font-bold text-green-400 mb-6">{content?.rightTitle}</h3>
                <ul className="space-y-4">
                  {content?.rightItems?.map((item: string, index: number) => (
                    <motion.li 
                      key={index}
                      className="text-gray-300"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        );

      case 'feature':
        return (
          <div className="p-12 h-full flex flex-col justify-center">
            <h2 className="text-4xl font-black text-yellow-400 text-center mb-12">{current.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {content?.features?.map((feature: any, index: number) => (
                <motion.div
                  key={index}
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="p-12 h-full flex flex-col justify-center">
            <h2 className="text-4xl font-black text-yellow-400 text-center mb-12">{current.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {content?.stats?.map((stat: any, index: number) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                >
                  <div className="text-5xl font-black text-yellow-400 mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-12 h-full flex flex-col justify-center">
            <h2 className="text-4xl font-black text-yellow-400 text-center mb-8">{current.title}</h2>
            {current.subtitle && (
              <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto">
                {current.subtitle}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-black text-white ${isFullscreen ? '' : ''}`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800">
        <motion.div 
          className="h-full bg-yellow-400"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>

      {/* Header */}
      {!isFullscreen && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur border-b border-gray-800">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-800 rounded transition"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="text-sm text-gray-400">
                Section {currentSection + 1} of {sections.length}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-800 rounded transition"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <Link 
                href="/"
                className="p-2 hover:bg-gray-800 rounded transition"
              >
                <Home size={20} />
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {sidebarOpen && !isFullscreen && (
          <motion.aside
            className="fixed left-0 top-16 bottom-0 z-30 w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
          >
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-400 mb-4">SECTIONS</h3>
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSection(index);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition ${
                    index === currentSection
                      ? 'bg-yellow-400 text-black'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{section.title}</div>
                      <div className="text-xs opacity-70">{section.duration} min</div>
                    </div>
                    {index === currentSection && (
                      <ChevronRight size={16} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`${!isFullscreen ? 'pt-16' : ''} min-h-screen relative`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full max-w-7xl mx-auto">
              {renderSection()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex items-center space-x-4 bg-gray-900/90 backdrop-blur rounded-full px-6 py-3 shadow-lg">
            <button
              onClick={prevSection}
              disabled={currentSection === 0}
              className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-sm font-bold px-4">
              {currentSection + 1} / {sections.length}
            </div>
            
            <button
              onClick={nextSection}
              disabled={currentSection === sections.length - 1}
              className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Speaker Notes (for presenter) */}
        {current.notes && !isFullscreen && (
          <motion.div
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30 max-w-2xl w-full px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gray-900/90 backdrop-blur rounded-lg p-4 text-sm text-gray-400">
              <div className="text-xs text-yellow-400 mb-2">SPEAKER NOTES</div>
              {current.notes}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// Component placeholders (these already exist in components/interactive/)
function ContactImportDemo({ contacts }: { contacts: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto p-8">
      {contacts.map((contact, index) => (
        <motion.div
          key={index}
          className="p-4 bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-yellow-400 transition cursor-pointer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white">{contact.name}</div>
              <div className="text-sm text-gray-400">{contact.trades} trades</div>
            </div>
            {contact.trusted && (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                ✓
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MarketplaceView({ offers }: { offers: any[] }) {
  return (
    <div className="space-y-4 max-w-3xl mx-auto p-8">
      {offers.map((offer, index) => (
        <motion.div
          key={index}
          className={`p-6 rounded-lg border-2 ${
            offer.type === 'buy' 
              ? 'bg-green-900/20 border-green-800' 
              : 'bg-blue-900/20 border-blue-800'
          }`}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.15 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-white">{offer.amount}</div>
              <div className="text-yellow-400 text-xl">{offer.price}</div>
              <div className="text-gray-400 text-sm mt-2">
                📍 {offer.location} • {offer.distance}
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400">⭐ {offer.rating}</div>
              <div className="text-gray-400 text-sm">{offer.trades} trades</div>
              <button className="mt-2 px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500">
                {offer.type === 'buy' ? 'Sell' : 'Buy'}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SecurityFeatures({ features }: { features: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto p-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold text-yellow-400 mb-2">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}