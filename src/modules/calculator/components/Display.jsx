export default function Display({ expression, value }) {
  return (
    <div className="bg-navy-900 rounded-xl2 px-5 py-6 mb-4 text-right overflow-hidden">
      <p className="text-text-muted text-sm h-5 truncate">
        {expression || '\u00A0'}
      </p>
      <p className="text-text-primary text-4xl font-semibold mt-1 truncate">
        {value}
      </p>
    </div>
  );
}
