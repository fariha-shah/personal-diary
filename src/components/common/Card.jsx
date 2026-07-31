export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'p-5',
  style,
}) {
  return (
    <div
      style={style}
      className={`
        bg-navy-800 border border-navy-700 rounded-xl2 shadow-card
        ${padding}
        ${hoverable ? 'transition-all duration-300 hover:border-accent-blue/50 hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
