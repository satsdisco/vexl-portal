'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Home } from 'lucide-react';
import { strapiClient } from '@/lib/strapi';
import { SlideRenderer } from '@/components/SlideRenderer';

interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'code' | 'quiz';
  title: string;
  content?: string;
  imageUrl?: string;
  code?: string;
  language?: string;
  notes?: string;
  [key: string]: unknown;
}

interface Workshop {
  title: string;
  description: string;
  slides: Slide[];
}

export default function PresentWorkshopPage() {
  const router = useRouter();
  const params = useParams();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWorkshop = async () => {
    try {
      const { data } = await strapiClient.get(`/workshops/${params.id}?populate=*`);
      setWorkshop(data.data);
    } catch (error) {
      console.error('Failed to fetch workshop:', error);
      router.push('/workshops');
    }
    setLoading(false);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!workshop) return;
    
    switch(e.key) {
      case 'ArrowLeft':
        setCurrentSlideIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowRight':
        setCurrentSlideIndex(prev => Math.min(workshop.slides.length - 1, prev + 1));
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'n':
        setShowNotes(prev => !prev);
        break;
      case 'Escape':
        if (isFullscreen) {
          document.exitFullscreen();
        }
        break;
    }
  }, [workshop, isFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading presentation...</div>
      </div>
    );
  }

  if (!workshop || !workshop.slides || workshop.slides.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">No slides found</div>
          <button
            onClick={() => router.push('/workshops')}
            className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500"
          >
            Back to Workshops
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = workshop.slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / workshop.slides.length) * 100;


  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-900">
        <div 
          className="h-full bg-yellow-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls Bar */}
      {!isFullscreen && (
        <div className="border-b border-gray-900 px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/workshops')}
                className="p-2 hover:bg-gray-900 rounded"
              >
                <Home size={18} />
              </button>
              <span className="text-sm text-gray-400">
                {workshop.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400 mr-4">
                {currentSlideIndex + 1} / {workshop.slides.length}
              </span>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded ${showNotes ? 'bg-gray-800' : 'hover:bg-gray-900'}`}
                title="Toggle notes (N)"
              >
                Notes
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-900 rounded"
                title="Fullscreen (F)"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Slide */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full h-full max-w-7xl mx-auto">
            <SlideRenderer slide={currentSlide} isPresenting={true} />
          </div>
        </div>

        {/* Speaker Notes */}
        {showNotes && currentSlide.notes && !isFullscreen && (
          <div className="w-96 border-l border-gray-900 p-6 bg-gray-950">
            <h3 className="text-sm font-bold text-gray-400 mb-3">SPEAKER NOTES</h3>
            <div className="text-sm text-gray-300 whitespace-pre-wrap">
              {currentSlide.notes}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-8 py-4">
        <button
          onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
          disabled={currentSlideIndex === 0}
          className="p-3 hover:bg-gray-900 rounded-full disabled:opacity-30 transition"
        >
          <ChevronLeft size={24} />
        </button>

        {isFullscreen && (
          <button
            onClick={() => document.exitFullscreen()}
            className="p-2 hover:bg-gray-900 rounded"
          >
            <Minimize2 size={18} />
          </button>
        )}

        <button
          onClick={() => setCurrentSlideIndex(Math.min(workshop.slides.length - 1, currentSlideIndex + 1))}
          disabled={currentSlideIndex === workshop.slides.length - 1}
          className="p-3 hover:bg-gray-900 rounded-full disabled:opacity-30 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      {!isFullscreen && (
        <div className="text-center text-xs text-gray-600 pb-2">
          ← → Navigate • F Fullscreen • N Notes • ESC Exit
        </div>
      )}
    </div>
  );
}