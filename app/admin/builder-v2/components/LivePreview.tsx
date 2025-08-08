'use client';

import { motion } from 'framer-motion';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface LivePreviewProps {
  section: any;
}

export default function LivePreview({ section }: LivePreviewProps) {
  if (!section) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <p className="text-gray-500">Select a section to preview</p>
      </div>
    );
  }

  const getBackgroundStyle = () => {
    switch (section.backgroundColor) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${vexlBrand.colors.primary.yellow} 0%, ${vexlBrand.colors.primary.orange} 100%)`,
        };
      case 'yellow':
        return { backgroundColor: vexlBrand.colors.primary.yellow };
      case 'light':
        return { backgroundColor: vexlBrand.colors.gray[100] };
      case 'dark':
        return { backgroundColor: vexlBrand.colors.gray[900] };
      default:
        return { backgroundColor: 'black' };
    }
  };

  const textColor = ['yellow', 'light'].includes(section.backgroundColor) ? 'black' : 'white';

  return (
    <div 
      className="h-full overflow-auto"
      style={getBackgroundStyle()}
    >
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-full flex items-center justify-center p-8"
      >
        <div className="max-w-5xl w-full">
          {/* Section Header */}
          {(section.title || section.subtitle) && (
            <div className="text-center mb-12">
              {section.title && (
                <h2 
                  className="text-4xl md:text-6xl font-bold mb-4"
                  style={{ 
                    color: textColor === 'black' ? 'black' : vexlBrand.colors.primary.yellow 
                  }}
                >
                  {section.title}
                </h2>
              )}
              {section.subtitle && (
                <p 
                  className="text-xl md:text-2xl"
                  style={{ 
                    color: textColor === 'black' ? 'rgba(0,0,0,0.7)' : vexlBrand.colors.gray[400] 
                  }}
                >
                  {section.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Content Blocks */}
          <div className="space-y-8">
            {section.content.map((block: any, index: number) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {renderBlock(block, textColor)}
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {section.content.length === 0 && !section.title && !section.subtitle && (
            <div className="text-center" style={{ color: textColor === 'black' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }}>
              <p>Empty section - add content blocks to see them here</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function renderBlock(block: any, textColor: string) {
  switch (block.type) {
    case 'rich-text':
      return (
        <div 
          className={`prose ${textColor === 'black' ? 'prose-gray' : 'prose-invert'} max-w-none`}
          style={{
            textAlign: block.data.alignment || 'left',
            fontSize: getFontSize(block.data.fontSize),
            color: textColor,
          }}
          dangerouslySetInnerHTML={{ __html: block.data.content || '' }}
        />
      );

    case 'quote':
      return (
        <blockquote 
          className={`border-l-4 pl-6 py-4 ${
            block.data.style === 'highlight' 
              ? 'bg-yellow-400/10 border-yellow-400' 
              : 'border-gray-600'
          }`}
        >
          <p className="text-xl md:text-2xl mb-3" style={{ color: textColor }}>
            "{block.data.text}"
          </p>
          <footer>
            <cite className="text-sm" style={{ color: textColor === 'black' ? 'rgba(0,0,0,0.7)' : vexlBrand.colors.gray[400] }}>
              — {block.data.author}
              {block.data.role && `, ${block.data.role}`}
            </cite>
          </footer>
        </blockquote>
      );

    case 'device-mockup':
      return (
        <div className="text-center">
          <div className="inline-block">
            <div className={`
              ${block.data.device === 'iphone14pro' ? 'w-[300px] h-[600px]' : ''}
              ${block.data.device === 'android' ? 'w-[320px] h-[640px]' : ''}
              ${block.data.device === 'desktop' ? 'w-[600px] h-[400px]' : ''}
              ${block.data.device === 'tablet' ? 'w-[400px] h-[550px]' : ''}
              bg-gray-900 rounded-lg border-4 border-gray-700 relative
            `}>
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-bold">{block.data.title}</p>
                  <p className="text-sm mt-2">{block.data.caption}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'call-to-action':
      return (
        <div style={{ textAlign: block.data.alignment || 'center' }}>
          <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: textColor }}>
            {block.data.headline}
          </h3>
          {block.data.subtext && (
            <p className="text-lg mb-6" style={{ color: textColor === 'black' ? 'rgba(0,0,0,0.7)' : vexlBrand.colors.gray[400] }}>
              {block.data.subtext}
            </p>
          )}
          <button 
            className="px-6 py-3 rounded-lg font-bold transition-transform hover:scale-105"
            style={getButtonStyle(block.data.style)}
          >
            {block.data.buttonText}
          </button>
        </div>
      );

    case 'comparison':
      return (
        <div>
          {block.data.title && (
            <h3 className="text-2xl font-bold text-center mb-6" style={{ color: textColor }}>
              {block.data.title}
            </h3>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className={`
              p-6 rounded-lg border-2
              ${block.data.leftColumn?.highlight ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 bg-gray-900/50'}
            `}>
              <div className="text-4xl text-center mb-3">{block.data.leftColumn?.emoji}</div>
              <h4 className="text-xl font-bold text-center mb-4" style={{ color: textColor }}>
                {block.data.leftColumn?.title}
              </h4>
              <ul className="space-y-2">
                {(block.data.leftColumn?.features || []).map((feature: string, i: number) => (
                  <li key={i} className="text-sm" style={{ color: textColor === 'black' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)' }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div className={`
              p-6 rounded-lg border-2
              ${block.data.rightColumn?.highlight ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 bg-gray-900/50'}
            `}>
              <div className="text-4xl text-center mb-3">{block.data.rightColumn?.emoji}</div>
              <h4 className="text-xl font-bold text-center mb-4" style={{ color: textColor }}>
                {block.data.rightColumn?.title}
              </h4>
              <ul className="space-y-2">
                {(block.data.rightColumn?.features || []).map((feature: string, i: number) => (
                  <li key={i} className="text-sm" style={{ color: textColor === 'black' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)' }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-gray-800 rounded">
          <p className="text-gray-400">Unknown block type: {block.type}</p>
        </div>
      );
  }
}

function getFontSize(size: string) {
  switch (size) {
    case 'small': return '0.875rem';
    case 'large': return '1.25rem';
    case 'xlarge': return '1.5rem';
    default: return '1rem';
  }
}

function getButtonStyle(style: string) {
  switch (style) {
    case 'secondary':
      return {
        backgroundColor: 'transparent',
        color: vexlBrand.colors.primary.yellow,
        border: `2px solid ${vexlBrand.colors.primary.yellow}`,
      };
    case 'minimal':
      return {
        backgroundColor: 'transparent',
        color: vexlBrand.colors.primary.white,
        textDecoration: 'underline',
      };
    case 'gradient':
      return {
        background: `linear-gradient(135deg, ${vexlBrand.colors.primary.yellow} 0%, ${vexlBrand.colors.primary.orange} 100%)`,
        color: 'black',
      };
    default:
      return {
        backgroundColor: vexlBrand.colors.primary.yellow,
        color: 'black',
      };
  }
}