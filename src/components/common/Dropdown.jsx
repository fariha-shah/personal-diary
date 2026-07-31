import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  error,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`
            w-full flex items-center justify-between bg-navy-900 border rounded-lg
            px-3 py-2.5 text-sm text-left transition-colors
            focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/40
            ${error ? 'border-accent-red' : 'border-navy-700'}
            ${value ? 'text-text-primary' : 'text-text-muted'}
          `}
        >
          <span className="truncate">{value || placeholder}</span>
          <FiChevronDown
            size={16}
            className={`text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute z-20 mt-1.5 w-full max-h-56 overflow-y-auto bg-navy-800 border border-navy-700 rounded-lg shadow-card animate-[fadeIn_0.15s_ease-out]">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-text-primary hover:bg-navy-700 transition-colors text-left"
              >
                {opt}
                {value === opt && (
                  <FiCheck size={14} className="text-accent-blue" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-accent-red text-xs mt-1">{error}</p>}
    </div>
  );
}
