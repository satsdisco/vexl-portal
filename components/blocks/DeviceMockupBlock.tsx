'use client';

import { memo } from 'react';
import Image from 'next/image';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import type { DeviceMockupBlock } from '@/lib/strapi-types';
import PolishedPhoneMockup from '@/components/interactive/PolishedPhoneMockup';

interface DeviceMockupBlockProps {
  block: DeviceMockupBlock;
}

export const DeviceMockupBlockComponent = memo(function DeviceMockupBlock({ block }: DeviceMockupBlockProps) {
  const screenshots = block.screenshots || [];
  const hasScreenshots = screenshots.length > 0;

  // If we have screenshots, use the PolishedPhoneMockup
  if (hasScreenshots && screenshots[0]?.url) {
    return (
      <div className="my-12">
        <PolishedPhoneMockup
          screenshots={screenshots.map(s => 
            s.url.startsWith('http') ? s.url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${s.url}`
          )}
        />
        {screenshots[0]?.caption && (
          <p 
            className="text-center mt-4 text-sm"
            style={{ color: vexlBrand.colors.gray[500] }}
          >
            {screenshots[0].caption}
          </p>
        )}
      </div>
    );
  }

  // Fallback placeholder
  return (
    <div className="my-12">
      <div 
        className="mx-auto max-w-sm aspect-[9/19] rounded-3xl border-8 flex items-center justify-center"
        style={{ 
          borderColor: vexlBrand.colors.gray[800],
          backgroundColor: vexlBrand.colors.gray[900]
        }}
      >
        <div className="text-center p-8">
          <div 
            className="text-6xl mb-4"
            style={{ color: vexlBrand.colors.primary.yellow }}
          >
            📱
          </div>
          <p style={{ color: vexlBrand.colors.gray[500] }}>
            Device preview coming soon
          </p>
        </div>
      </div>
    </div>
  );
});