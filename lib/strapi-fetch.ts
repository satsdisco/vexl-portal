// Centralized Strapi fetch helper with TypeScript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiAttributes {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Presentation extends StrapiAttributes {
  title: string;
  slug: string;
  description?: string;
  isMaster?: boolean;
  duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  sections?: {
    data: Section[];
  };
}

export interface Section extends StrapiAttributes {
  title?: string;
  subtitle?: string;
  type: string;
  order?: number;
  content?: {
    blocks?: Block[];
  };
}

export interface Block {
  type: 'RichText' | 'DeviceMockup' | 'Quote';
  content?: string;
  text?: string;
  author?: string;
  role?: string;
  device?: string;
  screenshots?: Screenshot[];
}

export interface Screenshot {
  url: string;
  alt?: string;
  caption?: string;
}

export class StrapiFetch {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${STRAPI_URL}/api`;
  }

  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Strapi fetch failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch from Strapi: ${endpoint}`, error);
      throw error;
    }
  }

  // Get all presentations
  async getPresentations(params?: {
    filters?: Record<string, any>;
    populate?: string;
    sort?: string;
  }): Promise<StrapiResponse<Array<{ id: number; attributes: Presentation }>>> {
    const query = new URLSearchParams();
    
    if (params?.populate) query.append('populate', params.populate);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        query.append(`filters[${key}]`, value);
      });
    }

    return this.fetch(`/presentations?${query.toString()}`);
  }

  // Get single presentation by slug
  async getPresentationBySlug(slug: string): Promise<{ id: number; attributes: Presentation } | null> {
    const response = await this.getPresentations({
      filters: { slug },
      populate: 'sections'
    });

    return response.data[0] || null;
  }

  // Get master deck
  async getMasterDeck(): Promise<{ id: number; attributes: Presentation } | null> {
    const response = await this.getPresentations({
      filters: { isMaster: true },
      populate: 'sections'
    });

    return response.data[0] || null;
  }

  // Health check
  async checkHealth(): Promise<{ status: string; database: string }> {
    return this.fetch('/health');
  }
}

export const strapiFetch = new StrapiFetch();