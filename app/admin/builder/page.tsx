'use client';

import { useState, useEffect, Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { motion } from 'framer-motion';
import { Save, Play, Plus, Trash2, Eye, Edit3, ChevronUp, ChevronDown, Settings, Smartphone, Network, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import PolishedPhoneMockup from '@/components/interactive/PolishedPhoneMockup';
import NetworkVisualization from '@/components/interactive/NetworkVisualization';
import ScreenshotUploader from '@/components/ScreenshotUploader';
import type { Presentation as StrapiPresentation } from '@/lib/strapi-types';

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
  phoneMockup: {
    name: 'Phone Demo',
    description: 'Interactive phone mockup',
    preview: '📱',
    defaultContent: {
      title: 'SEE IT IN',
      titleHighlight: 'ACTION',
      subtitle: 'Experience the Vexl app interface',
      phoneTitle: 'Real P2P Trading',
      phoneDescription: 'No middleman. No surveillance. Just Bitcoin.',
      showNotification: true,
      notificationText: 'New offer from your network',
      screenshots: []
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

function PresentationBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');
  const forked = searchParams.get('forked') === 'true';
  
  const [presentation, setPresentation] = useState<Presentation>({
    title: 'New Presentation',
    sections: []
  });
  const [strapiPresentation, setStrapiPresentation] = useState<StrapiPresentation | null>(null);
  const [isFork, setIsFork] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  
  // Load presentation if slug is provided
  useEffect(() => {
    if (slug) {
      loadPresentation(slug);
    }
  }, [slug]);
  
  async function loadPresentation(presentationSlug: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/strapi-proxy/presentations?filters[slug][$eq]=${presentationSlug}&populate=*`);
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const pres = data.data[0];
        setStrapiPresentation(pres);
        setIsFork(!!pres.attributes.forkOf?.data);
        
        // Convert Strapi data to builder format
        setPresentation({
          title: pres.attributes.title || 'Untitled',
          sections: pres.attributes.sections?.data?.map((section: any) => ({
            id: section.id.toString(),
            type: section.attributes.type || 'trustComparison',
            ...section.attributes
          })) || []
        });
        
        // Show success message if just forked
        if (forked) {
          alert('Presentation forked successfully! You can now edit your copy.');
        }
      }
    } catch (error) {
      console.error('Failed to load presentation:', error);
    } finally {
      setLoading(false);
    }
  }
  
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
        
        {currentSection.type === 'networkVisualization' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-center mb-8">
              <EditableText
                value={currentSection.title}
                onChange={(val) => updateSection('title', val)}
                className="inline"
              />
              <br />
              <EditableText
                value={currentSection.titleHighlight}
                onChange={(val) => updateSection('titleHighlight', val)}
                className="inline"
                style={{ color: vexlBrand.colors.primary.yellow }}
              />
            </h1>
            
            <EditableText
              value={currentSection.subtitle}
              onChange={(val) => updateSection('subtitle', val)}
              className="text-xl md:text-2xl text-gray-400 text-center mb-12 max-w-4xl mx-auto block"
            />
            
            <div className="h-[500px] relative">
              <NetworkVisualization interactive={true} showLabels={true} />
            </div>
          </div>
        )}
        
        {currentSection.type === 'phoneMockup' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-center mb-8">
              <EditableText
                value={currentSection.title}
                onChange={(val) => updateSection('title', val)}
                className="inline"
              />
              {' '}
              <EditableText
                value={currentSection.titleHighlight}
                onChange={(val) => updateSection('titleHighlight', val)}
                className="inline"
                style={{ color: vexlBrand.colors.primary.yellow }}
              />
            </h1>
            
            <EditableText
              value={currentSection.subtitle}
              onChange={(val) => updateSection('subtitle', val)}
              className="text-xl md:text-2xl text-gray-400 text-center mb-12 max-w-4xl mx-auto block"
            />
            
            <div className="flex justify-center mb-12">
              <PolishedPhoneMockup
                screenshots={currentSection.screenshots || []}
                title={currentSection.phoneTitle}
                description={currentSection.phoneDescription}
                showNotification={currentSection.showNotification}
                notificationText={currentSection.notificationText}
              />
            </div>
            
            {/* Screenshot Uploader */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-bold mb-4">Phone Screenshots</h3>
              <ScreenshotUploader
                screenshots={currentSection.screenshots || []}
                onScreenshotsChange={(screenshots) => updateSection('screenshots', screenshots)}
                maxScreenshots={5}
              />
            </div>
          </div>
        )}
        
        {currentSection.type === 'howItWorks' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-center mb-16">
              <EditableText
                value={currentSection.title}
                onChange={(val) => updateSection('title', val)}
                className="inline"
              />
              {' '}
              <EditableText
                value={currentSection.titleHighlight}
                onChange={(val) => updateSection('titleHighlight', val)}
                className="inline"
                style={{ color: vexlBrand.colors.primary.yellow }}
              />
            </h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentSection.steps?.map((step: any, i: number) => (
                <div
                  key={i}
                  className="bg-gray-900 rounded-2xl p-8 text-center"
                >
                  <div className="text-6xl mb-4">{step.emoji}</div>
                  <div className="text-4xl font-black mb-4" style={{ color: vexlBrand.colors.primary.yellow }}>
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {currentSection.type === 'privacySection' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-center mb-8">
              <EditableText
                value={currentSection.title}
                onChange={(val) => updateSection('title', val)}
                className="inline"
              />
              {' '}
              <EditableText
                value={currentSection.titleHighlight}
                onChange={(val) => updateSection('titleHighlight', val)}
                className="inline"
                style={{ color: vexlBrand.colors.primary.yellow }}
              />
            </h1>
            
            <EditableText
              value={currentSection.subtitle}
              onChange={(val) => updateSection('subtitle', val)}
              className="text-xl md:text-2xl text-gray-400 text-center mb-6 max-w-4xl mx-auto block"
            />
            
            <EditableText
              value={currentSection.mainText}
              onChange={(val) => updateSection('mainText', val)}
              className="text-2xl md:text-3xl text-center mb-12 max-w-4xl mx-auto block"
            />
            
            <div className="py-6 px-8 mb-12" style={{ backgroundColor: vexlBrand.colors.primary.yellow }}>
              <h2 className="text-2xl md:text-3xl font-black text-center text-black">
                <EditableText
                  value={currentSection.bannerText}
                  onChange={(val) => updateSection('bannerText', val)}
                  className="text-black"
                />
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              <div className="bg-gray-900 rounded-2xl p-8">
                <h3 className="text-xl text-gray-400 mb-6">{currentSection.phoneTitle}</h3>
                <div className="space-y-3">
                  {currentSection.contacts?.map((contact: any, i: number) => (
                    <div 
                      key={i}
                      className={`p-4 rounded-lg ${
                        contact.highlight 
                          ? 'bg-yellow-400 text-black' 
                          : 'bg-gray-800'
                      }`}
                    >
                      <div className="font-bold">{contact.name}</div>
                      <div className={contact.highlight ? 'opacity-75' : 'text-gray-400'}>
                        {contact.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-2xl p-8 text-center">
                <h3 className="text-xl text-gray-400 mb-6">{currentSection.serverTitle}</h3>
                <div className="bg-black p-6 rounded-lg mb-6">
                  <div className="font-mono text-xl md:text-2xl mb-4" style={{ color: vexlBrand.colors.primary.yellow }}>
                    {currentSection.hash}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {currentSection.hashDescription}
                  </div>
                </div>
                <div className="text-8xl mb-4">🔒</div>
                <p className="text-lg text-gray-300">
                  {currentSection.serverMessage}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {currentSection.type === 'statsSection' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-center mb-16">
              <EditableText
                value={currentSection.title}
                onChange={(val) => updateSection('title', val)}
                className="inline"
              />
              {' '}
              <EditableText
                value={currentSection.titleHighlight}
                onChange={(val) => updateSection('titleHighlight', val)}
                className="inline"
                style={{ color: vexlBrand.colors.primary.yellow }}
              />
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {currentSection.stats?.map((stat: any, i: number) => (
                <div
                  key={i}
                  className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-6 text-center"
                >
                  <div className="text-4xl mb-3">{stat.emoji}</div>
                  <div className="text-3xl font-bold mb-1" style={{ color: vexlBrand.colors.primary.yellow }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Inline editable text component
  const EditableText = ({ value, onChange, className = '', style }: { value: string; onChange: (val: string) => void; className?: string; style?: React.CSSProperties }) => {
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
        style={style}
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
          {isFork && strapiPresentation && (
            <Link
              href={`/admin/diff/${strapiPresentation.attributes.slug}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2"
            >
              <GitBranch size={16} />
              View Diff
            </Link>
          )}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-2"
          >
            <Eye size={16} />
            Preview
          </button>
          <Link
            href={slug ? `/workshop/${slug}` : "/presentation/preview"}
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
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading presentation...</p>
              </div>
            </div>
          ) : (
            renderSectionPreview()
          )}
        </div>
      </div>
    </div>
  );
}

export default function PresentationBuilder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading builder...</p>
        </div>
      </div>
    }>
      <PresentationBuilderContent />
    </Suspense>
  );
}