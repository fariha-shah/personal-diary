/**
 * Input.jsx
 * Used for: expense amount, description, qarza person name, diary title, etc.
 * Handles label, error message, optional left icon, and file/text/number types.
 */
export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
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
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
        )}
        <input
          className={`
            w-full bg-navy-900 border rounded-lg text-text-primary placeholder:text-text-muted
            px-3 py-2.5 text-sm outline-none transition-colors
            focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/40
            ${Icon ? 'pl-9' : ''}
            ${error ? 'border-accent-red' : 'border-navy-700'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-accent-red text-xs mt-1">{error}</p>}
    </div>
  );
}
