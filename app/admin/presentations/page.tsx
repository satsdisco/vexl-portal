'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Play, Plus, Copy, Trash2, Image, Type, 
  Users, Shield, BarChart, Globe, Eye, Edit3,
  ChevronLeft, ChevronRight, Layers
} from 'lucide-react';
import Link from 'next/link';

// Pre-designed templates matching the original workshop style
const slideTemplates = {
  trustBeatsRatings: {
    name: 'Trust vs Ratings',
    preview: '⭐ vs 👥',
    component: 'TrustComparison',
    defaultContent: {
      mainTitle: 'TRUST BEATS RATINGS',
      subtitle: 'Ratings create surveillance databases. Real trust creates freedom.',
      tagline: "TRUST CAN'T BE RATED",
      description: "Trust isn't a number - it's people you know vouching for people they know",
      leftCard: {
        title: '5-Star Stranger',
        icon: '🤖',
        rating: '⭐⭐⭐⭐⭐',
        description: '"BitcoinTrader2024" - 500+ reviews',
        warning: 'Could be anyone. Or anything.'
      },
      rightCard: {
        title: "Your Friend's Plumber",
        icon: '👷',
        rating: 'No ratings',
        description: '"Mike fixed my sink last week, trades bitcoin too"',
        highlight: 'Real person. Real trust.'
      }
    }
  },
  privacyFirst: {
    name: 'Privacy First',
    preview: '🔒',
    component: 'PrivacySlide',
    defaultContent: {
      mainTitle: 'PRIVACY FIRST',
      subtitle: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
      description: 'We refuse to track your trades because we refuse to become a honeypot',
      tabs: ['Data Collection', 'Privacy Tech', 'Import Strategy'],
      activeTab: 1,
      leftPanel: {
        title: 'Your Phone',
        contacts: [
          { name: 'Pizza Palace', phone: '+420 123 456 789', highlight: true },
          { name: 'John Bitcoin', phone: '+1 555 0123' },
          { name: 'Coffee Shop', phone: '+420 987 654 321' }
        ]
      },
      rightPanel: {
        title: 'Vexl Servers',
        hash: '#a8b2c9d4f7e1',
        description: 'One-way hash (irreversible)',
        lock: true,
        message: 'We literally cannot see your phone number'
      }
    }
  },
  networkEffect: {
    name: 'Network Visualization',
    preview: '🕸️',
    component: 'WebOfTrust',
    defaultContent: {
      title: 'Your Network is Your Net Worth',
      interactive: true,
      expandable: true,
      showCalculation: true
    }
  },
  phoneDemo: {
    name: 'Phone Mockup',
    preview: '📱',
    component: 'PhoneMockup',
    defaultContent: {
      title: 'How It Works',
      steps: [
        { title: 'Import Contacts', description: 'Find your trusted network' },
        { title: 'Browse Offers', description: 'See who wants to trade' },
        { title: 'Make Contact', description: 'Connect directly, no middleman' },
        { title: 'Trade Freely', description: 'Your terms, your way' }
      ]
    }
  }
};

interface Slide {
  id: string;
  type: string;
  [key: string]: any;
}

interface Presentation {
  title: string;
  slides: Slide[];
  id?: string;
}

