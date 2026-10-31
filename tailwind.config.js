/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F19',
          surface: '#111827',
          card: '#182234',
          border: '#1F293D',
          hover: '#24324D',
        },
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#818CF8',
          glow: 'rgba(99, 102, 241, 0.3)',
        },
        secondary: {
          DEFAULT: '#38BDF8',
          hover: '#0EA5E9',
          light: '#7DD3FC',
          glow: 'rgba(56, 189, 248, 0.3)',
        },
        text: {
          main: '#F8FAFC',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
        accent: {
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
          purple: '#A855F7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        arcade: ['"Press Start 2P"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 2s infinite',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'glow-primary': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-secondary': '0 0 25px -5px rgba(56, 189, 248, 0.4)',
      }
    },
  },
  plugins: [],
}
