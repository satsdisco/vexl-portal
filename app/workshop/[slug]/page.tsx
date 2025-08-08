import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPresentationBySlug } from '@/lib/strapi-data';
import WorkshopViewer from './workshop-viewer';

interface PageProps {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const presentation = await getPresentationBySlug(params.slug);
  
  if (!presentation) {
    return {
      title: 'Workshop Not Found',
    };
  }

  return {
    title: presentation.attributes.title,
    description: presentation.attributes.description,
  };
}

// Server Component - fetches data
export default async function WorkshopPage({ params }: PageProps) {
  const presentation = await getPresentationBySlug(params.slug);

  if (!presentation) {
    notFound();
  }

  return <WorkshopViewer presentation={presentation} />;
}