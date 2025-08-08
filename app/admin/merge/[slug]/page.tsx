import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserRole } from '@/lib/auth-helpers';
import MergeViewer from './merge-viewer';
import { getPresentationBySlug } from '@/lib/strapi-data';
import type { MergePreviewResponse } from '@/lib/merge-types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getMergePreview(presentationId: string, userId: string, userRole: string): Promise<MergePreviewResponse | null> {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const strapiToken = process.env.STRAPI_ADMIN_TOKEN;

  try {
    const response = await fetch(`${strapiUrl}/api/presentations/${presentationId}/merge-preview`, {
      headers: {
        'Authorization': `Bearer ${strapiToken}`,
        'x-user-id': userId,
        'x-role': userRole,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Merge preview fetch failed:', response.status, response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching merge preview:', error);
    return null;
  }
}

export default async function MergePage({ params }: PageProps) {
  const { slug } = await params;
  const user = await currentUser();
  
  if (!user) {
    notFound();
  }

  const userRole = await getUserRole();
  
  // Get the fork presentation by slug
  const presentation = await getPresentationBySlug(slug);
  
  if (!presentation) {
    notFound();
  }

  // Check if this is a fork
  if (!presentation.attributes.forkOf?.data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Not a Fork</h1>
            <p className="text-gray-600">This presentation is not a fork and cannot pull updates from a master.</p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch the merge preview
  const mergeData = await getMergePreview(presentation.id.toString(), user.id, userRole || 'viewer');

  if (!mergeData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Merge Preview</h1>
            <p className="text-gray-600">Could not load the merge preview for this presentation. You may not have permission to view it.</p>
          </div>
        </div>
      </div>
    );
  }

  return <MergeViewer mergeData={mergeData} presentation={presentation} />;
}