<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import 'chartjs-plugin-annotation'
import type { AnnotationOptions } from 'chartjs-plugin-annotation'
import type { Milestone } from '@/types/simulation'
import type { MonthlyResult } from '@/types/simulation'
import { formatCOP } from '@/composables/useCurrency'
import { baseChartOptions, chartPalette } from './chartTheme'

const props = defineProps<{ meses: MonthlyResult[]; hitos: Milestone[] }>()

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.meses.map((m) => `Mes ${m.mes}`),
  datasets: [
    {
      label: 'Deuda total',
      data: props.meses.map((m) => m.deudaTotalFinal),
      borderColor: chartPalette.debt(),
      backgroundColor: chartPalette.debtSoft(),
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.25,
      fill: 'origin',
    },
  ],
}))

const milestoneAnnotations = computed<Record<string, AnnotationOptions>>(() => {
  const debtMilestones = props.hitos.filter((h) => h.tipo === 'deuda_pagada')
  const entries: [string, AnnotationOptions][] = []

  debtMilestones.forEach((h, index) => {
    const mesIndex = props.meses.findIndex((m) => m.mes === h.mes)
    const yValue = props.meses[mesIndex]?.deudaTotalFinal ?? 0

    entries.push([
      `milestone-point-${index}`,
      {
        type: 'point',
        xValue: mesIndex,
        yValue,
        backgroundColor: chartPalette.debt(),
        borderColor: chartPalette.raised(),
        borderWidth: 2,
        radius: 5,
      } satisfies AnnotationOptions,
    ])

    entries.push([
      `milestone-label-${index}`,
      {
        type: 'label',
        xValue: mesIndex,
        yValue,
        content: `${h.descripcion} ✓`,
        yAdjust: -18,
        backgroundColor: chartPalette.debt(),
        color: chartPalette.raised(),
        font: { size: 11, weight: 600 },
        padding: 4,
        borderRadius: 4,
      } satisfies AnnotationOptions,
    ])
  })

  return Object.fromEntries(entries)
})

const chartOptions = computed<ChartOptions<'line'>>(() => {
  const base = baseChartOptions()
  return {
    ...base,
    plugins: {
      ...base.plugins,
      tooltip: {
        ...base.plugins?.tooltip,
        callbacks: {
          label: (ctx) => `Deuda total: ${formatCOP(ctx.parsed.y ?? 0)}`,
        },
      },
      annotation: { annotations: milestoneAnnotations.value },
    },
  }
})
</script>

<template>
  <div class="rounded-xl border border-surface-border bg-surface-raised p-4 shadow-card">
    <h3 class="mb-3 font-display text-base font-medium text-ink">Deuda total pendiente</h3>
    <div class="h-72 w-full overflow-hidden">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
