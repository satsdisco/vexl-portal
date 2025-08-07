'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Play, Plus, Trash2, Eye, Edit3, ChevronUp, ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';

// Section templates - full screen, adaptive content
const sectionTemplates = {
  trustComparison: {
    name: 'Trust vs Ratings',
    description: 'Full comparison with cards',
    preview: '⭐ vs 👥',
    defaultContent: {
      mainTitle: 'TRUST BEATS',
      mainTitleHighlight: 'RATINGS',
      subtitle: 'Ratings create surveillance databases. Real trust creates freedom.',
      bannerTitle: "TRUST CAN'T BE RATED",
      bannerText: "Trust isn't a number - it's people you know vouching for people they know",
      questionText: 'Who would you rather trade with?',
      leftCard: {
        emoji: '🤖',
        title: '5-Star Stranger',
        rating: '⭐⭐⭐⭐⭐',
        description: '"BitcoinTrader2024" - 500+ reviews',
        warning: 'Could be anyone. Or anything.'
      },
      rightCard: {
        emoji: '👷',
        title: "Your Friend's Plumber",
        rating: 'No ratings',
        description: '"Mike fixed my sink last week, trades bitcoin too"',
        highlight: 'Real person. Real trust.'
      }
    }
  },
  privacySection: {
    name: 'Privacy First',
    description: 'Privacy explanation with demo',
    preview: '🔒',
    defaultContent: {
      title: 'PRIVACY',
      titleHighlight: 'FIRST',
      subtitle: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
      mainText: 'We refuse to track your trades because we refuse to become a honeypot',
      bannerText: 'YOUR PRIVACY IS MATHEMATICALLY GUARANTEED',
      phoneTitle: 'Your Phone',
      serverTitle: 'Vexl Servers',
      hash: '#a8b2c9d4f7e1',
      hashDescription: 'One-way hash (irreversible)',
      serverMessage: 'We literally cannot see your phone number',
      contacts: [
        { name: 'Pizza Palace', phone: '+420 123 456 789', highlight: true },
        { name: 'John Bitcoin', phone: '+1 555 0123' },
        { name: 'Coffee Shop', phone: '+420 987 654 321' }
      ]
    }
  },
  howItWorks: {
    name: 'How It Works',
    description: '4-step process',
    preview: '📱',
    defaultContent: {
      title: 'HOW IT',
      titleHighlight: 'WORKS',
      steps: [
        { number: 1, title: 'Import Contacts', description: 'Find your trusted network', emoji: '📱' },
        { number: 2, title: 'Browse Offers', description: 'See who wants to trade', emoji: '🔍' },
        { number: 3, title: 'Make Contact', description: 'Connect directly, no middleman', emoji: '🤝' },
        { number: 4, title: 'Trade Freely', description: 'Your terms, your way', emoji: '✅' }
      ]
    }
  },
  networkVisualization: {
    name: 'Network Effect',
    description: 'Interactive network demo',
    preview: '🕸️',
    defaultContent: {
      title: 'YOUR NETWORK IS YOUR',
      titleHighlight: 'NET WORTH',
      subtitle: 'Every contact multiplies your trading possibilities',
      showInteractive: true
    }
  },
  statsSection: {
    name: 'Impact Stats',
    description: 'Key metrics display',
    preview: '📊',
    defaultContent: {
      title: 'THE',
      titleHighlight: 'NUMBERS',
      stats: [
        { value: '50K+', label: 'Active Users', emoji: '👥' },
        { value: '100+', label: 'Cities Worldwide', emoji: '🌍' },
        { value: '0%', label: 'KYC Required', emoji: '🔒' },
        { value: '24/7', label: 'P2P Trading', emoji: '⚡' }
      ]
    }
  }
};

interface Section {
  id: string;
  type: string;
  [key: string]: any;
}

interface Presentation {
  title: string;
  sections: Section[];
}

