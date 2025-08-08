'use client';

import { memo } from 'react';
import { RichTextBlockComponent } from './RichTextBlock';
import { DeviceMockupBlockComponent } from './DeviceMockupBlock';
import { QuoteBlockComponent } from './QuoteBlock';
import type { Block } from '@/lib/strapi-types';

interface BlockRendererProps {
  block: Block;
  index?: number;
}

export const BlockRenderer = memo(function BlockRenderer({ block, index = 0 }: BlockRendererProps) {
  switch (block.type) {
    case 'RichText':
      return <RichTextBlockComponent block={block} />;
    
    case 'DeviceMockup':
      return <DeviceMockupBlockComponent block={block} />;
    
    case 'Quote':
      return <QuoteBlockComponent block={block} />;
    
    default:
      // Unknown block type - show debug info in dev
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="p-4 my-4 bg-red-900/20 border border-red-600 rounded">
            <p className="text-red-400">Unknown block type: {(block as any).type}</p>
            <pre className="text-xs mt-2 text-gray-400">
              {JSON.stringify(block, null, 2)}
            </pre>
          </div>
        );
      }
      return null;
  }
});