'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { GitFork, Loader2 } from 'lucide-react';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface ForkButtonProps {
  presentationId: number;
  presentationTitle: string;
  userRole?: string;
}

export default function ForkButton({ presentationId, presentationTitle, userRole }: ForkButtonProps) {
  const [isForking, setIsForking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  // Only show for ambassadors and above
  if (!user || !userRole || userRole === 'viewer') {
    return null;
  }

  const handleFork = async () => {
    setIsForking(true);
    setError(null);

    try {
      const response = await fetch(`/api/strapi-proxy/presentations/${presentationId}/fork`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fork presentation');
      }

      const result = await response.json();
      
      // Show success message
      const newSlug = result.data.slug;
      
      // Redirect to builder with new presentation
      router.push(`/admin/builder?slug=${newSlug}&forked=true`);
    } catch (err) {
      console.error('Fork error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fork presentation');
    } finally {
      setIsForking(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleFork}
        disabled={isForking}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: isForking ? vexlBrand.colors.gray[700] : vexlBrand.colors.primary.yellow,
          color: vexlBrand.colors.primary.black,
        }}
      >
        {isForking ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Forking...
          </>
        ) : (
          <>
            <GitFork size={18} />
            Fork This Deck
          </>
        )}
      </button>
      
      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}