<script setup lang="ts">
import { computed } from 'vue'
import { useScenarioStore } from '@/stores/scenario'
import { formatCOP } from '@/composables/useCurrency'
import StatCard from './StatCard.vue'

const store = useScenarioStore()

const resumen = computed(() => store.resumen)

const puntoAjustado = computed(() => ({
  value: formatCOP(resumen.value.cajaMinima),
  hint: `Mes ${resumen.value.mesTensionMinima}`,
  tone: (resumen.value.cajaMinima < 0 ? 'alert' : 'cash') as 'alert' | 'cash',
}))

const deudaFinal = computed(() => formatCOP(resumen.value.deudaTotalFinal))

const patrimonio = computed(() => ({
  value: formatCOP(resumen.value.patrimonioNetoFinal),
  tone: (resumen.value.patrimonioNetoFinal < 0 ? 'alert' : 'cash') as 'alert' | 'cash',
}))

const hito = computed(() => {
  if (store.scenario.debts.length === 0) {
    return { value: 'Sin deudas', hint: 'No hay deudas registradas' }
  }
  if (resumen.value.mesLibreDeDeuda !== null) {
    return { value: `Mes ${resumen.value.mesLibreDeDeuda}`, hint: 'Libre de deudas' }
  }
  return { value: 'No alcanza', hint: 'dentro del periodo simulado' }
})
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      label="Punto más ajustado de caja"
      :value="puntoAjustado.value"
      :hint="puntoAjustado.hint"
      :tone="puntoAjustado.tone"
    />
    <StatCard label="Deuda total al final" :value="deudaFinal" tone="debt" />
    <StatCard
      label="Patrimonio neto final"
      :value="patrimonio.value"
      hint="Caja − deuda"
      :tone="patrimonio.tone"
    />
    <StatCard label="Libre de deudas" :value="hito.value" :hint="hito.hint" tone="neutral" />
  </div>
</template>
