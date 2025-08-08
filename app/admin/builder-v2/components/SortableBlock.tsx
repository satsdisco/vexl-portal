'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Trash2, Type, Quote, Smartphone, Target, Columns } from 'lucide-react';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import BlockEditor from './BlockEditor';

const blockIcons: Record<string, any> = {
  'rich-text': Type,
  'quote': Quote,
  'device-mockup': Smartphone,
  'call-to-action': Target,
  'comparison': Columns,
};

interface SortableBlockProps {
  id: string;
  block: any;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function SortableBlock({
  id,
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
}: SortableBlockProps) {
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

  const Icon = blockIcons[block.type] || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group rounded-lg transition-all
        ${isSelected 
          ? 'ring-2 ring-yellow-400 bg-gray-800' 
          : 'bg-gray-800 hover:bg-gray-700'
        }
      `}
    >
      <div className="flex items-center gap-2 p-3 border-b border-gray-700">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 opacity-50" />
        </div>
        
        <Icon className="w-4 h-4 opacity-70" />
        
        <span className="flex-1 text-sm font-medium capitalize">
          {block.type.replace('-', ' ')}
        </span>
        
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="p-3" onClick={onSelect}>
        <BlockEditor
          block={block}
          onUpdate={onUpdate}
          isCompact={!isSelected}
        />
      </div>
    </div>
  );
}