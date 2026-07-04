/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cinematic dark base
        abyss: {
          950: '#000000', // Pure black (page background)
          900: '#050505',
          800: '#0a0a0a', // Card base
          700: '#111111',
          600: '#161616', // Card border / raised surface
          500: '#1c1c1c',
          400: '#242424',
        },
        // Connexo accent — Pure Orange (CTA / conversion)
        connexo: {
          DEFAULT: '#ff6600',
          50: '#fff3ea',
          100: '#ffe0c7',
          200: '#ffbd85',
          300: '#ff9a44',
          400: '#ff7f1a',
          500: '#ff6600',
          600: '#e65a00',
          700: '#b34600',
          800: '#803200',
          900: '#4d1e00',
        },
      },
      fontFamily: {
        // Tomorrow SemiBold Italic — EXCLUSIVE for impact headlines
        heading: ['Tomorrow', 'system-ui', 'sans-serif'],
        // Space Grotesk — EXCLUSIVE for everything else
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,102,0,0.5), 0 0 40px -8px rgba(255,102,0,0.55)',
        'glow-lg': '0 0 0 1px rgba(255,102,0,0.6), 0 0 80px -10px rgba(255,102,0,0.65)',
        card: '0 20px 60px -20px rgba(0,0,0,0.9)',
      },
      backgroundImage: {
        'radial-fade':
          'radial-gradient(120% 120% at 50% 0%, rgba(255,102,0,0.10) 0%, rgba(0,0,0,0) 55%)',
        'grid-nodes':
          'radial-gradient(circle at 1px 1px, rgba(255,102,0,0.18) 1px, transparent 0)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.6s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
