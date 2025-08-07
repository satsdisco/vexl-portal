'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Image, Type, Code, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi';

interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'code' | 'quiz';
  title: string;
  content?: string;
  imageUrl?: string;
  code?: string;
  language?: string;
  notes?: string;
}

export default function EditWorkshopPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const [workshop, setWorkshop] = useState({
    title: '',
    description: '',
    duration: 30,
    difficulty: 'beginner',
    status: 'draft',
    tags: [] as string[],
  });

  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    fetchWorkshop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWorkshop = async () => {
    try {
      const { data } = await strapiClient.get(`/workshops/${params.id}?populate=*`);
      const workshopData = data.data;
      setWorkshop({
        title: workshopData.title || '',
        description: workshopData.description || '',
        duration: workshopData.duration || 30,
        difficulty: workshopData.difficulty || 'beginner',
        status: workshopData.status || 'draft',
        tags: workshopData.tags || [],
      });
      setSlides(workshopData.slides || [{
        id: '1',
        type: 'title',
        title: 'Workshop Title',
        content: 'Add your workshop description here'
      }]);
    } catch (error) {
      console.error('Failed to fetch workshop:', error);
      router.push('/workshops');
    }
  };

  const currentSlide = slides[currentSlideIndex];

  const addSlide = (type: Slide['type']) => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type,
      title: type === 'title' ? 'New Title Slide' : 'Slide Title',
      content: type === 'content' ? 'Add your content here' : undefined,
      code: type === 'code' ? '// Add your code here' : undefined,
      language: type === 'code' ? 'javascript' : undefined,
    };
    
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
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

  const saveWorkshop = async () => {
    setLoading(true);
    try {
      await strapiClient.put(`/workshops/${params.id}`, {
        data: {
          title: workshop.title,
          description: workshop.description,
          duration: workshop.duration,
          difficulty: workshop.difficulty,
          tags: workshop.tags,
          slides: slides,
          status: workshop.status
        }
      });
      alert('Workshop saved successfully!');
    } catch (error) {
      console.error('Failed to save workshop:', error);
      alert('Failed to save workshop');
    }
    setLoading(false);
  };

  if (!currentSlide) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/workshops" className="p-2 hover:bg-gray-900 rounded">
                <ArrowLeft size={20} />
              </Link>
              <input
                type="text"
                value={workshop.title}
                onChange={(e) => setWorkshop({...workshop, title: e.target.value})}
                placeholder="Workshop Title"
                className="bg-transparent text-xl font-bold focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/workshops/${params.id}/present`}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition"
              >
                <Play size={18} />
                <span>Present</span>
              </Link>
              <button
                onClick={saveWorkshop}
                disabled={loading || !workshop.title}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition disabled:opacity-50"
              >
                <Save size={18} />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Sidebar - Slide List */}
        <div className="w-64 border-r border-gray-800 bg-gray-950 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-bold text-gray-400 mb-3">SLIDES</h3>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                onClick={() => setCurrentSlideIndex(index)}
                className={`p-3 mb-2 rounded cursor-pointer transition ${
                  index === currentSlideIndex
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                <div className="text-xs opacity-75">Slide {index + 1}</div>
                <div className="font-medium truncate">{slide.title}</div>
                <div className="text-xs mt-1 opacity-75">{slide.type}</div>
              </div>
            ))}
            
            {/* Add Slide Buttons */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => addSlide('content')}
                className="w-full p-2 bg-gray-900 hover:bg-gray-800 rounded text-sm flex items-center justify-center space-x-2"
              >
                <Type size={16} />
                <span>Add Content</span>
              </button>
              <button
                onClick={() => addSlide('code')}
                className="w-full p-2 bg-gray-900 hover:bg-gray-800 rounded text-sm flex items-center justify-center space-x-2"
              >
                <Code size={16} />
                <span>Add Code</span>
              </button>
              <button
                onClick={() => addSlide('image')}
                className="w-full p-2 bg-gray-900 hover:bg-gray-800 rounded text-sm flex items-center justify-center space-x-2"
              >
                <Image size={16} />
                <span>Add Image</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Slide Preview */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center p-12">
                {currentSlide.type === 'title' && (
                  <div className="text-center">
                    <input
                      type="text"
                      value={currentSlide.title}
                      onChange={(e) => updateSlide({ title: e.target.value })}
                      className="bg-transparent text-5xl font-bold text-yellow-400 text-center w-full focus:outline-none mb-4"
                      placeholder="Title"
                    />
                    <textarea
                      value={currentSlide.content || ''}
                      onChange={(e) => updateSlide({ content: e.target.value })}
                      className="bg-transparent text-xl text-gray-300 text-center w-full focus:outline-none resize-none"
                      placeholder="Subtitle or description"
                      rows={2}
                    />
                  </div>
                )}

                {currentSlide.type === 'content' && (
                  <div className="w-full">
                    <input
                      type="text"
                      value={currentSlide.title}
                      onChange={(e) => updateSlide({ title: e.target.value })}
                      className="bg-transparent text-3xl font-bold text-yellow-400 w-full focus:outline-none mb-6"
                      placeholder="Slide Title"
                    />
                    <textarea
                      value={currentSlide.content || ''}
                      onChange={(e) => updateSlide({ content: e.target.value })}
                      className="bg-transparent text-lg text-gray-300 w-full focus:outline-none resize-none"
                      placeholder="Add your content here. You can use markdown for formatting."
                      rows={8}
                    />
                  </div>
                )}

                {currentSlide.type === 'code' && (
                  <div className="w-full">
                    <input
                      type="text"
                      value={currentSlide.title}
                      onChange={(e) => updateSlide({ title: e.target.value })}
                      className="bg-transparent text-2xl font-bold text-yellow-400 w-full focus:outline-none mb-4"
                      placeholder="Code Example Title"
                    />
                    <div className="bg-black rounded-lg p-4">
                      <select
                        value={currentSlide.language || 'javascript'}
                        onChange={(e) => updateSlide({ language: e.target.value })}
                        className="bg-gray-800 text-sm px-2 py-1 rounded mb-2"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="solidity">Solidity</option>
                        <option value="rust">Rust</option>
                      </select>
                      <textarea
                        value={currentSlide.code || ''}
                        onChange={(e) => updateSlide({ code: e.target.value })}
                        className="bg-transparent text-sm font-mono text-green-400 w-full focus:outline-none resize-none"
                        placeholder="// Add your code here"
                        rows={10}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                )}

                {currentSlide.type === 'image' && (
                  <div className="w-full text-center">
                    <input
                      type="text"
                      value={currentSlide.title}
                      onChange={(e) => updateSlide({ title: e.target.value })}
                      className="bg-transparent text-2xl font-bold text-yellow-400 w-full text-center focus:outline-none mb-4"
                      placeholder="Image Title"
                    />
                    <div className="bg-gray-800 rounded-lg p-8">
                      <input
                        type="text"
                        value={currentSlide.imageUrl || ''}
                        onChange={(e) => updateSlide({ imageUrl: e.target.value })}
                        className="bg-gray-900 text-sm px-3 py-2 rounded w-full"
                        placeholder="Enter image URL or upload"
                      />
                      {currentSlide.imageUrl && (
                        <img 
                          src={currentSlide.imageUrl} 
                          alt={currentSlide.title}
                          className="mt-4 rounded max-h-96 mx-auto"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Speaker Notes */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-400 mb-2">SPEAKER NOTES</h3>
                <textarea
                  value={currentSlide.notes || ''}
                  onChange={(e) => updateSlide({ notes: e.target.value })}
                  className="w-full bg-gray-900 rounded p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  placeholder="Add notes for this slide (only visible to presenter)"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <button
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="p-2 hover:bg-gray-900 rounded disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Slide {currentSlideIndex + 1} of {slides.length}
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
      </div>
    </div>
  );
}