import { useState, useEffect, useRef } from 'react';
import { FiTrash2, FiCheck } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

export default function Editor({ entry, onChange, onDelete }) {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [saved, setSaved] = useState(true);
  const debounceRef = useRef(null);

  // When the user switches to a DIFFERENT entry, resync local state to it.
  useEffect(() => {
    setTitle(entry.title);
    setContent(entry.content);
    setSaved(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id]);

  // Debounced autosave
  useEffect(() => {
    setSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ title, content });
      setSaved(true);
    }, 600);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <p className="text-text-muted text-xs">
          {format(parseISO(entry.date), 'MMMM d, yyyy')}
          <span className="mx-2">•</span>
          {saved ? (
            <span className="inline-flex items-center gap-1 text-accent-green">
              <FiCheck size={12} /> Saved
            </span>
          ) : (
            'Saving...'
          )}
        </p>
        <button
          onClick={onDelete}
          className="text-text-muted hover:text-accent-red transition-colors"
          title="Delete entry"
        >
          <FiTrash2 size={16} />
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="px-5 pb-2 text-xl font-semibold bg-transparent text-text-primary placeholder:text-text-muted outline-none"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 px-5 pb-5 bg-transparent text-text-primary text-sm leading-relaxed outline-none resize-none placeholder:text-text-muted"
      />
    </div>
  );
}
