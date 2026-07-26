<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import type { MonthlyResult } from '@/types/simulation'
import { formatCOP } from '@/composables/useCurrency'
import { baseChartOptions, chartPalette } from './chartTheme'

const props = defineProps<{ meses: MonthlyResult[] }>()

const chartData = computed<ChartData<'line'>>(() => {
  const cash = chartPalette.cash()
  const alert = chartPalette.alert()

  return {
    labels: props.meses.map((m) => `Mes ${m.mes}`),
    datasets: [
      {
        label: 'Caja disponible',
        data: props.meses.map((m) => m.cajaFinal),
        borderWidth: 2,
        pointRadius: (ctx) => (props.meses[ctx.dataIndex]?.eventos.length ? 4 : 0),
        pointBackgroundColor: chartPalette.raised(),
        pointBorderColor: cash,
        pointBorderWidth: 2,
        tension: 0.25,
        fill: { target: 'origin', above: chartPalette.cashSoft(), below: chartPalette.alertSoft() },
        segment: {
          borderColor: (ctx) =>
            ((ctx.p0.parsed.y ?? 0) < 0 || (ctx.p1.parsed.y ?? 0) < 0) ? alert : cash,
        },
      },
    ],
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => {
  const base = baseChartOptions()
  return {
    ...base,
    scales: {
      ...base.scales,
      y: {
        ...base.scales?.y,
        grid: {
          ...(base.scales?.y as { grid?: object })?.grid,
          color: (ctx) => (ctx.tick.value === 0 ? chartPalette.inkFaint() : chartPalette.border()),
        },
      },
    },
    plugins: {
      ...base.plugins,
      tooltip: {
        ...base.plugins?.tooltip,
        callbacks: {
          label: (ctx) => `Caja: ${formatCOP(ctx.parsed.y ?? 0)}`,
          afterBody: (items) => {
            const mes = props.meses[items[0]?.dataIndex ?? -1]
            if (!mes || mes.eventos.length === 0) return []
            return ['', ...mes.eventos.map((e) => `• ${e.nombre} (${formatCOP(e.monto)})`)]
          },
        },
      },
    },
  }
})
</script>

<template>
  <div class="rounded-xl border border-surface-border bg-surface-raised p-4 shadow-card">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="font-display text-base font-medium text-ink">Caja disponible mes a mes</h3>
      <div class="flex items-center gap-3 text-xs text-ink-faint">
        <span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-cash" />Positiva</span>
        <span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-alert" />Negativa</span>
      </div>
    </div>
    <div class="h-72 w-full overflow-hidden">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
