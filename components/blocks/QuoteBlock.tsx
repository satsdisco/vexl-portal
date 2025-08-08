'use client';

import { memo } from 'react';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import type { QuoteBlock } from '@/lib/strapi-types';

interface QuoteBlockProps {
  block: QuoteBlock;
}

export const QuoteBlockComponent = memo(function QuoteBlock({ block }: QuoteBlockProps) {
  return (
    <blockquote className="my-16 relative">
      {/* Large decorative quote */}
      <div 
        className="absolute -top-8 -left-4 text-8xl opacity-20"
        style={{ color: vexlBrand.colors.primary.yellow }}
      >
        "
      </div>
      
      {/* Quote text */}
      <p 
        className="text-2xl md:text-3xl font-medium italic leading-relaxed relative z-10 px-12"
        style={{ 
          fontFamily: vexlBrand.typography.heading,
          color: vexlBrand.colors.primary.white 
        }}
      >
        {block.text}
      </p>
      
      {/* Attribution */}
      {(block.author || block.role) && (
        <footer className="mt-6 px-12">
          <cite className="not-italic">
            {block.author && (
              <span 
                className="font-semibold"
                style={{ color: vexlBrand.colors.primary.yellow }}
              >
                — {block.author}
              </span>
            )}
            {block.role && (
              <span 
                className="block text-sm mt-1"
                style={{ color: vexlBrand.colors.gray[500] }}
              >
                {block.role}
              </span>
            )}
          </cite>
        </footer>
      )}
    </blockquote>
  );
});