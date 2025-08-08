import { z } from 'zod';

// Block type schemas
export const RichTextBlockSchema = z.object({
  type: z.literal('RichText'),
  content: z.string(),
});

export const DeviceMockupBlockSchema = z.object({
  type: z.literal('DeviceMockup'),
  device: z.enum(['iphone14pro', 'iphone13', 'pixel', 'samsung']).optional(),
  screenshots: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  })).optional(),
});

export const QuoteBlockSchema = z.object({
  type: z.literal('Quote'),
  text: z.string(),
  author: z.string().optional(),
  role: z.string().optional(),
});

export const BlockSchema = z.discriminatedUnion('type', [
  RichTextBlockSchema,
  DeviceMockupBlockSchema,
  QuoteBlockSchema,
]);

export const SectionSchema = z.object({
  id: z.number(),
  attributes: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    type: z.string(),
    order: z.number().optional(),
    content: z.object({
      blocks: z.array(BlockSchema).optional(),
    }).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string().optional(),
  }),
});

export const PresentationSchema = z.object({
  id: z.number(),
  attributes: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    isMaster: z.boolean().optional(),
    duration: z.number().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    tags: z.array(z.string()).optional(),
    sections: z.object({
      data: z.array(SectionSchema),
    }).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string().optional(),
  }),
});

// Inferred types
export type RichTextBlock = z.infer<typeof RichTextBlockSchema>;
export type DeviceMockupBlock = z.infer<typeof DeviceMockupBlockSchema>;
export type QuoteBlock = z.infer<typeof QuoteBlockSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Presentation = z.infer<typeof PresentationSchema>;