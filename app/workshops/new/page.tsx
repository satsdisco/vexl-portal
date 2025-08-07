'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi';
import { SlideBuilder } from '@/components/SlideBuilder';
import { InteractiveSlideRenderer } from '@/components/InteractiveSlideRenderer';
import { slideTemplates } from '@/lib/vexl-brand';
import { WorkshopTemplateLoader } from '@/components/WorkshopTemplateLoader';
import { vexlWorkshopTemplate } from '@/lib/vexl-workshop-template';

interface Slide {
  id: string;
  type: string;
  template?: string;
  title: string;
  content?: string;
  [key: string]: unknown;
}

export default function NewWorkshopPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [showTemplateLoader, setShowTemplateLoader] = useState(true);
  
  const [workshop, setWorkshop] = useState({
    title: vexlWorkshopTemplate.title,
    description: vexlWorkshopTemplate.description,
    duration: vexlWorkshopTemplate.duration,
    difficulty: vexlWorkshopTemplate.difficulty,
    tags: vexlWorkshopTemplate.tags,
  });

  // Initialize with empty slides - will be loaded from template
  const [slides, setSlides] = useState<Slide[]>([]);
  
  // Load default template on mount
  useEffect(() => {
    if (slides.length === 0) {
      loadDefaultTemplate();
    }
  }, []);
  
  const loadDefaultTemplate = () => {
    const defaultSlides = vexlWorkshopTemplate.sections.map((section, index) => ({
      id: `slide-${index + 1}`,
      type: section.type,
      template: section.template,
      title: section.title,
      subtitle: section.subtitle || '',
      duration: section.duration,
      notes: section.notes,
      component: section.content?.component,
      nodes: section.content?.nodes,
      connections: section.content?.connections,
      steps: section.content?.steps,
      interactive: section.content?.interactive,
      expandable: section.content?.expandable,
      showCalculation: section.content?.showCalculation,
      autoPlay: section.content?.autoPlay,
      contacts: section.content?.contacts,
      offers: section.content?.offers,
      features: section.content?.features,
      bullets: section.content?.bullets,
      items: section.content?.items,
      showLogo: section.content?.showLogo,
      background: section.content?.background,
      stats: section.content?.stats,
      showAirDrop: section.content?.showAirDrop,
      comparison: section.content?.comparison,
      quote: section.content?.quote,
      author: section.content?.author,
      statistic: section.content?.statistic,
      content: section.content?.content,
      backgroundColor: section.content?.backgroundColor,
      ...section.content
    }));
    setSlides(defaultSlides);
    setShowTemplateLoader(false);
  };

  const currentSlide = slides[currentSlideIndex];

  const addSlideFromTemplate = (templateKey: string) => {
    const template = slideTemplates[templateKey as keyof typeof slideTemplates];
    if (template) {
      const newSlide: Slide = {
        id: Date.now().toString(),
        type: templateKey,
        template: templateKey,
        ...template.defaultContent
      };
      
      const newSlides = [...slides];
      newSlides.splice(currentSlideIndex + 1, 0, newSlide);
      setSlides(newSlides);
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const updateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, ...updates };
    setSlides(newSlides);
  };

  const deleteSlide = () => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== currentSlideIndex);
      setSlides(newSlides);
      if (currentSlideIndex >= newSlides.length) {
        setCurrentSlideIndex(newSlides.length - 1);
      }
    }
  };

  const duplicateSlide = () => {
    const newSlide = { ...currentSlide, id: Date.now().toString() };
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };

  const saveWorkshop = async () => {
    setLoading(true);
    try {
      const { data } = await strapiClient.post('/workshops', {
        data: {
          title: workshop.title,
          description: workshop.description,
          duration: workshop.duration,
          difficulty: workshop.difficulty,
          tags: workshop.tags,
          slides: slides,
          status: 'draft'
        }
      });
      router.push(`/workshops/${data.data.documentId}/edit`);
    } catch (error) {
      console.error('Failed to save workshop:', error);
      alert('Failed to save workshop');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-20">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/workshops" className="p-2 hover:bg-gray-900 rounded">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <input
                  type="text"
                  value={workshop.title}
                  onChange={(e) => setWorkshop({...workshop, title: e.target.value})}
                  className="bg-transparent text-xl font-bold focus:outline-none"
                  placeholder="Workshop Title"
                />
                <div className="text-xs text-gray-400">
                  {slides.length} slides • {workshop.duration} min
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTemplateLoader(true)}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded"
              >
                <Sparkles size={16} />
                <span>Templates</span>
              </button>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-2 rounded ${previewMode ? 'bg-yellow-400 text-black' : 'bg-gray-800'}`}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Save workshop first to present');
                }}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded"
              >
                <Play size={16} />
                <span>Present</span>
              </Link>
              <button
                onClick={saveWorkshop}
                disabled={loading}
                className="flex items-center space-x-1 px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar - Slide List */}
        <div className="w-72 border-r border-gray-800 bg-gray-950 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400">SLIDES</h3>
              <button
                onClick={duplicateSlide}
                className="text-xs text-yellow-400 hover:underline"
              >
                Duplicate
              </button>
            </div>
            
            {/* Slide Thumbnails */}
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
                    index === currentSlideIndex
                      ? 'ring-2 ring-yellow-400'
                      : 'hover:ring-1 hover:ring-gray-600'
                  }`}
                >
                  <div className="aspect-video bg-gray-900 p-3">
                    <div className="text-xs font-bold text-yellow-400 mb-1">
                      Slide {index + 1}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {slide.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {slide.template || slide.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Slide Templates */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-gray-400 mb-3">ADD NEW SLIDE</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(slideTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => addSlideFromTemplate(key)}
                    className="p-3 bg-gray-900 hover:bg-gray-800 rounded text-center transition"
                  >
                    <div className="text-xl mb-1">{template.icon}</div>
                    <div className="text-xs">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Slide Preview/Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-8">
              <div className="h-full max-w-6xl mx-auto">
                <div className="bg-gray-900 rounded-lg aspect-video overflow-hidden">
                  {currentSlide && <InteractiveSlideRenderer slide={currentSlide} isPresenting={previewMode} />}
                </div>
                
                {/* Speaker Notes */}
                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-400 mb-2">
                    SPEAKER NOTES
                  </label>
                  <textarea
                    value={(currentSlide.notes as string) || ''}
                    onChange={(e) => updateSlide({ notes: e.target.value })}
                    className="w-full bg-gray-900 rounded p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    placeholder="Add notes for this slide (only visible to presenter)"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <button
                  onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                  disabled={currentSlideIndex === 0}
                  className="p-2 hover:bg-gray-900 rounded disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                  <button
                    onClick={deleteSlide}
                    disabled={slides.length === 1}
                    className="p-2 hover:bg-red-900 rounded text-red-400 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <button
                  onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="p-2 hover:bg-gray-900 rounded disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Slide Editor */}
          {!previewMode && (
            <div className="w-96 border-l border-gray-800 bg-gray-950">
              <SlideBuilder 
                slide={currentSlide} 
                onUpdate={updateSlide}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Template Loader Modal */}
      {showTemplateLoader && (
        <WorkshopTemplateLoader
          onLoadTemplate={(templateSlides) => {
            setSlides(templateSlides);
            setShowTemplateLoader(false);
          }}
          onCancel={() => setShowTemplateLoader(false)}
        />
      )}
    </div>
  );
}