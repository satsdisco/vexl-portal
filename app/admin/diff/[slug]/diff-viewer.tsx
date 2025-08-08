'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Plus, Minus, Edit2, ArrowLeft } from 'lucide-react';
import type { DiffResponse, ModifiedSection, SectionDiff, ModifiedBlock } from '@/lib/diff-types';
import type { Presentation } from '@/lib/strapi-types';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface DiffViewerProps {
  diffData: DiffResponse;
  presentation: Presentation;
}

export default function DiffViewer({ diffData, presentation }: DiffViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const { data } = diffData;

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderSectionDiff = (section: SectionDiff, type: 'added' | 'removed') => {
    const bgColor = type === 'added' ? 'bg-green-50' : 'bg-red-50';
    const borderColor = type === 'added' ? 'border-green-200' : 'border-red-200';
    const textColor = type === 'added' ? 'text-green-700' : 'text-red-700';
    const icon = type === 'added' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />;

    return (
      <div key={section.id} className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-2`}>
        <div className="flex items-center gap-2">
          <span className={textColor}>{icon}</span>
          <span className="font-medium">{section.title}</span>
          <span className="text-sm text-gray-500">
            {type === 'added' ? 'Added' : 'Removed'} • Order: {section.order}
          </span>
        </div>
      </div>
    );
  };

  const renderModifiedSection = (section: ModifiedSection) => {
    const sectionKey = `modified-${section.forkSectionId}`;
    const isExpanded = expandedSections.has(sectionKey);

    return (
      <div key={section.forkSectionId} className="bg-blue-50 border border-blue-200 rounded-lg mb-2">
        <div 
          className="p-4 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-blue-700" />
              <span className="font-medium">
                {section.forkTitle || 'Untitled Section'}
              </span>
              {section.forkTitle !== section.masterTitle && (
                <span className="text-sm text-gray-500">
                  (was: {section.masterTitle})
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-700">
                {section.fieldsChanged.length} field{section.fieldsChanged.length !== 1 ? 's' : ''} changed
              </span>
              {(section.blocks.added.length > 0 || section.blocks.removed.length > 0 || section.blocks.modified.length > 0) && (
                <span className="text-sm text-blue-700">
                  {section.blocks.added.length + section.blocks.removed.length + section.blocks.modified.length} block changes
                </span>
              )}
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-blue-200">
            {/* Field Changes */}
            {section.fieldsChanged.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Field Changes:</h4>
                <div className="space-y-1">
                  {section.fieldsChanged.map(field => (
                    <div key={field} className="text-sm text-gray-600">
                      • {field} was modified
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Block Changes */}
            {(section.blocks.added.length > 0 || section.blocks.removed.length > 0 || section.blocks.modified.length > 0) && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Block Changes:</h4>
                
                {section.blocks.added.map(block => (
                  <div key={`added-${block.index}`} className="flex items-center gap-2 text-sm text-green-700 mb-1">
                    <Plus className="w-3 h-3" />
                    <span>Added {block.type} block at position {block.order + 1}</span>
                  </div>
                ))}

                {section.blocks.removed.map(block => (
                  <div key={`removed-${block.index}`} className="flex items-center gap-2 text-sm text-red-700 mb-1">
                    <Minus className="w-3 h-3" />
                    <span>Removed {block.type} block at position {block.order + 1}</span>
                  </div>
                ))}

                {section.blocks.modified.map(block => renderModifiedBlock(block))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderModifiedBlock = (block: ModifiedBlock) => {
    return (
      <div key={`modified-${block.forkBlockIndex}`} className="bg-white rounded p-2 mb-2">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Edit2 className="w-3 h-3" />
          <span>Modified {block.type} block at position {block.order + 1}</span>
        </div>
        {block.fieldsChanged.length > 0 && (
          <div className="text-xs text-gray-600 mt-1 ml-5">
            Changed: {block.fieldsChanged.join(', ')}
          </div>
        )}
        {block.payloadDiff && (
          <div className="text-xs mt-2 ml-5">
            <details className="cursor-pointer">
              <summary className="text-gray-600 hover:text-gray-800">View changes</summary>
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <div className="mb-2">
                  <span className="font-semibold">Before:</span>
                  <pre className="whitespace-pre-wrap mt-1">
                    {JSON.stringify(block.payloadDiff.before, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="font-semibold">After:</span>
                  <pre className="whitespace-pre-wrap mt-1">
                    {JSON.stringify(block.payloadDiff.after, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/admin/builder?slug=${presentation.attributes.slug}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Diff View</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Comparing: <span className="font-medium">{data.forkTitle}</span> 
                  {' '}vs{' '}
                  <span className="font-medium">{data.masterTitle}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{data.summary.sectionsAdded} Added</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>{data.summary.sectionsRemoved} Removed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{data.summary.sectionsModified} Modified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* No changes */}
        {data.summary.sectionsAdded === 0 && 
         data.summary.sectionsRemoved === 0 && 
         data.summary.sectionsModified === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No differences found between the fork and master.</p>
          </div>
        )}

        {/* Added Sections */}
        {data.sections.added.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Added Sections ({data.sections.added.length})
            </h2>
            <div className="space-y-2">
              {data.sections.added.map(section => renderSectionDiff(section, 'added'))}
            </div>
          </div>
        )}

        {/* Removed Sections */}
        {data.sections.removed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Removed Sections ({data.sections.removed.length})
            </h2>
            <div className="space-y-2">
              {data.sections.removed.map(section => renderSectionDiff(section, 'removed'))}
            </div>
          </div>
        )}

        {/* Modified Sections */}
        {data.sections.modified.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Modified Sections ({data.sections.modified.length})
            </h2>
            <div className="space-y-2">
              {data.sections.modified.map(section => renderModifiedSection(section))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}