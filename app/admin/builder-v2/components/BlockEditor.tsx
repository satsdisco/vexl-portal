'use client';

import RichTextEditor from './RichTextEditor';

interface BlockEditorProps {
  block: {
    type: string;
    data: any;
  };
  onUpdate: (updates: any) => void;
  isCompact?: boolean;
}

export default function BlockEditor({ block, onUpdate, isCompact = false }: BlockEditorProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  if (isCompact) {
    // Show a preview when not selected
    switch (block.type) {
      case 'rich-text':
        return (
          <div className="text-sm text-gray-400 truncate">
            {block.data.content || 'Empty text block'}
          </div>
        );
      
      case 'quote':
        return (
          <div className="text-sm text-gray-400">
            "{block.data.text?.substring(0, 50)}..." - {block.data.author}
          </div>
        );
      
      case 'device-mockup':
        return (
          <div className="text-sm text-gray-400">
            {block.data.device} mockup - {block.data.title}
          </div>
        );
      
      case 'call-to-action':
        return (
          <div className="text-sm text-gray-400">
            {block.data.headline} → {block.data.buttonText}
          </div>
        );
      
      case 'comparison':
        return (
          <div className="text-sm text-gray-400">
            {block.data.title || 'Comparison table'}
          </div>
        );
      
      default:
        return <div className="text-sm text-gray-400">Unknown block type</div>;
    }
  }

  // Full editor when selected
  switch (block.type) {
    case 'rich-text':
      return (
        <div className="space-y-3">
          <RichTextEditor
            content={block.data.content}
            onChange={(content) => updateData('content', content)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Alignment</label>
              <select
                value={block.data.alignment || 'left'}
                onChange={(e) => updateData('alignment', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Font Size</label>
              <select
                value={block.data.fontSize || 'medium'}
                onChange={(e) => updateData('fontSize', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>
          </div>
        </div>
      );
    
    case 'quote':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Quote Text</label>
            <textarea
              value={block.data.text || ''}
              onChange={(e) => updateData('text', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm resize-none"
              rows={3}
              placeholder="Enter quote text..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Author</label>
              <input
                value={block.data.author || ''}
                onChange={(e) => updateData('author', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Role</label>
              <input
                value={block.data.role || ''}
                onChange={(e) => updateData('role', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
                placeholder="Title/Role"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Style</label>
            <select
              value={block.data.style || 'default'}
              onChange={(e) => updateData('style', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
            >
              <option value="default">Default</option>
              <option value="highlight">Highlight</option>
              <option value="testimonial">Testimonial</option>
            </select>
          </div>
        </div>
      );
    
    case 'device-mockup':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Device</label>
              <select
                value={block.data.device || 'iphone14pro'}
                onChange={(e) => updateData('device', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              >
                <option value="iphone14pro">iPhone 14 Pro</option>
                <option value="android">Android</option>
                <option value="desktop">Desktop</option>
                <option value="tablet">Tablet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Orientation</label>
              <select
                value={block.data.orientation || 'portrait'}
                onChange={(e) => updateData('orientation', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Title</label>
            <input
              value={block.data.title || ''}
              onChange={(e) => updateData('title', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              placeholder="Device title"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Caption</label>
            <input
              value={block.data.caption || ''}
              onChange={(e) => updateData('caption', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              placeholder="Device caption"
            />
          </div>
        </div>
      );
    
    case 'call-to-action':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Headline</label>
            <input
              value={block.data.headline || ''}
              onChange={(e) => updateData('headline', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              placeholder="CTA headline"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Subtext</label>
            <textarea
              value={block.data.subtext || ''}
              onChange={(e) => updateData('subtext', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm resize-none"
              rows={2}
              placeholder="Supporting text"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Button Text</label>
              <input
                value={block.data.buttonText || ''}
                onChange={(e) => updateData('buttonText', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
                placeholder="Button label"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Button URL</label>
              <input
                value={block.data.buttonUrl || ''}
                onChange={(e) => updateData('buttonUrl', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Style</label>
              <select
                value={block.data.style || 'primary'}
                onChange={(e) => updateData('style', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="minimal">Minimal</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Alignment</label>
              <select
                value={block.data.alignment || 'center'}
                onChange={(e) => updateData('alignment', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>
      );
    
    case 'comparison':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Title</label>
            <input
              value={block.data.title || ''}
              onChange={(e) => updateData('title', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
              placeholder="Comparison title"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Left Column */}
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Left Column</label>
              <input
                value={block.data.leftColumn?.title || ''}
                onChange={(e) => updateData('leftColumn', { 
                  ...block.data.leftColumn, 
                  title: e.target.value 
                })}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
                placeholder="Option title"
              />
              <input
                value={block.data.leftColumn?.emoji || ''}
                onChange={(e) => updateData('leftColumn', { 
                  ...block.data.leftColumn, 
                  emoji: e.target.value 
                })}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
                placeholder="Emoji"
                maxLength={10}
              />
            </div>
            
            {/* Right Column */}
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Right Column</label>
              <input
                value={block.data.rightColumn?.title || ''}
                onChange={(e) => updateData('rightColumn', { 
                  ...block.data.rightColumn, 
                  title: e.target.value 
                })}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
                placeholder="Option title"
              />
              <input
                value={block.data.rightColumn?.emoji || ''}
                onChange={(e) => updateData('rightColumn', { 
                  ...block.data.rightColumn, 
                  emoji: e.target.value 
                })}
                className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
                placeholder="Emoji"
                maxLength={10}
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-xs text-gray-400">
              <input
                type="checkbox"
                checked={block.data.showDivider !== false}
                onChange={(e) => updateData('showDivider', e.target.checked)}
              />
              Show divider between columns
            </label>
          </div>
        </div>
      );
    
    default:
      return <div className="text-sm text-gray-400">Unknown block type: {block.type}</div>;
  }
}