import { useState, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  type?: 'text' | 'date' | 'number';
  min?: number;
  step?: number;
}

export default function EditableField({
  value,
  onChange,
  className = '',
  multiline = false,
  placeholder = '—',
  type = 'text',
  min,
  step,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = typeof draft === 'string' ? draft.trim() : draft;
    if (trimmed !== value && trimmed !== '') onChange(trimmed);
    else if (trimmed === '' && value !== '') onChange(value); // revert empty
  };

  const inputClass = `${className} bg-transparent outline-none border-b-2 border-purple-400 focus:border-purple-600 w-full px-0`;

  if (editing) {
    if (multiline) {
      return (
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Escape') { setDraft(value); setEditing(false); }
          }}
          className={`${inputClass} resize-none`}
          autoFocus
          rows={2}
        />
      );
    }
    return (
      <input
        type={type}
        value={draft}
        min={min}
        step={step}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        }}
        className={inputClass}
        autoFocus
      />
    );
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      className={`${className} cursor-text group/edit relative`}
      title="Click to edit"
    >
      {value || <span className="opacity-40 italic text-sm">{placeholder}</span>}
      <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-current opacity-0 group-hover/edit:opacity-20 transition-opacity" />
    </span>
  );
}
