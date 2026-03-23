/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D5016',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#B8860B',
          foreground: '#FFFFFF',
        },
        background: '#FAFAF7',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A1A',
        },
        muted: {
          DEFAULT: '#F5F5F0',
          foreground: '#6B6B5A',
        },
        border: '#E5E5DC',
        input: '#E5E5DC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        garamond: ['EB Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.08)',
        luxury: '0 8px 40px rgba(0,0,0,0.16)',
      },
      backgroundImage: {
        'gradient-card': 'linear-gradient(135deg, #F8F6F0 0%, #EFF5E8 100%)',
        'gradient-primary': 'linear-gradient(135deg, #2D5016 0%, #3D6B1E 100%)',
      },
    },
  },
  plugins: [],
}
