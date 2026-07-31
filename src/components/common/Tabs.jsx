export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="inline-flex bg-navy-900 border border-navy-700 rounded-lg p-1 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
            transition-all duration-200
            ${
              active === tab.value
                ? 'bg-accent-blue text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-navy-700'
            }
          `}
        >
          {tab.icon && <tab.icon size={16} />}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                active === tab.value ? 'bg-white/20' : 'bg-navy-700'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
