import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserRole } from '@/lib/auth-helpers';
import DiffViewer from './diff-viewer';
import { getPresentationBySlug } from '@/lib/strapi-data';
import type { DiffResponse } from '@/lib/diff-types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getDiff(presentationId: string, userId: string, userRole: string): Promise<DiffResponse | null> {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const strapiToken = process.env.STRAPI_ADMIN_TOKEN;

  try {
    const response = await fetch(`${strapiUrl}/api/presentations/${presentationId}/diff`, {
      headers: {
        'Authorization': `Bearer ${strapiToken}`,
        'x-user-id': userId,
        'x-role': userRole,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Diff fetch failed:', response.status, response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching diff:', error);
    return null;
  }
}

export default async function DiffPage({ params }: PageProps) {
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
            <p className="text-gray-600">This presentation is not a fork and has no master to compare against.</p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch the diff
  const diffData = await getDiff(presentation.id.toString(), user.id, userRole || 'viewer');

  if (!diffData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Diff</h1>
            <p className="text-gray-600">Could not load the diff for this presentation. You may not have permission to view it.</p>
          </div>
        </div>
      </div>
    );
  }

  return <DiffViewer diffData={diffData} presentation={presentation} />;
}