import { FiCalendar } from 'react-icons/fi';

export default function DatePicker({
  label,
  value,
  onChange,
  error,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <FiCalendar
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="date"
          value={value}
          onChange={onChange}
          className={`
            w-full bg-navy-900 border rounded-lg text-text-primary
            pl-9 pr-3 py-2.5 text-sm outline-none transition-colors
            focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/40
            [color-scheme:light]
            ${error ? 'border-accent-red' : 'border-navy-700'}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-accent-red text-xs mt-1">{error}</p>}
    </div>
  );
}
