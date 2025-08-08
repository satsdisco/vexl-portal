'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Plus, Minus, Edit2, AlertTriangle, ArrowLeft, GitMerge, Shield } from 'lucide-react';
import type { MergePreviewResponse, SectionSelection, BlockSelection, SectionPlan, BlockPlan, FieldChange } from '@/lib/merge-types';
import type { Presentation } from '@/lib/strapi-types';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface MergeViewerProps {
  mergeData: MergePreviewResponse;
  presentation: Presentation;
}

export default function MergeViewer({ mergeData, presentation }: MergeViewerProps) {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selections, setSelections] = useState<Map<string, SectionSelection>>(new Map());
  const [applying, setApplying] = useState(false);
  const { data } = mergeData;

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionKey = (plan: SectionPlan) => {
    return `${plan.forkSectionId || 'new'}-${plan.masterSectionId || 'del'}`;
  };

  const updateSectionSelection = (plan: SectionPlan, updates: Partial<SectionSelection>) => {
    const key = getSectionKey(plan);
    const current = selections.get(key) || {};
    const updated = { ...current, ...updates };
    
    // Copy relevant fields from plan
    if (plan.forkSectionId) updated.forkSectionId = plan.forkSectionId;
    if (plan.masterSectionId) updated.masterSectionId = plan.masterSectionId;
    if (plan.action) updated.action = plan.action;
    if (plan.masterSection) updated.masterSection = plan.masterSection;
    
    const newSelections = new Map(selections);
    newSelections.set(key, updated);
    setSelections(newSelections);
  };

  const updateFieldSelection = (plan: SectionPlan, field: string, accept: boolean) => {
    const key = getSectionKey(plan);
    const current = selections.get(key) || {};
    const fieldAccept = current.fieldAccept || {};
    fieldAccept[field as keyof typeof fieldAccept] = accept;
    
    updateSectionSelection(plan, { fieldAccept });
  };

  const updateBlockSelection = (plan: SectionPlan, blockIndex: number, blockPlan: BlockPlan, updates: Partial<BlockSelection>) => {
    const key = getSectionKey(plan);
    const current = selections.get(key) || {};
    const blocks = current.blocks || [];
    
    // Ensure array is large enough
    while (blocks.length <= blockIndex) {
      blocks.push({});
    }
    
    // Update the specific block
    blocks[blockIndex] = {
      ...blocks[blockIndex],
      ...updates,
      forkBlockIndex: blockPlan.forkBlockIndex,
      masterBlockIndex: blockPlan.masterBlockIndex,
      action: blockPlan.action,
      masterBlock: blockPlan.masterBlock,
    };
    
    updateSectionSelection(plan, { blocks });
  };

  const acceptAllSafe = () => {
    const newSelections = new Map<string, SectionSelection>();
    
    data.plan.forEach(plan => {
      if (plan.action === 'conflict') return; // Skip conflicts
      
      const key = getSectionKey(plan);
      const selection: SectionSelection = {
        forkSectionId: plan.forkSectionId,
        masterSectionId: plan.masterSectionId,
        action: plan.action,
        masterSection: plan.masterSection,
      };

      // Auto-accept adds and removes
      if (plan.action === 'add' || plan.action === 'remove') {
        selection.acceptSection = true;
      }

      // Auto-accept non-conflicting field changes
      if (plan.action === 'modify') {
        const fieldAccept: any = {};
        plan.fields.forEach(field => {
          if (field.status === 'apply') {
            fieldAccept[field.key] = true;
          }
        });
        if (Object.keys(fieldAccept).length > 0) {
          selection.fieldAccept = fieldAccept;
        }

        // Auto-accept non-conflicting block changes
        const blocks: BlockSelection[] = [];
        plan.blocks.forEach((blockPlan, index) => {
          if (blockPlan.action !== 'conflict') {
            const blockSelection: BlockSelection = {
              forkBlockIndex: blockPlan.forkBlockIndex,
              masterBlockIndex: blockPlan.masterBlockIndex,
              action: blockPlan.action,
              masterBlock: blockPlan.masterBlock,
              acceptBlock: blockPlan.action === 'add' || blockPlan.action === 'remove',
            };

            if (blockPlan.action === 'modify') {
              const blockFieldAccept: any = {};
              blockPlan.fields.forEach(field => {
                if (field.status === 'apply') {
                  blockFieldAccept[field.key] = true;
                }
              });
              if (Object.keys(blockFieldAccept).length > 0) {
                blockSelection.fieldAccept = blockFieldAccept;
              }
            }

            blocks[index] = blockSelection;
          }
        });
        if (blocks.length > 0) {
          selection.blocks = blocks;
        }
      }

      newSelections.set(key, selection);
    });

    setSelections(newSelections);
  };

  const applyMerge = async () => {
    if (selections.size === 0) {
      alert('No changes selected to apply');
      return;
    }

    setApplying(true);

    try {
      const selectionsArray = Array.from(selections.values());
      
      const response = await fetch(`/api/strapi-proxy/presentations/${presentation.id}/merge-apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selections: selectionsArray }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply merge');
      }

      const result = await response.json();
      
      // Show success message
      alert(`Merge applied successfully! ${result.data.appliedCounts.sectionsAdded} sections added, ${result.data.appliedCounts.sectionsModified} modified. Backup saved as ID: ${result.data.backupId}`);
      
      // Redirect to builder
      router.push(`/admin/builder?slug=${presentation.attributes.slug}`);
    } catch (error) {
      console.error('Merge apply error:', error);
      alert('Failed to apply merge. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const renderFieldChange = (field: FieldChange, plan: SectionPlan) => {
    const key = getSectionKey(plan);
    const selection = selections.get(key);
    const isAccepted = selection?.fieldAccept?.[field.key as keyof typeof selection.fieldAccept];

    return (
      <div key={field.key} className="border rounded p-3 mb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {field.status === 'conflict' ? (
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              ) : (
                <Edit2 className="w-4 h-4 text-blue-500" />
              )}
              <span className="font-medium capitalize">{field.key}</span>
              {field.status === 'conflict' && (
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Conflict</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Your Fork:</div>
                <div className="p-2 bg-gray-50 rounded text-xs font-mono overflow-x-auto">
                  {typeof field.forkValue === 'string' ? field.forkValue : JSON.stringify(field.forkValue, null, 2)}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Master:</div>
                <div className="p-2 bg-blue-50 rounded text-xs font-mono overflow-x-auto">
                  {typeof field.masterValue === 'string' ? field.masterValue : JSON.stringify(field.masterValue, null, 2)}
                </div>
              </div>
            </div>
          </div>
          
          {field.status === 'conflict' ? (
            <div className="ml-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`${key}-${field.key}`}
                  checked={isAccepted === false}
                  onChange={() => updateFieldSelection(plan, field.key, false)}
                  className="mr-2"
                />
                <span className="text-sm">Keep Fork</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`${key}-${field.key}`}
                  checked={isAccepted === true}
                  onChange={() => updateFieldSelection(plan, field.key, true)}
                  className="mr-2"
                />
                <span className="text-sm">Take Master</span>
              </label>
            </div>
          ) : field.status === 'apply' ? (
            <label className="ml-4 flex items-center">
              <input
                type="checkbox"
                checked={isAccepted === true}
                onChange={(e) => updateFieldSelection(plan, field.key, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Apply</span>
            </label>
          ) : null}
        </div>
      </div>
    );
  };

  const renderSectionPlan = (plan: SectionPlan) => {
    const key = getSectionKey(plan);
    const isExpanded = expandedSections.has(key);
    const selection = selections.get(key);
    
    const actionColors = {
      add: 'bg-green-50 border-green-200',
      remove: 'bg-red-50 border-red-200',
      modify: 'bg-blue-50 border-blue-200',
      conflict: 'bg-orange-50 border-orange-200',
      noop: 'bg-gray-50 border-gray-200',
    };

    const actionIcons = {
      add: <Plus className="w-4 h-4 text-green-600" />,
      remove: <Minus className="w-4 h-4 text-red-600" />,
      modify: <Edit2 className="w-4 h-4 text-blue-600" />,
      conflict: <AlertTriangle className="w-4 h-4 text-orange-600" />,
      noop: null,
    };

    if (plan.action === 'noop') return null;

    return (
      <div key={key} className={`${actionColors[plan.action]} border rounded-lg mb-3`}>
        <div 
          className="p-4 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => toggleSection(key)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {actionIcons[plan.action]}
              <div>
                <span className="font-medium">
                  {plan.action === 'add' && plan.masterSection?.title}
                  {plan.action === 'remove' && `Remove section at position ${plan.forkIndex ? plan.forkIndex + 1 : '?'}`}
                  {(plan.action === 'modify' || plan.action === 'conflict') && 
                    `Section ${plan.forkIndex !== undefined ? plan.forkIndex + 1 : '?'}`}
                </span>
                {plan.action === 'modify' && plan.fields.length > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    ({plan.fields.length} field changes, {plan.blocks.length} block changes)
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(plan.action === 'add' || plan.action === 'remove') && (
                <label className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selection?.acceptSection === true}
                    onChange={(e) => updateSectionSelection(plan, { acceptSection: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">
                    {plan.action === 'add' ? 'Add' : 'Remove'}
                  </span>
                </label>
              )}
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {isExpanded && (plan.action === 'modify' || plan.action === 'conflict') && (
          <div className="px-4 pb-4 border-t">
            {/* Field Changes */}
            {plan.fields.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Field Changes:</h4>
                {plan.fields.map(field => renderFieldChange(field, plan))}
              </div>
            )}

            {/* Block Changes */}
            {plan.blocks.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Block Changes:</h4>
                {plan.blocks.map((blockPlan, blockIndex) => (
                  <div key={blockIndex} className="bg-white rounded p-3 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {blockPlan.action === 'add' && <Plus className="w-3 h-3 text-green-600" />}
                        {blockPlan.action === 'remove' && <Minus className="w-3 h-3 text-red-600" />}
                        {blockPlan.action === 'modify' && <Edit2 className="w-3 h-3 text-blue-600" />}
                        <span className="text-sm">
                          {blockPlan.action === 'add' && `Add block at position ${(blockPlan.masterBlockIndex || 0) + 1}`}
                          {blockPlan.action === 'remove' && `Remove block at position ${(blockPlan.forkBlockIndex || 0) + 1}`}
                          {blockPlan.action === 'modify' && `Modify block at position ${(blockPlan.forkBlockIndex || 0) + 1}`}
                        </span>
                      </div>
                      {(blockPlan.action === 'add' || blockPlan.action === 'remove') && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selection?.blocks?.[blockIndex]?.acceptBlock === true}
                            onChange={(e) => updateBlockSelection(plan, blockIndex, blockPlan, { acceptBlock: e.target.checked })}
                            className="mr-2"
                          />
                          <span className="text-sm">Apply</span>
                        </label>
                      )}
                    </div>
                    
                    {blockPlan.action === 'modify' && blockPlan.fields.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {blockPlan.fields.map(field => (
                          <div key={field.key} className="text-xs">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selection?.blocks?.[blockIndex]?.fieldAccept?.[field.key as keyof NonNullable<typeof selection.blocks>[0]['fieldAccept']] === true}
                                onChange={(e) => {
                                  const current = selection?.blocks?.[blockIndex]?.fieldAccept || {};
                                  updateBlockSelection(plan, blockIndex, blockPlan, {
                                    fieldAccept: { ...current, [field.key]: e.target.checked }
                                  });
                                }}
                                className="mr-2"
                              />
                              <span>Update {field.key}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                href={`/admin/diff/${presentation.attributes.slug}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pull Updates from Master</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Review and apply changes from <span className="font-medium">{data.masterTitle}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{data.summary.sectionsAdded} To Add</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>{data.summary.sectionsRemoved} To Remove</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{data.summary.sectionsModified} To Modify</span>
              </div>
              {data.summary.conflicts > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>{data.summary.conflicts} Conflicts</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={acceptAllSafe}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Accept All Safe Changes
              </button>
              <span className="text-sm text-gray-500">
                (Skips conflicts)
              </span>
            </div>
            <button
              onClick={applyMerge}
              disabled={applying || selections.size === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GitMerge className="w-4 h-4" />
              {applying ? 'Applying...' : 'Apply Selected Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Update Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="text-sm text-blue-800">
            <div>Master last updated: {new Date(data.currentMasterUpdatedAt).toLocaleString()}</div>
            <div>Fork based on master from: {new Date(data.baseMasterUpdatedAt).toLocaleString()}</div>
          </div>
        </div>

        {/* No changes */}
        {data.plan.filter(p => p.action !== 'noop').length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No updates available from the master presentation.</p>
          </div>
        )}

        {/* Section Plans */}
        <div className="space-y-3">
          {data.plan.map(plan => renderSectionPlan(plan))}
        </div>
      </div>
    </div>
  );
}