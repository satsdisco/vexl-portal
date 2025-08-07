'use client';

import { motion } from 'framer-motion';
import { FileText, Sparkles, Users, Shield } from 'lucide-react';
import { vexlWorkshopTemplate } from '@/lib/vexl-workshop-template';

interface WorkshopTemplateLoaderProps {
  onLoadTemplate: (slides: any[]) => void;
  onCancel: () => void;
}

export function WorkshopTemplateLoader({ onLoadTemplate, onCancel }: WorkshopTemplateLoaderProps) {
  const templates = [
    {
      id: 'vexl-default',
      name: 'Vexl Official Workshop',
      description: 'The complete P2P Bitcoin trading workshop with interactive demos',
      duration: 30,
      slides: vexlWorkshopTemplate.sections.length,
      icon: <Sparkles className="text-yellow-400" size={24} />,
      featured: true
    },
    {
      id: 'quick-intro',
      name: 'Quick Introduction',
      description: 'A 10-minute overview of Vexl for quick presentations',
      duration: 10,
      slides: 5,
      icon: <FileText className="text-blue-400" size={24} />
    },
    {
      id: 'community',
      name: 'Community Builder',
      description: 'Focus on clubs and community features',
      duration: 15,
      slides: 8,
      icon: <Users className="text-green-400" size={24} />
    },
    {
      id: 'security',
      name: 'Security Deep Dive',
      description: 'Technical workshop on privacy and security features',
      duration: 20,
      slides: 10,
      icon: <Shield className="text-purple-400" size={24} />
    }
  ];

  const loadTemplate = (templateId: string) => {
    if (templateId === 'vexl-default') {
      const slides = vexlWorkshopTemplate.sections.map((section, index) => ({
        id: `slide-${index + 1}`,
        type: section.type,
        template: section.template,
        title: section.title,
        subtitle: section.subtitle,
        content: section.content,
        notes: section.notes,
        duration: section.duration,
        ...section.content
      }));
      onLoadTemplate(slides);
    } else {
      // Load other templates (simplified for now)
      onLoadTemplate([
        {
          id: '1',
          type: 'title',
          template: 'title',
          title: 'Custom Workshop',
          subtitle: 'Start building your presentation',
          showLogo: true,
          background: 'gradient-dark'
        }
      ]);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Choose a Template</h2>
          <p className="text-gray-400">Start with a pre-built workshop or create from scratch</p>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <motion.button
                key={template.id}
                className={`p-6 rounded-lg border-2 text-left transition-all ${
                  template.featured
                    ? 'border-yellow-400 bg-yellow-400/5 hover:bg-yellow-400/10'
                    : 'border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600'
                }`}
                onClick={() => loadTemplate(template.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {template.featured && (
                  <div className="text-xs bg-yellow-400 text-black px-2 py-1 rounded inline-block mb-3">
                    RECOMMENDED
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{template.slides} slides</span>
                      <span>{template.duration} min</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="font-bold text-white mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-gray-400">
              Start with the Vexl Official Workshop template to get all the interactive components and demos. 
              You can customize any slide or add your own content afterward.
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-800 flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={() => loadTemplate('blank')}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded transition"
          >
            Start from Scratch
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}