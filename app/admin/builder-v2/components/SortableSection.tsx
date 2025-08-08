'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Trash2 } from 'lucide-react';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface SortableSectionProps {
  id: string;
  section: any;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function SortableSection({
  id,
  section,
  index,
  isActive,
  onSelect,
  onDuplicate,
  onDelete,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative rounded-lg p-3 cursor-pointer transition-all
        ${isActive 
          ? 'bg-yellow-400 text-black' 
          : 'bg-gray-800 hover:bg-gray-700 text-white'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 opacity-50" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">
            Section {index + 1}
          </div>
          {section.title && (
            <div className="text-xs opacity-70 truncate">
              {section.title}
            </div>
          )}
          <div className="text-xs opacity-50 mt-1">
            {section.content.length} block{section.content.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 hover:bg-gray-600 rounded"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-600 rounded"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}