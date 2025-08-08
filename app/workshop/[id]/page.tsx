'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X, Home, Maximize2, Minimize2, AlertCircle } from 'lucide-react';
import { WebOfTrust } from '@/components/interactive/WebOfTrust';
import { PhoneMockup } from '@/components/interactive/PhoneMockup';
import { ClubsShowcase } from '@/components/interactive/ClubsShowcase';
import { EconomicsCalculator } from '@/components/interactive/EconomicsCalculator';
import { VisionMap } from '@/components/interactive/VisionMap';
import { GetStartedCTA } from '@/components/interactive/GetStartedCTA';
import PolishedLoader from '@/components/PolishedLoader';
import Link from 'next/link';
import { presentationAPI, convertFromStrapiFormat } from '@/lib/strapi-service';
import { vexlWorkshopTemplate } from '@/lib/vexl-workshop-template';

export default function PresentationViewer() {
  const params = useParams();
  const router = useRouter();
  const [presentation, setPresentation] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPresentation();
  }, [params.id]);

  const loadPresentation = async () => {
    try {
      setLoading(true);
      setError(null);

      if (params.id === 'template') {
        // Load the default template
        setPresentation(vexlWorkshopTemplate);
      } else {
        // Try to load from Strapi
        const result = await presentationAPI.getById(params.id as string, '*');
        
        if (result.success && result.data) {
          const formatted = convertFromStrapiFormat(result.data);
          setPresentation(formatted);
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem('vexl-presentations');
          if (stored) {
            const presentations = JSON.parse(stored);
            const found = presentations.find((p: any) => p.id === params.id);
            if (found) {
              setPresentation(found);
            } else {
              setError('Presentation not found');
            }
          } else {
            setError('Presentation not found');
          }
        }
      }
    } catch (err) {
      console.error('Error loading presentation:', err);
      setError('Failed to load presentation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (presentation) {
      setProgress((currentSection / Math.max(presentation.sections.length - 1, 1)) * 100);
    }
  }, [currentSection, presentation]);

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
    if (presentation && currentSection < presentation.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderInteractiveComponent = (section: any) => {
    switch (section.template) {
      case 'web-of-trust':
        return <WebOfTrust />;
      case 'phone-mockup':
        return <PhoneMockup screenshots={section.content?.screenshots || []} />;
      case 'clubs-showcase':
        return <ClubsShowcase />;
      case 'economics-calculator':
        return <EconomicsCalculator />;
      case 'vision-map':
        return <VisionMap />;
      case 'get-started':
        return <GetStartedCTA />;
      default:
        return null;
    }
  };

  if (loading) {
    return <PolishedLoader text="Loading presentation..." fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link 
          href="/workshop"
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition"
        >
          Back to Workshops
        </Link>
      </div>
    );
  }

  if (!presentation) {
    return null;
  }

  const sections = presentation.sections;
  const current = sections[currentSection];

  return (
    <div className={`min-h-screen bg-black text-white ${isFullscreen ? 'overflow-hidden' : ''}`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800">
        <motion.div 
          className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>

      {/* Header */}
      {!isFullscreen && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur border-b border-gray-800">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-800 rounded transition"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-xl font-bold text-yellow-400">{presentation.title}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-800 rounded transition"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <Link 
                href="/dashboard"
                className="p-2 hover:bg-gray-800 rounded transition"
              >
                <Home size={20} />
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && !isFullscreen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-16 bottom-0 w-80 bg-gray-900 border-r border-gray-800 z-30 overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Sections</h2>
              <div className="space-y-2">
                {sections.map((section: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSection(index);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded transition ${
                      currentSection === index 
                        ? 'bg-yellow-400 text-black font-bold' 
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="text-sm opacity-70">Section {index + 1}</div>
                    <div>{section.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`${!isFullscreen ? 'pt-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.section
            key={currentSection}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center p-8"
          >
            <div className="max-w-6xl w-full">
              {current.template ? (
                renderInteractiveComponent(current)
              ) : (
                <div className="text-center">
                  <h2 className="text-5xl font-bold mb-6">{current.title}</h2>
                  {current.subtitle && (
                    <p className="text-2xl text-gray-400 mb-8">{current.subtitle}</p>
                  )}
                  {current.content?.body && (
                    <div className="text-xl leading-relaxed max-w-3xl mx-auto">
                      {current.content.body}
                    </div>
                  )}
                  {current.content?.bullets && (
                    <ul className="text-left max-w-2xl mx-auto mt-8 space-y-4">
                      {current.content.bullets.map((bullet: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-400 mr-3">•</span>
                          <span className="text-lg">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Navigation Controls */}
      {!isFullscreen && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-40">
          <button
            onClick={prevSection}
            disabled={currentSection === 0}
            className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="px-4 py-2 bg-gray-800 rounded-full">
            {currentSection + 1} / {sections.length}
          </div>
          
          <button
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      {!isFullscreen && (
        <div className="fixed bottom-8 right-8 text-sm text-gray-500">
          <div>← → Navigate</div>
          <div>F Fullscreen</div>
          <div>ESC Exit</div>
        </div>
      )}
    </div>
  );
}