export default function PresentationBuilder() {
  const [presentation, setPresentation] = useState<Presentation>({
    title: 'New Presentation',
    sections: []
  });
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  
  const currentSection = presentation.sections[currentSectionIndex];
  
  const addSection = (templateKey: string) => {
    const template = sectionTemplates[templateKey as keyof typeof sectionTemplates];
    if (!template) return;
    
    const newSection = {
      id: Date.now().toString(),
      type: templateKey,
      ...template.defaultContent
    };
    
    setPresentation({
      ...presentation,
      sections: [...presentation.sections, newSection]
    });
    
    setCurrentSectionIndex(presentation.sections.length);
  };
  
  const updateSection = (field: string, value: any) => {
    const newSections = [...presentation.sections];
    newSections[currentSectionIndex] = {
      ...currentSection,
      [field]: value
    };
    setPresentation({
      ...presentation,
      sections: newSections
    });
  };
  
  const moveSection = (from: number, to: number) => {
    const newSections = [...presentation.sections];
    const [removed] = newSections.splice(from, 1);
    newSections.splice(to, 0, removed);
    setPresentation({
      ...presentation,
      sections: newSections
    });
    setCurrentSectionIndex(to);
  };
  
  const deleteSection = (index: number) => {
    const newSections = presentation.sections.filter((_, i) => i !== index);
    setPresentation({
      ...presentation,
      sections: newSections
    });
    if (currentSectionIndex >= newSections.length) {
      setCurrentSectionIndex(Math.max(0, newSections.length - 1));
    }
  };
  
  const renderSectionPreview = () => {
    if (!currentSection) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-950">
          <div className="text-center">
            <Plus className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-xl text-gray-400 mb-8">No sections yet</p>
            <p className="text-gray-500">Choose a template from the left to get started</p>
          </div>
        </div>
      );
    }
    
    // Render based on section type - FULL SCREEN PREVIEW
    return (
      <div className="min-h-screen bg-black text-white p-8 overflow-auto">
        {currentSection.type === 'trustComparison' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-center mb-8">
              <EditableText
                value={currentSection.mainTitle}
                onChange={(val) => updateSection('mainTitle', val)}
                className="inline"
              />
              <br />
              <EditableText
                value={currentSection.mainTitleHighlight}
                onChange={(val) => updateSection('mainTitleHighlight', val)}
                className="text-yellow-400 inline"
              />
            </h1>
            
            <EditableText
              value={currentSection.subtitle}
              onChange={(val) => updateSection('subtitle', val)}
              className="text-xl md:text-2xl text-gray-400 text-center mb-12 max-w-4xl mx-auto block"
            />
            
            <div className="bg-yellow-400 text-black py-6 px-8 mx-auto max-w-4xl mb-16">
              <h2 className="text-3xl font-black text-center mb-2">
                <EditableText
                  value={currentSection.bannerTitle}
                  onChange={(val) => updateSection('bannerTitle', val)}
                  className="text-black"
                />
              </h2>
              <EditableText
                value={currentSection.bannerText}
                onChange={(val) => updateSection('bannerText', val)}
                className="text-lg text-center text-black block"
              />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 text-center mb-12">
              <EditableText
                value={currentSection.questionText}
                onChange={(val) => updateSection('questionText', val)}
              />
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-8">
                <div className="text-6xl text-center mb-6">
                  <EditableText
                    value={currentSection.leftCard.emoji}
                    onChange={(val) => updateSection('leftCard', {...currentSection.leftCard, emoji: val})}
                  />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  <EditableText
                    value={currentSection.leftCard.title}
                    onChange={(val) => updateSection('leftCard', {...currentSection.leftCard, title: val})}
                  />
                </h3>
                <div className="text-yellow-400 text-2xl text-center mb-6">
                  <EditableText
                    value={currentSection.leftCard.rating}
                    onChange={(val) => updateSection('leftCard', {...currentSection.leftCard, rating: val})}
                  />
                </div>
                <p className="text-gray-400 text-center mb-4">
                  <EditableText
                    value={currentSection.leftCard.description}
                    onChange={(val) => updateSection('leftCard', {...currentSection.leftCard, description: val})}
                  />
                </p>
                <p className="text-red-400 text-center font-bold">
                  <EditableText
                    value={currentSection.leftCard.warning}
                    onChange={(val) => updateSection('leftCard', {...currentSection.leftCard, warning: val})}
                  />
                </p>
              </div>
              
              <div className="bg-gray-900 border-2 border-green-500 rounded-2xl p-8">
                <div className="text-6xl text-center mb-6">
                  <EditableText
                    value={currentSection.rightCard.emoji}
                    onChange={(val) => updateSection('rightCard', {...currentSection.rightCard, emoji: val})}
                  />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  <EditableText
                    value={currentSection.rightCard.title}
                    onChange={(val) => updateSection('rightCard', {...currentSection.rightCard, title: val})}
                  />
                </h3>
                <div className="text-gray-500 text-xl text-center mb-6">
                  <EditableText
                    value={currentSection.rightCard.rating}
                    onChange={(val) => updateSection('rightCard', {...currentSection.rightCard, rating: val})}
                  />
                </div>
                <p className="text-gray-400 text-center mb-4">
                  <EditableText
                    value={currentSection.rightCard.description}
                    onChange={(val) => updateSection('rightCard', {...currentSection.rightCard, description: val})}
                  />
                </p>
                <p className="text-green-400 text-center font-bold">
                  <EditableText
                    value={currentSection.rightCard.highlight}
                    onChange={(val) => updateSection('rightCard', {...currentSection.rightCard, highlight: val})}
                  />
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Add other section types here */}
      </div>
    );
  };
  
  // Inline editable text component
  const EditableText = ({ value, onChange, className = '' }: { value: string; onChange: (val: string) => void; className?: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    
    if (isEditing) {
      return (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => {
            onChange(tempValue);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onChange(tempValue);
              setIsEditing(false);
            }
            if (e.key === 'Escape') {
              setTempValue(value);
              setIsEditing(false);
            }
          }}
          className={`bg-gray-800 px-2 py-1 rounded ${className}`}
          autoFocus
        />
      );
    }
    
    return (
      <span 
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer hover:bg-gray-800/50 px-1 rounded transition ${className}`}
      >
        {value}
      </span>
    );
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-gray-800 rounded">
            ←
          </Link>
          <input
            value={presentation.title}
            onChange={(e) => setPresentation({...presentation, title: e.target.value})}
            className="bg-transparent text-xl font-bold focus:outline-none focus:bg-gray-900 px-2 py-1 rounded"
          />
          <span className="text-sm text-gray-400">{presentation.sections.length} sections</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-2"
          >
            <Eye size={16} />
            Preview
          </button>
          <Link
            href="/presentation/preview"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-2"
          >
            <Play size={16} />
            Present
          </Link>
          <button className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 flex items-center gap-2">
            <Save size={16} />
            Save
          </button>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-73px)]">
        {/* Templates & Sections Sidebar */}
        <div className="w-80 border-r border-gray-800 bg-gray-950 overflow-y-auto">
          {/* Templates */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-gray-400 mb-4">ADD SECTION</h3>
            <div className="space-y-2">
              {Object.entries(sectionTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => addSection(key)}
                  className="w-full p-4 bg-gray-900 hover:bg-gray-800 rounded-lg text-left transition group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl mb-2">{template.preview}</div>
                      <div className="font-bold">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                    <Plus className="text-gray-600 group-hover:text-yellow-400" size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Current Sections */}
          <div className="p-4 border-t border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 mb-4">SECTIONS</h3>
            <div className="space-y-2">
              {presentation.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg flex items-center justify-between group ${
                    index === currentSectionIndex
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <button
                    onClick={() => setCurrentSectionIndex(index)}
                    className="flex-1 text-left"
                  >
                    <div className="font-bold">Section {index + 1}</div>
                    <div className="text-xs opacity-70">
                      {sectionTemplates[section.type as keyof typeof sectionTemplates]?.name || section.type}
                    </div>
                  </button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    {index > 0 && (
                      <button
                        onClick={() => moveSection(index, index - 1)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <ChevronUp size={14} />
                      </button>
                    )}
                    {index < presentation.sections.length - 1 && (
                      <button
                        onClick={() => moveSection(index, index + 1)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <ChevronDown size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteSection(index)}
                      className="p-1 hover:bg-red-600 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-950">
          {renderSectionPreview()}
        </div>
      </div>
    </div>
  );
}