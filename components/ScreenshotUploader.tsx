'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface ScreenshotUploaderProps {
  screenshots: string[];
  onScreenshotsChange: (screenshots: string[]) => void;
  maxScreenshots?: number;
}

export default function ScreenshotUploader({
  screenshots,
  onScreenshotsChange,
  maxScreenshots = 5
}: ScreenshotUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      if (screenshots.length >= maxScreenshots) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onScreenshotsChange([...screenshots, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    onScreenshotsChange(newScreenshots);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging 
            ? 'border-yellow-400 bg-yellow-400/10' 
            : 'border-gray-700 hover:border-gray-600'
        }`}
        style={{
          borderColor: isDragging ? vexlBrand.colors.primary.yellow : undefined
        }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={screenshots.length >= maxScreenshots}
        />
        
        <Upload 
          size={48} 
          className="mx-auto mb-4 text-gray-600"
          style={{ color: isDragging ? vexlBrand.colors.primary.yellow : undefined }}
        />
        
        <h3 className="text-lg font-bold mb-2">
          {screenshots.length >= maxScreenshots 
            ? 'Maximum screenshots reached'
            : 'Upload Screenshots'
          }
        </h3>
        
        <p className="text-sm text-gray-400">
          {screenshots.length >= maxScreenshots 
            ? `You can upload up to ${maxScreenshots} screenshots`
            : 'Drag & drop images here or click to browse'
          }
        </p>
        
        <p className="text-xs text-gray-500 mt-2">
          {screenshots.length} / {maxScreenshots} screenshots
        </p>
      </div>

      {/* Screenshot Preview Grid */}
      {screenshots.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {screenshots.map((screenshot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <div className="aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden">
                  <img 
                    src={screenshot} 
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={() => removeScreenshot(index)}
                      className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-center text-gray-400">
                  Screenshot {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Tips */}
      {screenshots.length === 0 && (
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ImageIcon size={20} className="text-yellow-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Pro Tips:</p>
              <ul className="text-gray-400 space-y-1">
                <li>• Upload iPhone screenshots for best results</li>
                <li>• Screenshots will be displayed in phone mockups</li>
                <li>• Use high-resolution images (1170×2532px ideal)</li>
                <li>• Showcase key app features and interactions</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}