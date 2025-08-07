'use client';

import { useState } from 'react';
import { vexlBrand, slideTemplates, brandAssets } from '@/lib/vexl-brand';
// Import icons as needed

interface SlideBuilderProps {
  slide: any;
  onUpdate: (updates: any) => void;
}

export function SlideBuilder({ slide, onUpdate }: SlideBuilderProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [selectedTemplate, setSelectedTemplate] = useState(slide.template || 'custom');

  const applyTemplate = (templateKey: string) => {
    const template = slideTemplates[templateKey as keyof typeof slideTemplates];
    if (template) {
      onUpdate({
        template: templateKey,
        layout: template.layout,
        ...template.defaultContent
      });
      setSelectedTemplate(templateKey);
    }
  };

  const renderContentEditor = () => {
    switch (slide.template || slide.type) {
      case 'title':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Main Title</label>
              <input
                type="text"
                value={slide.title as string}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full bg-gray-900 text-white text-3xl font-bold px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Your Title Here"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
              <input
                type="text"
                value={(slide.subtitle || slide.content || '') as string}
                onChange={(e) => onUpdate({ subtitle: e.target.value, content: e.target.value })}
                className="w-full bg-gray-900 text-white text-xl px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Add a subtitle or tagline"
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showLogo"
                checked={(slide.showLogo || false) as boolean}
                onChange={(e) => onUpdate({ showLogo: e.target.checked })}
                className="rounded bg-gray-900 border-gray-600 text-yellow-400 focus:ring-yellow-400"
              />
              <label htmlFor="showLogo" className="text-sm text-gray-400">Show Vexl Logo</label>
            </div>
          </div>
        );

      case 'agenda':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Agenda Title</label>
              <input
                type="text"
                value={slide.title as string}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full bg-gray-900 text-white text-2xl font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Agenda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Agenda Items</label>
              <textarea
                value={((slide.items as string[]) || []).join('\n')}
                onChange={(e) => onUpdate({ items: e.target.value.split('\n').filter(Boolean) })}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={6}
                placeholder="Enter each agenda item on a new line"
              />
            </div>
          </div>
        );

      case 'feature':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Feature Name</label>
              <input
                type="text"
                value={slide.title as string}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full bg-gray-900 text-white text-2xl font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Feature Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                value={(slide.description || '') as string}
                onChange={(e) => onUpdate({ description: e.target.value })}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={3}
                placeholder="Describe this feature"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Icon</label>
              <div className="flex flex-wrap gap-2">
                {brandAssets.icons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => onUpdate({ icon })}
                    className={`text-2xl p-2 rounded ${slide.icon === icon ? 'bg-yellow-400 text-black' : 'bg-gray-900 hover:bg-gray-800'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Benefits</label>
              <textarea
                value={((slide.benefits as string[]) || []).join('\n')}
                onChange={(e) => onUpdate({ benefits: e.target.value.split('\n').filter(Boolean) })}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={4}
                placeholder="Enter each benefit on a new line"
              />
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
              <input
                type="text"
                value={slide.title as string}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full bg-gray-900 text-white text-2xl font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="By The Numbers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Statistics</label>
              {((slide.stats as Array<{value: string; label: string}>) || []).map((stat, index: number) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...((slide.stats as Array<{value: string; label: string}>) || [])];
                      newStats[index] = { ...newStats[index], value: e.target.value };
                      onUpdate({ stats: newStats });
                    }}
                    className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="100K+"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...((slide.stats as Array<{value: string; label: string}>) || [])];
                      newStats[index] = { ...newStats[index], label: e.target.value };
                      onUpdate({ stats: newStats });
                    }}
                    className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Users"
                  />
                </div>
              ))}
              <button
                onClick={() => onUpdate({ stats: [...((slide.stats as Array<{value: string; label: string}>) || []), { value: '', label: '' }] })}
                className="text-yellow-400 text-sm hover:underline"
              >
                + Add Statistic
              </button>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Quote</label>
              <textarea
                value={(slide.quote || '') as string}
                onChange={(e) => onUpdate({ quote: e.target.value })}
                className="w-full bg-gray-900 text-white text-xl italic px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={3}
                placeholder='"Your inspiring quote here"'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Author</label>
              <input
                type="text"
                value={(slide.author || '') as string}
                onChange={(e) => onUpdate({ author: e.target.value })}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Author Name"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
              <input
                type="text"
                value={slide.title as string}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full bg-gray-900 text-white text-2xl font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Slide Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
              <textarea
                value={(slide.content || '') as string}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={8}
                placeholder="Add your content here"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`px-4 py-2 font-medium ${activeTab === 'design' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
        >
          Design
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium ${activeTab === 'templates' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
        >
          Templates
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'content' && renderContentEditor()}

        {activeTab === 'design' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Background</label>
              <div className="grid grid-cols-2 gap-2">
                {brandAssets.backgrounds.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => onUpdate({ background: bg.id, backgroundStyle: bg.style })}
                    className={`p-3 rounded-lg border-2 ${slide.background === bg.id ? 'border-yellow-400' : 'border-gray-700'}`}
                    style={bg.style}
                  >
                    <span className="text-xs text-white drop-shadow">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Text Alignment</label>
              <div className="flex space-x-2">
                {['left', 'center', 'right'].map(align => (
                  <button
                    key={align}
                    onClick={() => onUpdate({ textAlign: align })}
                    className={`px-4 py-2 rounded capitalize ${slide.textAlign === align ? 'bg-yellow-400 text-black' : 'bg-gray-900'}`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Accent Color</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => onUpdate({ accentColor: vexlBrand.colors.primary })}
                  className="w-10 h-10 rounded"
                  style={{ backgroundColor: vexlBrand.colors.primary }}
                />
                <button
                  onClick={() => onUpdate({ accentColor: '#FFFFFF' })}
                  className="w-10 h-10 rounded bg-white"
                />
                <button
                  onClick={() => onUpdate({ accentColor: '#FF0000' })}
                  className="w-10 h-10 rounded bg-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Choose a pre-designed template</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(slideTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => applyTemplate(key)}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    selectedTemplate === key 
                      ? 'border-yellow-400 bg-yellow-400/10' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-gray-400">{template.layout} layout</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}