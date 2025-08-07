'use client';

import { motion } from 'framer-motion';
import { WebOfTrust } from './interactive/WebOfTrust';
import { PhoneMockup } from './interactive/PhoneMockup';
import { ClubsShowcase } from './interactive/ClubsShowcase';
import { EconomicsCalculator } from './interactive/EconomicsCalculator';
import { VisionMap } from './interactive/VisionMap';
import { GetStartedCTA } from './interactive/GetStartedCTA';
import { SlideRenderer } from './SlideRenderer';

interface InteractiveSlideRendererProps {
  slide: any;
  isPresenting?: boolean;
}

export function InteractiveSlideRenderer({ slide, isPresenting = false }: InteractiveSlideRendererProps) {
  // Return null if no slide
  if (!slide) return null;
  
  // Check if this is an interactive slide with a component
  if (slide.component) {
    const renderInteractiveComponent = () => {
      switch (slide.component) {
        case 'WebOfTrust':
          return (
            <WebOfTrust
              nodes={slide.nodes || []}
              connections={slide.connections || []}
              interactive={slide.interactive}
              expandable={slide.expandable}
              showCalculation={slide.showCalculation}
            />
          );
        
        case 'PhoneMockup':
          return (
            <PhoneMockup
              steps={slide.steps || []}
              interactive={slide.interactive}
              autoPlay={slide.autoPlay}
            />
          );
        
        case 'ContactImportDemo':
          return <ContactImportDemo contacts={slide.contacts || []} />;
        
        case 'MarketplaceView':
          return <MarketplaceView offers={slide.offers || []} />;
        
        case 'SecurityFeatures':
          return <SecurityFeatures features={slide.features || []} />;
        
        case 'ClubsShowcase':
          return <ClubsShowcase clubs={slide.clubs} interactive={slide.interactive} />;
        
        case 'EconomicsCalculator':
          return <EconomicsCalculator interactive={slide.interactive} />;
        
        case 'VisionMap':
          return <VisionMap interactive={slide.interactive} />;
        
        case 'GetStartedCTA':
          return <GetStartedCTA interactive={slide.interactive} />;
        
        default:
          return <div className="text-center text-gray-400">Component: {slide.component}</div>;
      }
    };

    return (
      <div className="w-full h-full bg-black relative overflow-hidden">
        <motion.div
          className="absolute inset-0 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {slide.title && (
            <motion.h2 
              className="text-4xl md:text-5xl font-black text-yellow-400 text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slide.title}
            </motion.h2>
          )}
          
          <div className="h-[calc(100%-100px)]">
            {renderInteractiveComponent()}
          </div>
        </motion.div>
        
        {!slide.hideBranding && (
          <div className="absolute bottom-4 right-4 text-gray-600 text-xs">
            Powered by VEXL
          </div>
        )}
      </div>
    );
  }

  // Fall back to standard slide renderer for non-interactive slides
  return <SlideRenderer slide={slide} isPresenting={isPresenting} />;
}

// Simplified demo components (can be expanded later)
function ContactImportDemo({ contacts }: { contacts: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
      {contacts.map((contact, index) => (
        <motion.div
          key={index}
          className="p-4 bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-yellow-400 transition cursor-pointer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white">{contact.name}</div>
              <div className="text-sm text-gray-400">{contact.trades} trades</div>
            </div>
            {contact.trusted && (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                ✓
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MarketplaceView({ offers }: { offers: any[] }) {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {offers.map((offer, index) => (
        <motion.div
          key={index}
          className={`p-6 rounded-lg border-2 ${
            offer.type === 'buy' 
              ? 'bg-green-900/20 border-green-800' 
              : 'bg-blue-900/20 border-blue-800'
          }`}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.15 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-white">{offer.amount}</div>
              <div className="text-yellow-400 text-xl">{offer.price}</div>
              <div className="text-gray-400 text-sm mt-2">
                📍 {offer.location} • {offer.distance}
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400">⭐ {offer.rating}</div>
              <div className="text-gray-400 text-sm">{offer.trades} trades</div>
              <button className="mt-2 px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500">
                {offer.type === 'buy' ? 'Sell' : 'Buy'}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SecurityFeatures({ features }: { features: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold text-yellow-400 mb-2">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
          {feature.demo && (
            <div className="mt-4 text-xs text-green-400">
              ✓ Interactive Demo Available
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}