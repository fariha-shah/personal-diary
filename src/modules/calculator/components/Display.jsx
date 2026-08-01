export default function Display({ expression, value }) {
  return (
    <div className="relative bg-navy-900 border border-navy-700 rounded-xl px-5 py-5 mb-4 text-right overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/5 rounded-full blur-2xl pointer-events-none" />

      <p className="relative text-text-muted text-xs h-5 truncate">
        {expression || '\u00A0'}
      </p>

      <p className="relative text-text-primary text-3xl sm:text-4xl font-semibold mt-1 truncate tracking-tight">
        {value}
      </p>
    </div>
  );
}
