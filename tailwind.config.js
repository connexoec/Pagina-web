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
        // Cinta infinita — translate3d puro, se resuelve en GPU.
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-100%,0,0)' },
        },

        // ── Glitch del logo (ver §9 del CLAUDE.md) ────────────────────────
        // Dos capas complementarias sobre el MISMO ciclo de 12s: la palabra
        // "CONNEXO" y la misma palabra en yautja. Con `step-end` cada cambio
        // es un corte seco, no un fundido — es lo que lo hace glitch y no
        // crossfade. En los tramos donde las dos valen 1 se ven encimadas
        // (frame sucio) y donde las dos valen 0 queda un parpadeo en negro.
        // Reparto: ~7.2s Connexo · ~3.9s yautja · el resto son los tirones.
        'glitch-word': {
          '0%, 52%': { opacity: '1' },
          '52.5%': { opacity: '0' },
          '53.5%': { opacity: '1' },
          '54%': { opacity: '0' },
          '55%': { opacity: '1' },
          '55.5%, 88%': { opacity: '0' },
          '88.5%': { opacity: '1' },
          '89%': { opacity: '0' },
          '90%': { opacity: '1' },
          '90.5%': { opacity: '0' },
          '91.5%, 100%': { opacity: '1' },
        },
        'glitch-yautja': {
          '0%, 52%': { opacity: '0', transform: 'translate3d(0,0,0)' },
          '52.5%': { opacity: '1', transform: 'translate3d(-2.5%,0,0)' },
          '53.5%': { opacity: '1', transform: 'translate3d(1.5%,0,0)' },
          '54%': { opacity: '0', transform: 'translate3d(0,0,0)' },
          '55%, 88%': { opacity: '1', transform: 'translate3d(0,0,0)' },
          '88.5%': { opacity: '0', transform: 'translate3d(2%,0,0)' },
          '89%': { opacity: '1', transform: 'translate3d(-1.5%,0,0)' },
          '90%': { opacity: '0', transform: 'translate3d(0,0,0)' },
          '90.5%': { opacity: '1', transform: 'translate3d(1%,0,0)' },
          '91%, 100%': { opacity: '0', transform: 'translate3d(0,0,0)' },
        },

        // ── Faro NFC del Hero (fx/NfcBeacon.tsx) ───────────────────────────
        // GPU-safe: solo `opacity` y `transform`. Muy tenue a propósito (no debe
        // pelear con el título). El frame 100% es un estado estático decente:
        // con prefers-reduced-motion el navegador aterriza ahí (glifo quieto y
        // tenue, ondas invisibles). Mismo criterio que el glitch del logo (§9).

        // Parpadeo del icono NFC. Reposo (0%/100%) = tenue visible.
        'nfc-beacon': {
          '0%, 100%': { opacity: '0.22' },
          '50%': { opacity: '0.07' },
        },
        // Onda que emana del centro y se apaga. 100% opacity 0 (invisible en
        // reduced-motion, queda solo el glifo).
        'nfc-wave': {
          '0%': { transform: 'scale(0.35)', opacity: '0' },
          '12%': { opacity: '0.16' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.6s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        // `step-end`: cortes secos entre keyframes. Las dos comparten duración
        // y arrancan juntas (se montan en el mismo paint), así que no se
        // desfasan nunca.
        'glitch-word': 'glitch-word 12s step-end infinite',
        'glitch-yautja': 'glitch-yautja 12s step-end infinite',
        // Escena del horizonte terrestre (el delay por-elemento va inline).
        'nfc-beacon': 'nfc-beacon 3.4s ease-in-out infinite',
        'nfc-wave': 'nfc-wave 4.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}
