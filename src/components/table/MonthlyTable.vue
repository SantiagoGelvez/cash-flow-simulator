<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'
import { formatCOP } from '@/composables/useCurrency'

const store = useScenarioStore()

const columns = [
  { key: 'mes', label: 'Mes' },
  { key: 'ingresoTotal', label: 'Ingreso' },
  { key: 'gastoFijo', label: 'Gasto fijo' },
  { key: 'aporteFondo', label: 'Aporte fondo' },
  { key: 'fondoAcumulado', label: 'Fondo acum.' },
  { key: 'pagoDeudas', label: 'Cuota deuda' },
  { key: 'abonoExtraTotal', label: 'Abono extra' },
  { key: 'eventos', label: 'Eventos' },
  { key: 'flujoNeto', label: 'Flujo neto' },
  { key: 'cajaFinal', label: 'Caja' },
  { key: 'deudaTotalFinal', label: 'Deuda total' },
] as const
</script>

<template>
  <div class="rounded-xl border border-surface-border bg-surface-raised shadow-card">
    <div class="flex items-center justify-between gap-2 border-b border-surface-border px-4 py-3">
      <h3 class="font-display text-base font-medium text-ink">Detalle mensual</h3>
      <button
        type="button"
        class="rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-cash hover:text-cash"
        @click="store.exportMonthlyCSV()"
      >
        Exportar CSV
      </button>
    </div>

    <div class="max-h-[28rem] overflow-auto">
      <table class="w-full min-w-[900px] border-collapse text-sm">
        <thead class="sticky top-0 z-10 bg-surface-raised">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="whitespace-nowrap border-b border-surface-border px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-ink-faint"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="mes in store.simulation.meses"
            :key="mes.mes"
            class="border-b border-surface-border/60 last:border-0 hover:bg-surface-sunken/40"
          >
            <td class="px-3 py-2 font-mono font-tabular text-ink-muted">{{ mes.mes }}</td>
            <td class="px-3 py-2 font-mono font-tabular text-ink">{{ formatCOP(mes.ingresoTotal) }}</td>
            <td class="px-3 py-2 font-mono font-tabular text-ink-muted">{{ formatCOP(mes.gastoFijo) }}</td>
            <td class="px-3 py-2 font-mono font-tabular text-ink-muted">{{ formatCOP(mes.aporteFondo) }}</td>
            <td class="px-3 py-2 font-mono font-tabular text-ink-muted">{{ formatCOP(mes.fondoAcumulado) }}</td>
            <td class="px-3 py-2 font-mono font-tabular text-debt">{{ formatCOP(mes.pagoDeudas) }}</td>
            <td class="px-3 py-2 font-mono font-tabular text-debt">{{ formatCOP(mes.abonoExtraTotal) }}</td>
            <td class="max-w-[220px] truncate px-3 py-2 text-ink-muted" :title="mes.eventos.map((e) => e.nombre).join(', ')">
              {{ mes.eventos.map((e) => e.nombre).join(', ') || '—' }}
            </td>
            <td
              class="px-3 py-2 font-mono font-tabular"
              :class="mes.flujoNeto < 0 ? 'text-alert' : 'text-cash'"
            >
              {{ formatCOP(mes.flujoNeto) }}
            </td>
            <td class="px-3 py-2 font-mono font-tabular" :class="mes.cajaFinal < 0 ? 'text-alert' : 'text-ink'">
              {{ formatCOP(mes.cajaFinal) }}
            </td>
            <td class="px-3 py-2 font-mono font-tabular text-debt">{{ formatCOP(mes.deudaTotalFinal) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
