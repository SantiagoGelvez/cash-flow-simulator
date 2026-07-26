import type { ChartOptions } from 'chart.js'
import { formatCOP } from '@/composables/useCurrency'

function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Reads a `--color-x` custom property (stored as an "r g b" triple) into an rgba() string. */
export function themeColor(name: string, alpha = 1): string {
  const triple = readCssVar(name) || '255 255 255'
  return `rgba(${triple.split(' ').join(', ')}, ${alpha})`
}

export const chartPalette = {
  cash: () => themeColor('--color-cash'),
  cashSoft: (alpha = 0.18) => themeColor('--color-cash', alpha),
  alert: () => themeColor('--color-alert'),
  alertSoft: (alpha = 0.18) => themeColor('--color-alert', alpha),
  debt: () => themeColor('--color-debt'),
  debtSoft: (alpha = 0.18) => themeColor('--color-debt', alpha),
  ink: () => themeColor('--color-ink'),
  inkMuted: () => themeColor('--color-ink-muted'),
  inkFaint: () => themeColor('--color-ink-faint'),
  border: () => themeColor('--color-surface-border'),
  raised: () => themeColor('--color-surface-raised'),
}

export function baseChartOptions(): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        grid: { color: chartPalette.border() },
        ticks: { color: chartPalette.inkFaint(), font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: chartPalette.border() },
        ticks: {
          color: chartPalette.inkFaint(),
          font: { family: '"IBM Plex Mono"', size: 11 },
          callback: (value) => formatCOP(Number(value)),
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: chartPalette.raised(),
        titleColor: chartPalette.ink(),
        bodyColor: chartPalette.inkMuted(),
        borderColor: chartPalette.border(),
        borderWidth: 1,
        padding: 10,
        titleFont: { family: 'Inter', weight: 600 },
        bodyFont: { family: '"IBM Plex Mono"' },
      },
    },
  }
}
