'use client';

import { useState, useEffect } from 'react';
import { presentationAPI, convertFromStrapiFormat } from '@/lib/strapi-service';

export default function TestStrapi() {
  const [status, setStatus] = useState<any>({
    loading: true,
    strapiConnected: false,
    presentationsCount: 0,
    error: null,
    presentations: []
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test fetching presentations
      const result = await presentationAPI.getAll('*');
      
      if (result.success) {
        const formatted = result.data.map(convertFromStrapiFormat);
        setStatus({
          loading: false,
          strapiConnected: true,
          presentationsCount: result.data.length,
          error: null,
          presentations: formatted
        });
      } else {
        setStatus({
          loading: false,
          strapiConnected: false,
          presentationsCount: 0,
          error: 'Failed to fetch presentations',
          presentations: []
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        strapiConnected: false,
        presentationsCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        presentations: []
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">Strapi Connection Test</h1>
      
      <div className="space-y-4 max-w-2xl">
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Connection Status</h2>
          <p className={status.strapiConnected ? 'text-green-400' : 'text-red-400'}>
            {status.loading ? 'Testing...' : status.strapiConnected ? '✅ Connected' : '❌ Not Connected'}
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Strapi URL</h2>
          <p className="text-gray-400">{process.env.NEXT_PUBLIC_STRAPI_URL || 'Not configured'}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Presentations Found</h2>
          <p className="text-gray-400">{status.presentationsCount}</p>
        </div>

        {status.error && (
          <div className="bg-red-900/50 p-4 rounded-lg border border-red-600">
            <h2 className="font-bold mb-2">Error</h2>
            <p className="text-red-400">{status.error}</p>
          </div>
        )}

        {status.presentations.length > 0 && (
          <div className="bg-gray-900 p-4 rounded-lg">
            <h2 className="font-bold mb-2">Presentations</h2>
            <ul className="space-y-2 mt-3">
              {status.presentations.map((p: any) => (
                <li key={p.id} className="border-l-2 border-yellow-400 pl-3">
                  <div className="font-bold">{p.title}</div>
                  <div className="text-sm text-gray-400">
                    ID: {p.id} | Sections: {p.sections?.length || 0} | Template: {p.isTemplate ? 'Yes' : 'No'}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500"
          >
            Retry Test
          </button>
          
          <a
            href="/workshop"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Go to Workshops
          </a>
          
          <a
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}