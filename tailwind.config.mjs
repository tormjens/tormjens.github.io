import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#101116',
        'surface-2': '#14161c',
        elevated: '#1a1d24',
        border: {
          DEFAULT: '#1a1d24',
          strong: '#2e323d',
        },
        fg: {
          DEFAULT: '#e2e5ec',
          muted: '#b8bdc9',
          dim: '#8b91a2',
          faint: '#5a6072',
        },
        accent: {
          DEFAULT: '#aaff00',
          dark: '#88cc00',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', '"SF Mono"', '"Fira Code"', 'Menlo', 'monospace'],
        sans: ['"JetBrains Mono"', 'ui-monospace', '"SF Mono"', '"Fira Code"', 'Menlo', 'monospace'],
      },
      transitionDuration: {
        '120': '120ms',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#b8bdc9',
            '--tw-prose-headings': '#e2e5ec',
            '--tw-prose-lead': '#b8bdc9',
            '--tw-prose-links': '#aaff00',
            '--tw-prose-bold': '#e2e5ec',
            '--tw-prose-counters': '#8b91a2',
            '--tw-prose-bullets': '#5a6072',
            '--tw-prose-hr': '#1a1d24',
            '--tw-prose-quotes': '#b8bdc9',
            '--tw-prose-quote-borders': '#aaff00',
            '--tw-prose-captions': '#8b91a2',
            '--tw-prose-code': '#aaff00',
            '--tw-prose-pre-code': '#e2e5ec',
            '--tw-prose-pre-bg': '#101116',
            '--tw-prose-th-borders': '#2e323d',
            '--tw-prose-td-borders': '#1a1d24',
            fontFamily: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
            maxWidth: 'none',
            'a': { textDecorationThickness: '1px', textUnderlineOffset: '3px' },
            'a:hover': { color: '#88cc00' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            'code': {
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              borderRadius: '4px',
              padding: '2px 6px',
              background: '#101116',
              border: '1px solid #1a1d24',
              fontWeight: '400',
            },
            'pre': {
              border: '1px solid #1a1d24',
              borderRadius: '8px',
            },
            'pre code': {
              background: 'transparent',
              border: 'none',
              padding: '0',
            },
            'blockquote': {
              fontStyle: 'normal',
              borderLeftWidth: '2px',
            },
            'h1, h2, h3, h4': {
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontWeight: '500',
              letterSpacing: '-0.03em',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
