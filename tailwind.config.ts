import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.ts',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      /* ─── Surfaces & Borders (SDD Section 0.2) ─── */
      colors: {
        surface: {
          primary:   'hsl(0, 0%, 4%)',
          secondary: 'hsl(0, 0%, 8%)',
          elevated:  'hsl(0, 0%, 12%)',
          hover:     'hsl(0, 0%, 15%)',
        },
        border: {
          subtle:  'hsla(0, 0%, 100%, 0.08)',
          default: 'hsla(0, 0%, 100%, 0.12)',
          strong:  'hsla(0, 0%, 100%, 0.20)',
          accent:  'hsla(0, 0%, 100%, 0.40)',
        },
        text: {
          primary:   'hsl(0, 0%, 96%)',
          secondary: 'hsl(0, 0%, 60%)',
          muted:     'hsl(0, 0%, 38%)',
        },
        accent: {
          white: 'hsl(0, 0%, 100%)',
          glow:  'hsla(0, 0%, 100%, 0.06)',
        },
        status: {
          success: 'hsl(145, 60%, 45%)',
          warning: 'hsl(40, 85%, 55%)',
          error:   'hsl(0, 65%, 52%)',
        },
      },

      /* ─── Typography (SDD Section 0.3) ─── */
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans:    ['"Inter"', '-apple-system', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },

      /* ─── Spacing (SDD Section 0.4 — 4px base) ─── */
      spacing: {
        '4.5': '1.125rem',
        '18':  '4.5rem',
        '88':  '22rem',
      },

      /* ─── Border Radius (SDD Section 0.4) ─── */
      borderRadius: {
        sm:   '0.375rem',
        card: '0.75rem',
        pill: '9999px',
      },

      /* ─── Transitions (SDD Section 0.5) ─── */
      transitionTimingFunction: {
        smooth:  'cubic-bezier(0.16, 1, 0.3, 1)',
        spring:  'cubic-bezier(0.68, -0.15, 0.27, 1.15)',
      },
      transitionDuration: {
        fast:   '150ms',
        normal: '250ms',
        slow:   '400ms',
      },

      /* ─── Custom Animations ─── */
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'scanline': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'grid-pulse': {
          '0%, 100%': { opacity: '0.03' },
          '50%':      { opacity: '0.06' },
        },
        'orbit-spin': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-slide': {
          '0%':   { left: '-60px' },
          '100%': { left: '100%' },
        },
        'pulse-beat': {
          '0%, 100%': {
            background: 'hsla(0, 0%, 100%, 0.15)',
            transform: 'scale(1)',
          },
          '50%': {
            background: 'hsla(0, 0%, 100%, 0.7)',
            transform: 'scale(1.6)',
            boxShadow: '0 0 10px hsla(0, 0%, 100%, 0.3)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up':     'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':     'fade-in 0.4s ease both',
        'blink':       'blink 1s step-end infinite',
        'scanline':    'scanline 8s linear infinite',
        'grid-pulse':  'grid-pulse 4s ease-in-out infinite',
        'orbit-1':     'orbit-spin 0.6s cubic-bezier(0.68, -0.15, 0.27, 1.15) infinite',
        'orbit-2':     'orbit-spin 0.8s cubic-bezier(0.68, -0.15, 0.27, 1.15) infinite reverse',
        'orbit-3':     'orbit-spin 1s cubic-bezier(0.68, -0.15, 0.27, 1.15) infinite',
        'pulse-slide': 'pulse-slide 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-beat':  'pulse-beat 2s ease-in-out infinite',
        'float':       'float 3s ease-in-out infinite',
      },

      /* ─── Box Shadow ─── */
      boxShadow: {
        'glow-sm': '0 0 8px hsla(0, 0%, 100%, 0.04)',
        'glow':    '0 0 16px hsla(0, 0%, 100%, 0.06)',
        'glow-lg': '0 8px 32px hsla(0, 0%, 0%, 0.4)',
      },
    },
  },
  plugins: [],
} satisfies Config
