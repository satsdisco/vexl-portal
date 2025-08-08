import { cache } from 'react';
import { PresentationSchema } from './strapi-types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Server-side fetch with caching
export const getPresentationBySlug = cache(async (slug: string) => {
  try {
    const url = new URL(`${STRAPI_URL}/api/presentations`);
    
    // Deep populate sections and media
    url.searchParams.append('filters[slug][$eq]', slug);
    url.searchParams.append('populate[sections][populate]', '*');
    url.searchParams.append('populate[thumbnail]', '*');
    
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache for 1 minute
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch presentation: ${response.status}`);
      return null;
    }

    const json = await response.json();
    
    if (!json.data || json.data.length === 0) {
      return null;
    }

    // Validate with Zod
    const parsed = PresentationSchema.safeParse(json.data[0]);
    
    if (!parsed.success) {
      console.error('Invalid presentation data:', parsed.error);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('Error fetching presentation:', error);
    return null;
  }
});

// Get all presentations for listing
export const getAllPresentations = cache(async () => {
  try {
    const url = new URL(`${STRAPI_URL}/api/presentations`);
    url.searchParams.append('populate', 'sections');
    url.searchParams.append('sort', 'createdAt:desc');
    
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching presentations:', error);
    return [];
  }
});