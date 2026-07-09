/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#182625',
        'ink-light': '#22403D',
        parchment: '#F4ECD8',
        'parchment-dim': '#E8DCC0',
        brass: '#B8863B',
        'brass-light': '#D4A85C',
        burgundy: '#6B2737',
        charcoal: '#241C14',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body: ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