export default function PresentationEditor() {
  const [presentation, setPresentation] = useState<Presentation>({
    title: 'New Presentation',
    slides: []
  });
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editMode, setEditMode] = useState('visual'); // visual or data
  const [previewMode, setPreviewMode] = useState(false);
  
  const currentSlide = presentation.slides[currentSlideIndex];
  
  const addSlide = (templateKey: string) => {
    const template = slideTemplates[templateKey as keyof typeof slideTemplates];
    if (!template) return;
    
    const newSlide = {
      id: Date.now().toString(),
      type: templateKey,
      ...template.defaultContent
    };
    
    const newSlides = [...presentation.slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    
    setPresentation({
      ...presentation,
      slides: newSlides
    });
    setCurrentSlideIndex(currentSlideIndex + 1);
  };
  
  const updateSlideContent = (field: string, value: any) => {
    const newSlides = [...presentation.slides];
    newSlides[currentSlideIndex] = {
      ...currentSlide,
      [field]: value
    };
    setPresentation({
      ...presentation,
      slides: newSlides
    });
  };
  
  const renderSlidePreview = (slide: any) => {
    if (!slide) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Plus className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">Click a template to add your first slide</p>
          </div>
        </div>
      );
    }
    
    // Render based on slide type
    switch (slide.type) {
      case 'trustBeatsRatings':
        return (
          <div className="h-full bg-black text-white p-12 flex flex-col justify-center">
            <h1 className="text-7xl font-black text-center mb-4">
              {editMode === 'visual' ? (
                <input
                  className="bg-transparent text-center w-full focus:outline-none focus:bg-gray-900"
                  value={slide.mainTitle}
                  onChange={(e) => updateSlideContent('mainTitle', e.target.value)}
                />
              ) : (
                slide.mainTitle
              )}
            </h1>
            <p className="text-xl text-gray-400 text-center mb-8">{slide.subtitle}</p>
            
            <div className="bg-yellow-400 text-black text-2xl font-bold text-center py-4 px-8 mx-auto mb-12">
              {slide.tagline}
            </div>
            
            <p className="text-center text-gray-300 mb-12">{slide.description}</p>
            
            <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
                <div className="text-6xl text-center mb-4">{slide.leftCard.icon}</div>
                <h3 className="text-xl font-bold text-center mb-2">{slide.leftCard.title}</h3>
                <div className="text-yellow-400 text-center mb-4">{slide.leftCard.rating}</div>
                <p className="text-gray-400 text-center text-sm">{slide.leftCard.description}</p>
                <p className="text-red-400 text-center text-xs mt-4">{slide.leftCard.warning}</p>
              </div>
              
              <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8">
                <div className="text-6xl text-center mb-4">{slide.rightCard.icon}</div>
                <h3 className="text-xl font-bold text-center mb-2">{slide.rightCard.title}</h3>
                <div className="text-gray-500 text-center mb-4">{slide.rightCard.rating}</div>
                <p className="text-gray-400 text-center text-sm">{slide.rightCard.description}</p>
                <p className="text-green-400 text-center text-xs mt-4">{slide.rightCard.highlight}</p>
              </div>
            </div>
            
            <div className="text-center mt-8 text-yellow-400">
              Who would you rather trade with?
            </div>
          </div>
        );
        
      case 'privacyFirst':
        return (
          <div className="h-full bg-black text-white p-12 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-8">
              <div className="text-yellow-400 font-bold">vexl</div>
              <div className="text-gray-400 text-sm">P2P BITCOIN WITHOUT KYC</div>
              <div className="text-gray-400">VEXL.IT</div>
            </div>
            
            <h1 className="text-7xl font-black text-center mb-4">
              <span className="text-white">PRIVACY </span>
              <span className="text-yellow-400">FIRST</span>
            </h1>
            
            <p className="text-gray-400 text-center mb-4">{slide.subtitle}</p>
            <p className="text-xl text-center mb-12">{slide.description}</p>
            
            <div className="flex justify-center gap-4 mb-8">
              {slide.tabs.map((tab: string, i: number) => (
                <button
                  key={i}
                  className={`px-6 py-3 rounded ${
                    i === slide.activeTab 
                      ? 'bg-yellow-400 text-black font-bold' 
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="bg-yellow-400 text-black text-xl font-bold text-center py-4 mb-8">
              YOUR PRIVACY IS MATHEMATICALLY GUARANTEED
            </div>
            
            <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-gray-400 mb-4">{slide.leftPanel.title}</h3>
                {slide.leftPanel.contacts.map((contact: any, i: number) => (
                  <div 
                    key={i}
                    className={`p-3 mb-2 rounded ${
                      contact.highlight ? 'bg-yellow-400 text-black' : 'bg-gray-800'
                    }`}
                  >
                    <div className="font-bold">{contact.name}</div>
                    <div className="text-sm opacity-75">{contact.phone}</div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <h3 className="text-gray-400 mb-4">{slide.rightPanel.title}</h3>
                <div className="text-yellow-400 font-mono text-xl mb-4">
                  {slide.rightPanel.hash}
                </div>
                <div className="text-gray-500 text-sm mb-4">
                  {slide.rightPanel.description}
                </div>
                {slide.rightPanel.lock && (
                  <div className="text-6xl mb-4">🔒</div>
                )}
                <p className="text-gray-300">{slide.rightPanel.message}</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400">Slide type: {slide.type}</p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-800 rounded">
              <ChevronLeft size={20} />
            </Link>
            <input
              value={presentation.title}
              onChange={(e) => setPresentation({...presentation, title: e.target.value})}
              className="bg-transparent text-xl font-bold focus:outline-none focus:bg-gray-900 px-2 py-1 rounded"
            />
            <span className="text-sm text-gray-400">
              {presentation.slides.length} slides
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(editMode === 'visual' ? 'data' : 'visual')}
              className={`px-4 py-2 rounded ${
                editMode === 'visual' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-800'
              }`}
            >
              <Edit3 size={16} className="inline mr-2" />
              {editMode === 'visual' ? 'Visual Edit' : 'Data Edit'}
            </button>
            
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
            >
              <Eye size={16} className="inline mr-2" />
              Preview
            </button>
            
            <Link
              href={`/workshop/preview/${presentation.id || 'new'}`}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
            >
              <Play size={16} className="inline mr-2" />
              Present
            </Link>
            
            <button className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500">
              <Save size={16} className="inline mr-2" />
              Save
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-73px)]">
        {/* Template Sidebar */}
        <div className="w-80 border-r border-gray-800 bg-gray-950 p-4 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-400 mb-4">SLIDE TEMPLATES</h3>
          
          <div className="space-y-2">
            {Object.entries(slideTemplates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => addSlide(key)}
                className="w-full p-4 bg-gray-900 hover:bg-gray-800 rounded-lg text-left transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl mb-2">{template.preview}</div>
                    <div className="font-bold">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.component}</div>
                  </div>
                  <Plus className="text-gray-600 group-hover:text-yellow-400 transition" size={20} />
                </div>
              </button>
            ))}
          </div>
          
          {/* Slide List */}
          <h3 className="text-sm font-bold text-gray-400 mt-8 mb-4">SLIDES</h3>
          <div className="space-y-2">
            {presentation.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-full p-3 rounded-lg text-left transition ${
                  index === currentSlideIndex
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Slide {index + 1}</div>
                    <div className="text-xs opacity-70">{slide.type}</div>
                  </div>
                  <Layers size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Canvas */}
        <div className="flex-1 bg-gray-950 p-8">
          <div className="h-full max-w-6xl mx-auto">
            <div className="bg-black rounded-lg aspect-video overflow-hidden border border-gray-800">
              {renderSlidePreview(currentSlide)}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="p-2 hover:bg-gray-800 rounded disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="text-sm text-gray-400">
                {currentSlideIndex + 1} / {presentation.slides.length || 1}
              </span>
              
              <button
                onClick={() => setCurrentSlideIndex(Math.min(presentation.slides.length - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === presentation.slides.length - 1}
                className="p-2 hover:bg-gray-800 rounded disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Properties Panel */}
        {editMode === 'data' && currentSlide && (
          <div className="w-96 border-l border-gray-800 bg-gray-950 p-4 overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-400 mb-4">SLIDE PROPERTIES</h3>
            
            <div className="space-y-4">
              {Object.entries(currentSlide).map(([key, value]) => {
                if (key === 'id' || key === 'type') return null;
                
                return (
                  <div key={key}>
                    <label className="block text-xs text-gray-400 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </label>
                    {typeof value === 'string' ? (
                      <input
                        value={value}
                        onChange={(e) => updateSlideContent(key, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-800 focus:border-yellow-400 focus:outline-none"
                      />
                    ) : (
                      <textarea
                        value={JSON.stringify(value, null, 2)}
                        onChange={(e) => {
                          try {
                            updateSlideContent(key, JSON.parse(e.target.value));
                          } catch {}
                        }}
                        className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-800 focus:border-yellow-400 focus:outline-none font-mono text-xs"
                        rows={6}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}