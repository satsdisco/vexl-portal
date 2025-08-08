'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import type { RichTextBlock } from '@/lib/strapi-types';

interface RichTextBlockProps {
  block: RichTextBlock;
}

export const RichTextBlockComponent = memo(function RichTextBlock({ block }: RichTextBlockProps) {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 
              className="text-4xl md:text-5xl font-bold mt-8 mb-4"
              style={{ 
                fontFamily: vexlBrand.typography.fontFamily.primary,
                color: vexlBrand.colors.primary.yellow 
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 
              className="text-2xl md:text-3xl font-bold mt-6 mb-3"
              style={{ 
                fontFamily: vexlBrand.typography.fontFamily.primary,
                color: vexlBrand.colors.primary.white 
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 
              className="text-xl md:text-2xl font-semibold mt-4 mb-2"
              style={{ color: vexlBrand.colors.primary.white }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p 
              className="mb-4 leading-relaxed"
              style={{ 
                fontFamily: vexlBrand.typography.body,
                color: vexlBrand.colors.gray[300],
                fontSize: '1.125rem',
                lineHeight: '1.75'
              }}
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 my-4 list-none">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start">
              <span 
                className="mr-3 mt-1.5 flex-shrink-0"
                style={{ color: vexlBrand.colors.primary.yellow }}
              >
                •
              </span>
              <span style={{ color: vexlBrand.colors.gray[300] }}>
                {children}
              </span>
            </li>
          ),
          strong: ({ children }) => (
            <strong 
              className="font-bold"
              style={{ color: vexlBrand.colors.primary.yellow }}
            >
              {children}
            </strong>
          ),
          a: ({ href, children }) => (
            <a 
              href={href}
              className="underline hover:no-underline transition-colors"
              style={{ 
                color: vexlBrand.colors.primary.yellow,
                textDecorationColor: vexlBrand.colors.primary.yellow 
              }}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote 
              className="border-l-4 pl-6 my-6 italic"
              style={{ 
                borderColor: vexlBrand.colors.primary.yellow,
                color: vexlBrand.colors.gray[400]
              }}
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {block.content}
      </ReactMarkdown>
    </div>
  );
});