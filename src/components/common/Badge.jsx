const tones = {
  green: 'bg-accent-green/15 text-accent-green',
  orange: 'bg-accent-orange/15 text-accent-orange',
  red: 'bg-accent-red/15 text-accent-red',
  blue: 'bg-accent-blue/15 text-accent-blue',
  purple: 'bg-accent-purple/15 text-accent-purple',
  gray: 'bg-navy-700 text-text-secondary',
};

export default function Badge({ children, tone = 'gray', icon: Icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone]}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
