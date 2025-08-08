import { strapiClient } from './strapi';

// Types
export interface Presentation {
  id: number;
  attributes: {
    title: string;
    description?: string;
    duration?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
    isTemplate?: boolean;
    metadata?: Record<string, any>;
    sections?: {
      data: Section[];
    };
    author?: {
      data: {
        id: number;
        attributes: {
          username: string;
          email: string;
        };
      };
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface Section {
  id: number;
  attributes: {
    title?: string;
    subtitle?: string;
    type: string;
    template?: string;
    content?: Record<string, any>;
    notes?: string;
    order?: number;
    isReusable?: boolean;
    screenshots?: {
      data: Screenshot[];
    };
  };
}

export interface Screenshot {
  id: number;
  attributes: {
    title?: string;
    description?: string;
    image: {
      data: {
        id: number;
        attributes: {
          url: string;
          formats?: Record<string, any>;
        };
      };
    };
    alt?: string;
    tags?: string[];
  };
}

// Presentation API
export const presentationAPI = {
  // Get all presentations
  async getAll(populate = '*') {
    try {
      const { data } = await strapiClient.get(`/presentations?populate=${populate}`);
      return { success: true, data: data.data, meta: data.meta };
    } catch (error) {
      console.error('Error fetching presentations:', error);
      return { success: false, data: [], error };
    }
  },

  // Get single presentation
  async getById(id: string | number, populate = '*') {
    try {
      const { data } = await strapiClient.get(`/presentations/${id}?populate=${populate}`);
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error fetching presentation:', error);
      return { success: false, data: null, error };
    }
  },

  // Create presentation
  async create(presentationData: any) {
    try {
      const { data } = await strapiClient.post('/presentations', {
        data: presentationData
      });
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error creating presentation:', error);
      return { success: false, data: null, error };
    }
  },

  // Update presentation
  async update(id: string | number, presentationData: any) {
    try {
      const { data } = await strapiClient.put(`/presentations/${id}`, {
        data: presentationData
      });
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error updating presentation:', error);
      return { success: false, data: null, error };
    }
  },

  // Delete presentation
  async delete(id: string | number) {
    try {
      const { data } = await strapiClient.delete(`/presentations/${id}`);
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error deleting presentation:', error);
      return { success: false, error };
    }
  }
};

// Section API
export const sectionAPI = {
  // Get all sections
  async getAll(populate = '*') {
    try {
      const { data } = await strapiClient.get(`/sections?populate=${populate}`);
      return { success: true, data: data.data, meta: data.meta };
    } catch (error) {
      console.error('Error fetching sections:', error);
      return { success: false, data: [], error };
    }
  },

  // Get single section
  async getById(id: string | number, populate = '*') {
    try {
      const { data } = await strapiClient.get(`/sections/${id}?populate=${populate}`);
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error fetching section:', error);
      return { success: false, data: null, error };
    }
  },

  // Create section
  async create(sectionData: any) {
    try {
      const { data } = await strapiClient.post('/sections', {
        data: sectionData
      });
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error creating section:', error);
      return { success: false, data: null, error };
    }
  },

  // Update section
  async update(id: string | number, sectionData: any) {
    try {
      const { data } = await strapiClient.put(`/sections/${id}`, {
        data: sectionData
      });
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error updating section:', error);
      return { success: false, data: null, error };
    }
  },

  // Delete section
  async delete(id: string | number) {
    try {
      const { data } = await strapiClient.delete(`/sections/${id}`);
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error deleting section:', error);
      return { success: false, error };
    }
  }
};

// Screenshot API
export const screenshotAPI = {
  // Upload image
  async upload(file: File) {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const { data } = await strapiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      return { success: false, data: null, error };
    }
  },

  // Create screenshot entry
  async create(screenshotData: any) {
    try {
      const { data } = await strapiClient.post('/screenshots', {
        data: screenshotData
      });
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error creating screenshot:', error);
      return { success: false, data: null, error };
    }
  },

  // Delete screenshot
  async delete(id: string | number) {
    try {
      const { data } = await strapiClient.delete(`/screenshots/${id}`);
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      return { success: false, error };
    }
  }
};

// Helper to convert frontend presentation format to Strapi format
export function convertToStrapiFormat(presentation: any) {
  return {
    title: presentation.title,
    description: presentation.description,
    duration: presentation.duration,
    difficulty: presentation.difficulty,
    tags: presentation.tags,
    isTemplate: presentation.isTemplate,
    metadata: presentation.metadata,
    sections: presentation.sections?.map((section: any, index: number) => ({
      title: section.title,
      subtitle: section.subtitle,
      type: section.type,
      template: section.template,
      content: section.content,
      notes: section.notes,
      order: index,
      isReusable: section.isReusable
    }))
  };
}

// Helper to convert Strapi format to frontend format
export function convertFromStrapiFormat(presentation: Presentation) {
  return {
    id: presentation.id.toString(),
    title: presentation.attributes.title,
    description: presentation.attributes.description,
    duration: presentation.attributes.duration,
    difficulty: presentation.attributes.difficulty,
    tags: presentation.attributes.tags,
    isTemplate: presentation.attributes.isTemplate,
    metadata: presentation.attributes.metadata,
    sections: presentation.attributes.sections?.data?.map(section => ({
      id: section.id.toString(),
      title: section.attributes.title,
      subtitle: section.attributes.subtitle,
      type: section.attributes.type,
      template: section.attributes.template,
      content: section.attributes.content,
      notes: section.attributes.notes,
      order: section.attributes.order,
      isReusable: section.attributes.isReusable,
      screenshots: section.attributes.screenshots?.data?.map(screenshot => ({
        id: screenshot.id.toString(),
        title: screenshot.attributes.title,
        url: screenshot.attributes.image?.data?.attributes?.url,
        alt: screenshot.attributes.alt
      }))
    })) || [],
    author: presentation.attributes.author?.data?.attributes?.username,
    createdAt: presentation.attributes.createdAt,
    updatedAt: presentation.attributes.updatedAt,
    // Add computed fields for compatibility
    lastEdited: presentation.attributes.updatedAt,
    status: presentation.attributes.isTemplate ? 'template' : 'published',
    views: 0 // We'll implement view tracking later
  };
}