// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1120', // Sidebar background (darkest)
          900: '#111827', // Main page background
          800: '#1E293B', // Card backgrounds
          700: '#334155', // Borders, dividers
        },
        accent: {
          blue: '#3B82F6', // Primary actions, active states
          teal: '#14B8A6', // Secondary accent (personal spend split)
          orange: '#F59E0B', // Warnings, pending status
          green: '#10B981', // Success, income, paid status
          red: '#EF4444', // Expenses, negative, delete
          purple: '#8B5CF6', // Deals/misc category
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
};
