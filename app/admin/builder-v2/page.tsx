'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Save, Eye, EyeOff, Plus, GitBranch, GitPullRequest, ChevronLeft,
  ChevronRight, Settings, Layout, Type, Quote, Smartphone, Target,
  Columns, Copy, Trash2, GripVertical, Check, X, Edit2
} from 'lucide-react';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import RichTextEditor from './components/RichTextEditor';
import SortableSection from './components/SortableSection';
import SortableBlock from './components/SortableBlock';
import LivePreview from './components/LivePreview';
import BlockEditor from './components/BlockEditor';
import type { Presentation } from '@/lib/strapi-types';

interface Section {
  id: string;
  title?: string;
  subtitle?: string;
  order: number;
  backgroundColor: string;
  transition: string;
  content: Block[];
}

interface Block {
  id: string;
  type: 'rich-text' | 'quote' | 'device-mockup' | 'call-to-action' | 'comparison';
  data: any;
}

const blockIcons = {
  'rich-text': Type,
  'quote': Quote,
  'device-mockup': Smartphone,
  'call-to-action': Target,
  'comparison': Columns,
};

const blockTemplates = {
  'rich-text': {
    name: 'Text Content',
    data: {
      content: 'Enter your text here...',
      alignment: 'left',
      fontSize: 'medium',
    },
  },
  'quote': {
    name: 'Quote',
    data: {
      text: 'Enter quote text...',
      author: 'Author Name',
      role: 'Title/Role',
      style: 'default',
    },
  },
  'device-mockup': {
    name: 'Device Mockup',
    data: {
      device: 'iphone14pro',
      title: 'App Demo',
      caption: 'See it in action',
      screenshots: [],
      orientation: 'portrait',
    },
  },
  'call-to-action': {
    name: 'Call to Action',
    data: {
      headline: 'Take Action',
      subtext: 'Join the movement',
      buttonText: 'Get Started',
      buttonUrl: 'https://vexl.it',
      style: 'primary',
      alignment: 'center',
    },
  },
  'comparison': {
    name: 'Comparison',
    data: {
      title: 'Compare Options',
      leftColumn: {
        title: 'Option A',
        emoji: '🅰️',
        features: ['Feature 1', 'Feature 2'],
        highlight: false,
      },
      rightColumn: {
        title: 'Option B',
        emoji: '🅱️',
        features: ['Feature 1', 'Feature 2'],
        highlight: true,
        highlightColor: 'yellow',
      },
      showDivider: true,
    },
  },
};

