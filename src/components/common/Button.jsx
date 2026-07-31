const variants = {
  primary:
    'bg-accent-blue text-white hover:bg-blue-600 shadow-md shadow-accent-blue/20',
  secondary:
    'bg-navy-700 text-text-primary hover:bg-navy-700/70 border border-navy-700',
  danger:
    'bg-accent-red/10 text-accent-red hover:bg-accent-red hover:text-white border border-accent-red/30',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-navy-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} />}
    </button>
  );
}
