'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Menu, X, Home } from 'lucide-react';
import Link from 'next/link';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import type { Presentation } from '@/lib/strapi-types';

import ForkButton from '@/components/ForkButton';
import type { UserRole } from '@/lib/auth-helpers';

interface WorkshopViewerProps {
  presentation: Presentation;
  userRole?: UserRole;
}

export default function WorkshopViewer({ presentation, userRole }: WorkshopViewerProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sections = presentation.attributes.sections?.data || [];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        navigateToSection(currentSection + 1);
      }
      if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigateToSection(currentSection - 1);
      }
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection, sections.length]);

  // Track scroll position for progress
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = document.querySelectorAll('[data-section]');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sectionElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;

        if (scrollPosition >= top && scrollPosition <= bottom) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = useCallback((index: number) => {
    if (index >= 0 && index < sections.length) {
      const element = document.querySelector(`[data-section="${index}"]`);
      element?.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(index);
    }
  }, [sections.length]);

  const progress = sections.length > 0 ? ((currentSection + 1) / sections.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ backgroundColor: vexlBrand.colors.gray[900] }}>
        <motion.div 
          className="h-full"
          style={{ backgroundColor: vexlBrand.colors.primary.yellow }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur border-b"
        style={{ borderColor: vexlBrand.colors.gray[800] }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded transition"
              style={{ 
                backgroundColor: sidebarOpen ? vexlBrand.colors.gray[800] : 'transparent',
                color: vexlBrand.colors.primary.white
              }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 
              className="text-xl font-bold"
              style={{ color: vexlBrand.colors.primary.yellow }}
            >
              {presentation.attributes.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ForkButton
              presentationId={presentation.id}
              presentationTitle={presentation.attributes.title}
              userRole={userRole}
            />
            <Link 
              href="/workshop"
              className="p-2 rounded transition hover:bg-gray-800"
            >
              <Home size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-16 bottom-0 w-80 z-30 overflow-y-auto border-r"
            style={{ 
              backgroundColor: vexlBrand.colors.gray[900],
              borderColor: vexlBrand.colors.gray[800]
            }}
          >
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Sections</h2>
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      navigateToSection(index);
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded transition"
                    style={{
                      backgroundColor: currentSection === index 
                        ? vexlBrand.colors.primary.yellow 
                        : 'transparent',
                      color: currentSection === index 
                        ? vexlBrand.colors.primary.black 
                        : vexlBrand.colors.primary.white,
                    }}
                  >
                    <div className="text-sm opacity-70">Section {index + 1}</div>
                    <div className="font-medium">{section.attributes.title || 'Untitled'}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 pb-24">
        {sections.map((section, sectionIndex) => (
          <section
            key={section.id}
            data-section={sectionIndex}
            id={`section-${sectionIndex}`}
            className="min-h-[80vh] flex items-center justify-center px-6 py-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl w-full"
            >
              {/* Section Header */}
              {(section.attributes.title || section.attributes.subtitle) && (
                <div className="text-center mb-12">
                  {section.attributes.title && (
                    <h2 
                      className="text-4xl md:text-5xl font-bold mb-4"
                      style={{ 
                        fontFamily: vexlBrand.typography.fontFamily.primary,
                        color: vexlBrand.colors.primary.yellow 
                      }}
                    >
                      {section.attributes.title}
                    </h2>
                  )}
                  {section.attributes.subtitle && (
                    <p 
                      className="text-xl"
                      style={{ color: vexlBrand.colors.gray[400] }}
                    >
                      {section.attributes.subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Render Blocks */}
              {section.attributes.content?.blocks?.map((block, blockIndex) => (
                <BlockRenderer 
                  key={`${section.id}-block-${blockIndex}`} 
                  block={block} 
                  index={blockIndex}
                />
              ))}

              {/* Fallback if no blocks */}
              {(!section.attributes.content?.blocks || section.attributes.content.blocks.length === 0) && (
                <div 
                  className="text-center py-12"
                  style={{ color: vexlBrand.colors.gray[500] }}
                >
                  <p>No content blocks in this section</p>
                </div>
              )}
            </motion.div>
          </section>
        ))}
      </main>

      {/* Floating Navigation */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-30">
        <button
          onClick={() => navigateToSection(currentSection - 1)}
          disabled={currentSection === 0}
          className="p-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: vexlBrand.colors.gray[800],
            color: vexlBrand.colors.primary.white
          }}
        >
          <ChevronUp size={24} />
        </button>
        
        <div 
          className="px-4 py-2 rounded-full text-center"
          style={{ 
            backgroundColor: vexlBrand.colors.gray[800],
            color: vexlBrand.colors.primary.white
          }}
        >
          {currentSection + 1} / {sections.length}
        </div>
        
        <button
          onClick={() => navigateToSection(currentSection + 1)}
          disabled={currentSection === sections.length - 1}
          className="p-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: vexlBrand.colors.gray[800],
            color: vexlBrand.colors.primary.white
          }}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* Keyboard Hints */}
      <div className="fixed bottom-8 left-8 text-sm" style={{ color: vexlBrand.colors.gray[600] }}>
        <div>J/↓ Next section</div>
        <div>K/↑ Previous section</div>
      </div>
    </div>
  );
}