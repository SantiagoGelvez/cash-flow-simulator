import type { Config } from 'tailwindcss'

function themeColor(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`
}

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: themeColor('--color-surface'),
          raised: themeColor('--color-surface-raised'),
          sunken: themeColor('--color-surface-sunken'),
          border: themeColor('--color-surface-border'),
        },
        ink: {
          DEFAULT: themeColor('--color-ink'),
          muted: themeColor('--color-ink-muted'),
          faint: themeColor('--color-ink-faint'),
        },
        cash: {
          DEFAULT: themeColor('--color-cash'),
          soft: themeColor('--color-cash-soft'),
        },
        alert: {
          DEFAULT: themeColor('--color-alert'),
          soft: themeColor('--color-alert-soft'),
        },
        debt: {
          DEFAULT: themeColor('--color-debt'),
          soft: themeColor('--color-debt-soft'),
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.15), 0 1px 3px 1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
} satisfies Config
