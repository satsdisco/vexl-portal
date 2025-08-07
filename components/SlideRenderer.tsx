'use client';

import { vexlBrand } from '@/lib/vexl-brand';
import { motion } from 'framer-motion';

interface SlideRendererProps {
  slide: any;
  isPresenting?: boolean;
}

export function SlideRenderer({ slide, isPresenting = false }: SlideRendererProps) {
  const getBackgroundStyle = () => {
    if (slide.backgroundStyle) return slide.backgroundStyle;
    
    switch (slide.background) {
      case 'gradient-yellow':
        return { background: vexlBrand.colors.gradient.yellow };
      case 'gradient-dark':
        return { background: vexlBrand.colors.gradient.dark };
      case 'pattern-dots':
        return {
          background: '#000000',
          backgroundImage: 'radial-gradient(circle, #FFE50020 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        };
      default:
        return { background: '#000000' };
    }
  };

  const renderSlideContent = () => {
    switch (slide.template || slide.type) {
      case 'title':
        return (
          <motion.div 
            className="flex flex-col items-center justify-center h-full text-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {slide.showLogo && (
              <div className="mb-8">
                <div className="text-6xl font-black text-yellow-400">VEXL</div>
              </div>
            )}
            <h1 
              className="font-black mb-6"
              style={{ 
                fontSize: isPresenting ? vexlBrand.typography.sizes.hero : vexlBrand.typography.sizes.h1,
                color: slide.accentColor || vexlBrand.colors.primary,
                textShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}
            >
              {slide.title}
            </h1>
            {(slide.subtitle || slide.content) && (
              <p 
                className="text-gray-300"
                style={{ 
                  fontSize: isPresenting ? vexlBrand.typography.sizes.h3 : vexlBrand.typography.sizes.body 
                }}
              >
                {slide.subtitle || slide.content}
              </p>
            )}
          </motion.div>
        );

      case 'agenda':
        return (
          <motion.div 
            className="flex flex-col h-full px-12 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-black text-yellow-400 mb-8">
              {slide.title || 'Agenda'}
            </h2>
            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-4">
                {(slide.items || []).map((item: string, index: number) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="text-xl text-white">{item}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'feature':
        return (
          <motion.div 
            className="flex h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-1 flex flex-col justify-center px-12">
              <div className="text-6xl mb-6">{slide.icon || '✨'}</div>
              <h2 className="text-5xl font-black text-yellow-400 mb-4">
                {slide.title}
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                {slide.description}
              </p>
              {slide.benefits && slide.benefits.length > 0 && (
                <div className="space-y-3">
                  {slide.benefits.map((benefit: string, index: number) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <span className="text-lg text-white">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'stats':
        return (
          <motion.div 
            className="flex flex-col h-full px-12 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-black text-yellow-400 mb-12 text-center">
              {slide.title || 'By The Numbers'}
            </h2>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 content-center">
              {((slide.stats as Array<{value: string; label: string}>) || []).map((stat, index: number) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                >
                  <div className="text-5xl font-black text-yellow-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'quote':
        return (
          <motion.div 
            className="flex items-center justify-center h-full px-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-4xl">
              <div className="text-8xl text-yellow-400 mb-6">&ldquo;</div>
              <blockquote className="text-3xl md:text-4xl font-light italic text-white mb-8">
                {slide.quote}
              </blockquote>
              {slide.author && (
                <cite className="text-xl text-gray-400 not-italic">
                  — {slide.author}
                </cite>
              )}
            </div>
          </motion.div>
        );

      case 'comparison':
        return (
          <motion.div 
            className="flex flex-col h-full px-12 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-black text-yellow-400 mb-12 text-center">
              {slide.title}
            </h2>
            <div className="flex-1 grid grid-cols-2 gap-8">
              {((slide.columns as Array<{header: string; items: string[]}>) || []).map((column, colIndex: number) => (
                <motion.div
                  key={colIndex}
                  className={`rounded-lg p-6 ${colIndex === 0 ? 'bg-yellow-400/10 border-2 border-yellow-400' : 'bg-gray-900'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: colIndex * 0.2 }}
                >
                  <h3 className={`text-2xl font-bold mb-4 ${colIndex === 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {column.header}
                  </h3>
                  <ul className="space-y-2">
                    {(column.items || []).map((item: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className={colIndex === 0 ? 'text-green-400' : 'text-red-400'}>
                          {colIndex === 0 ? '✓' : '✗'}
                        </span>
                        <span className="text-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'cta':
        return (
          <motion.div 
            className="flex flex-col items-center justify-center h-full text-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-black text-yellow-400 mb-6">
              {slide.title || 'Ready to Get Started?'}
            </h2>
            <p className="text-2xl text-gray-300 mb-8 max-w-2xl">
              {slide.description || 'Join the Vexl community today'}
            </p>
            <motion.button
              className="px-12 py-4 bg-yellow-400 text-black text-xl font-bold rounded-lg hover:bg-yellow-500 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {slide.buttonText || 'Download Vexl'}
            </motion.button>
            {slide.qrCode && (
              <div className="mt-8 p-4 bg-white rounded-lg">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  QR Code
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'code':
        return (
          <motion.div 
            className="flex flex-col h-full px-12 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-black text-yellow-400 mb-6">
              {slide.title}
            </h2>
            <div className="flex-1 bg-gray-950 rounded-lg p-6 border border-gray-800 overflow-auto">
              <div className="text-xs text-gray-500 mb-3">
                {slide.language || 'javascript'}
              </div>
              <pre className="text-green-400 font-mono text-lg">
                <code>{slide.code}</code>
              </pre>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div 
            className="flex flex-col justify-center h-full px-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: slide.textAlign || 'left' }}
          >
            <h2 className="text-5xl font-black text-yellow-400 mb-8">
              {slide.title}
            </h2>
            <div className="text-xl text-gray-300 whitespace-pre-wrap leading-relaxed">
              {slide.content}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div 
      className="w-full h-full relative overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Vexl Pattern Overlay */}
      {slide.showPattern && (
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #FFE500 0%, transparent 50%)',
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {renderSlideContent()}
      </div>

      {/* Vexl Branding */}
      {!slide.hideBranding && (
        <div className="absolute bottom-4 right-4 text-gray-600 text-sm">
          Powered by VEXL
        </div>
      )}
    </div>
  );
}