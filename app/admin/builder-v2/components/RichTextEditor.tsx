'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-yellow-400 underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[100px] px-3 py-2 bg-gray-700 rounded',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1 p-1 bg-gray-800 rounded">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition ${
            editor.isActive('bold') ? 'bg-yellow-400 text-black' : 'hover:bg-gray-700'
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition ${
            editor.isActive('italic') ? 'bg-yellow-400 text-black' : 'hover:bg-gray-700'
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <button
          onClick={addLink}
          className={`p-1.5 rounded transition ${
            editor.isActive('link') ? 'bg-yellow-400 text-black' : 'hover:bg-gray-700'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        
        <div className="w-px bg-gray-700 mx-1" />
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition ${
            editor.isActive('bulletList') ? 'bg-yellow-400 text-black' : 'hover:bg-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition ${
            editor.isActive('orderedList') ? 'bg-yellow-400 text-black' : 'hover:bg-gray-700'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
}