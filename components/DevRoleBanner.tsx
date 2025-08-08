'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Shield, Settings } from 'lucide-react';
import { vexlBrand } from '@/lib/vexl-brand-manual';

export default function DevRoleBanner() {
  const { user } = useUser();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !user) {
    return null;
  }

  const role = (user.publicMetadata?.role as string) || 'viewer';
  
  const roleColors = {
    viewer: 'bg-gray-800 text-gray-300',
    ambassador: 'bg-blue-900 text-blue-300',
    manager: 'bg-purple-900 text-purple-300',
    admin: 'bg-red-900 text-red-300',
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg ${roleColors[role as keyof typeof roleColors] || roleColors.viewer}`}>
        <Shield size={16} />
        <div className="text-sm">
          <div className="font-medium">Dev Mode</div>
          <div className="text-xs opacity-80">Role: {role}</div>
        </div>
        <Link
          href="https://dashboard.clerk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 hover:bg-white/10 rounded transition"
          title="Manage in Clerk Dashboard"
        >
          <Settings size={14} />
        </Link>
      </div>
    </div>
  );
}