function BuilderV2Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');
  
  const [presentation, setPresentation] = useState<{
    id?: string;
    title: string;
    description?: string;
    isFork?: boolean;
    forkOf?: string;
    sections: Section[];
  }>({
    title: 'New Presentation',
    sections: [],
  });
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const currentSection = presentation.sections[currentSectionIndex];
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Load presentation if slug provided
  useEffect(() => {
    if (slug) {
      loadPresentation(slug);
    }
  }, [slug]);
  
  async function loadPresentation(presentationSlug: string) {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/strapi-proxy/presentations?filters[slug][$eq]=${presentationSlug}&populate=deep`
      );
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const pres = data.data[0];
        
        // Convert Strapi format to builder format
        const sections = pres.attributes.sections?.data?.map((section: any, index: number) => ({
          id: section.id.toString(),
          title: section.attributes.title,
          subtitle: section.attributes.subtitle,
          order: section.attributes.order || index,
          backgroundColor: section.attributes.backgroundColor || 'black',
          transition: section.attributes.transition || 'fade',
          content: convertStrapiBlocksToBuilder(section.attributes.content),
        })) || [];
        
        setPresentation({
          id: pres.id.toString(),
          title: pres.attributes.title,
          description: pres.attributes.description,
          isFork: !!pres.attributes.forkOf?.data,
          forkOf: pres.attributes.forkOf?.data?.id,
          sections,
        });
      }
    } catch (error) {
      console.error('Failed to load presentation:', error);
    } finally {
      setLoading(false);
    }
  }
  
  function convertStrapiBlocksToBuilder(strapiContent: any): Block[] {
    if (!strapiContent || !Array.isArray(strapiContent)) return [];
    
    return strapiContent.map((block: any, index: number) => ({
      id: `block-${Date.now()}-${index}`,
      type: block.__component?.replace('blocks.', '').replace('-', '_') || 'rich-text',
      data: { ...block },
    }));
  }
  
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = presentation.sections.findIndex(s => s.id === active.id);
      const newIndex = presentation.sections.findIndex(s => s.id === over?.id);
      
      const newSections = arrayMove(presentation.sections, oldIndex, newIndex);
      // Update order values
      newSections.forEach((section, index) => {
        section.order = index;
      });
      
      setPresentation({ ...presentation, sections: newSections });
      
      // Update current section index if needed
      if (currentSectionIndex === oldIndex) {
        setCurrentSectionIndex(newIndex);
      }
    }
  };
  
  const handleBlockDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && currentSection) {
      const oldIndex = currentSection.content.findIndex(b => b.id === active.id);
      const newIndex = currentSection.content.findIndex(b => b.id === over?.id);
      
      const newContent = arrayMove(currentSection.content, oldIndex, newIndex);
      updateCurrentSection({ content: newContent });
    }
  };
  
  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      subtitle: '',
      order: presentation.sections.length,
      backgroundColor: 'black',
      transition: 'fade',
      content: [],
    };
    
    setPresentation({
      ...presentation,
      sections: [...presentation.sections, newSection],
    });
    
    setCurrentSectionIndex(presentation.sections.length);
  };
  
  const duplicateSection = (index: number) => {
    const sectionToDuplicate = presentation.sections[index];
    const newSection: Section = {
      ...sectionToDuplicate,
      id: `section-${Date.now()}`,
      title: `${sectionToDuplicate.title} (Copy)`,
      order: presentation.sections.length,
      content: sectionToDuplicate.content.map(block => ({
        ...block,
        id: `block-${Date.now()}-${Math.random()}`,
      })),
    };
    
    const newSections = [...presentation.sections];
    newSections.splice(index + 1, 0, newSection);
    // Update order values
    newSections.forEach((section, i) => {
      section.order = i;
    });
    
    setPresentation({ ...presentation, sections: newSections });
  };
  
  const deleteSection = (index: number) => {
    const newSections = presentation.sections.filter((_, i) => i !== index);
    setPresentation({ ...presentation, sections: newSections });
    
    if (currentSectionIndex >= newSections.length) {
      setCurrentSectionIndex(Math.max(0, newSections.length - 1));
    }
  };
  
  const updateCurrentSection = (updates: Partial<Section>) => {
    const newSections = [...presentation.sections];
    newSections[currentSectionIndex] = {
      ...currentSection,
      ...updates,
    };
    setPresentation({ ...presentation, sections: newSections });
  };
  
  const addBlock = (type: keyof typeof blockTemplates) => {
    if (!currentSection) return;
    
    const template = blockTemplates[type];
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      data: { ...template.data },
    };
    
    updateCurrentSection({
      content: [...currentSection.content, newBlock],
    });
  };
  
  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    if (!currentSection) return;
    
    const newContent = currentSection.content.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    
    updateCurrentSection({ content: newContent });
  };
  
  const duplicateBlock = (blockId: string) => {
    if (!currentSection) return;
    
    const blockIndex = currentSection.content.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;
    
    const blockToDuplicate = currentSection.content[blockIndex];
    const newBlock: Block = {
      ...blockToDuplicate,
      id: `block-${Date.now()}`,
      data: { ...blockToDuplicate.data },
    };
    
    const newContent = [...currentSection.content];
    newContent.splice(blockIndex + 1, 0, newBlock);
    
    updateCurrentSection({ content: newContent });
  };
  
  const deleteBlock = (blockId: string) => {
    if (!currentSection) return;
    
    const newContent = currentSection.content.filter(b => b.id !== blockId);
    updateCurrentSection({ content: newContent });
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };
  
  const savePresentation = async () => {
    setSaving(true);
    try {
      // Convert builder format to Strapi format
      const strapiData = {
        title: presentation.title,
        description: presentation.description,
        sections: presentation.sections.map(section => ({
          title: section.title,
          subtitle: section.subtitle,
          order: section.order,
          backgroundColor: section.backgroundColor,
          transition: section.transition,
          content: section.content.map(block => ({
            __component: `blocks.${block.type.replace('_', '-')}`,
            ...block.data,
          })),
        })),
      };
      
      const method = presentation.id ? 'PUT' : 'POST';
      const url = presentation.id
        ? `/api/strapi-proxy/presentations/${presentation.id}`
        : '/api/strapi-proxy/presentations';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: strapiData }),
      });
      
      if (!response.ok) throw new Error('Save failed');
      
      const result = await response.json();
      
      // Update presentation ID if this was a create
      if (!presentation.id && result.data?.id) {
        setPresentation({ ...presentation, id: result.data.id.toString() });
      }
      
      // Show success feedback
      alert('Presentation saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save presentation');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading presentation...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header 
        className="h-16 border-b flex items-center justify-between px-6"
        style={{ borderColor: vexlBrand.colors.gray[800] }}
      >
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/dashboard"
            className="p-2 hover:bg-gray-800 rounded transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-3">
            <input
              value={presentation.title}
              onChange={(e) => setPresentation({ ...presentation, title: e.target.value })}
              className="bg-transparent text-xl font-bold focus:outline-none focus:bg-gray-900 px-2 py-1 rounded"
              style={{ color: vexlBrand.colors.primary.white }}
            />
            
            {presentation.isFork && (
              <div 
                className="px-2 py-1 rounded text-xs flex items-center gap-1"
                style={{ 
                  backgroundColor: vexlBrand.colors.gray[800],
                  color: vexlBrand.colors.primary.yellow 
                }}
              >
                <GitBranch className="w-3 h-3" />
                Fork
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {presentation.isFork && (
            <>
              <Link
                href={`/admin/diff/${slug}`}
                className="px-3 py-1.5 rounded flex items-center gap-2 text-sm transition"
                style={{
                  backgroundColor: vexlBrand.colors.gray[800],
                  color: vexlBrand.colors.primary.white,
                }}
              >
                <GitBranch className="w-4 h-4" />
                View Diff
              </Link>
              
              <Link
                href={`/admin/merge/${slug}`}
                className="px-3 py-1.5 rounded flex items-center gap-2 text-sm transition"
                style={{
                  backgroundColor: vexlBrand.colors.gray[800],
                  color: vexlBrand.colors.primary.white,
                }}
              >
                <GitPullRequest className="w-4 h-4" />
                Pull Updates
              </Link>
            </>
          )}
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 rounded transition"
            style={{
              backgroundColor: showPreview ? vexlBrand.colors.primary.yellow : vexlBrand.colors.gray[800],
              color: showPreview ? vexlBrand.colors.primary.black : vexlBrand.colors.primary.white,
            }}
          >
            {showPreview ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={savePresentation}
            disabled={saving}
            className="px-4 py-2 rounded font-bold transition disabled:opacity-50"
            style={{
              backgroundColor: vexlBrand.colors.primary.yellow,
              color: vexlBrand.colors.primary.black,
            }}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </span>
            )}
          </button>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sections Sidebar */}
        <div 
          className="w-64 border-r overflow-y-auto"
          style={{ 
            backgroundColor: vexlBrand.colors.gray[900],
            borderColor: vexlBrand.colors.gray[800] 
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-400">SECTIONS</h3>
              <button
                onClick={addSection}
                className="p-1 rounded transition hover:bg-gray-800"
                style={{ color: vexlBrand.colors.primary.yellow }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSectionDragEnd}
            >
              <SortableContext
                items={presentation.sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {presentation.sections.map((section, index) => (
                    <SortableSection
                      key={section.id}
                      id={section.id}
                      section={section}
                      index={index}
                      isActive={index === currentSectionIndex}
                      onSelect={() => setCurrentSectionIndex(index)}
                      onDuplicate={() => duplicateSection(index)}
                      onDelete={() => deleteSection(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
        
        {/* Main Editor Area */}
        <div className="flex-1 flex">
          {/* Block Editor */}
          <div 
            className={`${showPreview ? 'w-1/2' : 'flex-1'} border-r overflow-y-auto`}
            style={{ 
              backgroundColor: vexlBrand.colors.gray[950],
              borderColor: vexlBrand.colors.gray[800] 
            }}
          >
            {currentSection ? (
              <div className="p-6">
                {/* Section Settings */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-4">Section Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Title</label>
                      <input
                        value={currentSection.title || ''}
                        onChange={(e) => updateCurrentSection({ title: e.target.value })}
                        placeholder="Section title"
                        className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                      <input
                        value={currentSection.subtitle || ''}
                        onChange={(e) => updateCurrentSection({ subtitle: e.target.value })}
                        placeholder="Section subtitle"
                        className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Background</label>
                        <select
                          value={currentSection.backgroundColor}
                          onChange={(e) => updateCurrentSection({ backgroundColor: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="black">Black</option>
                          <option value="dark">Dark Gray</option>
                          <option value="light">Light</option>
                          <option value="yellow">Yellow</option>
                          <option value="gradient">Gradient</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Transition</label>
                        <select
                          value={currentSection.transition}
                          onChange={(e) => updateCurrentSection({ transition: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="fade">Fade</option>
                          <option value="slide">Slide</option>
                          <option value="zoom">Zoom</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content Blocks */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-gray-400">CONTENT BLOCKS</h3>
                  </div>
                  
                  {/* Add Block Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {Object.entries(blockTemplates).map(([type, template]) => {
                      const Icon = blockIcons[type as keyof typeof blockIcons];
                      return (
                        <button
                          key={type}
                          onClick={() => addBlock(type as keyof typeof blockTemplates)}
                          className="p-3 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-2 transition"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{template.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Blocks List */}
                  {currentSection.content.length > 0 ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleBlockDragEnd}
                    >
                      <SortableContext
                        items={currentSection.content.map(b => b.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {currentSection.content.map((block) => (
                            <SortableBlock
                              key={block.id}
                              id={block.id}
                              block={block}
                              isSelected={selectedBlockId === block.id}
                              onSelect={() => setSelectedBlockId(block.id)}
                              onUpdate={(updates) => updateBlock(block.id, updates)}
                              onDuplicate={() => duplicateBlock(block.id)}
                              onDelete={() => deleteBlock(block.id)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No content blocks yet</p>
                      <p className="text-sm mt-1">Add blocks using the buttons above</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Plus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No sections yet</p>
                  <button
                    onClick={addSection}
                    className="mt-3 px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition"
                  >
                    Add First Section
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Live Preview */}
          {showPreview && (
            <div className="w-1/2 overflow-hidden bg-black">
              <LivePreview section={currentSection} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BuilderV2() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading builder...</p>
        </div>
      </div>
    }>
      <BuilderV2Content />
    </Suspense>
  );
}