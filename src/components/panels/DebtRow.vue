<script setup lang="ts">
import { computed } from 'vue'
import type { Debt, DebtType } from '@/types/scenario'
import { PISO_MINIMO_DEFAULT } from '@/engine/debts'
import CurrencyInput from '@/components/shared/CurrencyInput.vue'
import NumberField from '@/components/shared/NumberField.vue'
import ConfirmDeleteButton from '@/components/shared/ConfirmDeleteButton.vue'
import Tooltip from '@/components/shared/Tooltip.vue'

const props = defineProps<{ debt: Debt }>()
const emit = defineEmits<{
  update: [patch: Partial<Omit<Debt, 'id'>>]
  remove: []
}>()

const tasaPct = computed({
  get: () => Math.round(props.debt.tasaEA * 10000) / 100,
  set: (v: number) => emit('update', { tasaEA: v / 100 }),
})
</script>

<template>
  <div class="rounded-lg border border-surface-border bg-surface-sunken/40 p-3">
    <div class="mb-3 flex items-center gap-2">
      <input
        type="text"
        class="min-w-0 flex-1 rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 text-sm text-ink focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
        :value="debt.nombre"
        placeholder="Nombre de la deuda"
        @input="(e) => emit('update', { nombre: (e.target as HTMLInputElement).value })"
      />
      <ConfirmDeleteButton @confirm="emit('remove')" />
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="mb-1 block text-[11px] text-ink-faint">Saldo inicial</label>
        <CurrencyInput :model-value="debt.saldoInicial" @update:model-value="(v) => emit('update', { saldoInicial: v })" />
      </div>
      <div>
        <div class="mb-1 flex items-center gap-1.5">
          <label class="text-[11px] text-ink-faint">Tasa EA (%)</label>
          <Tooltip
            text="La tasa efectiva anual (EA) es la que normalmente te informan los bancos. El motor la convierte internamente a una tasa mensual equivalente para calcular el interés de cada mes."
          />
        </div>
        <NumberField v-model="tasaPct" :min="0" :step="0.1" />
      </div>

      <div class="col-span-2">
        <div class="mb-1 flex items-center gap-1.5">
          <label class="text-[11px] text-ink-faint">Tipo de deuda</label>
          <Tooltip
            text="Cuota fija: pagas el mismo valor cada mes (ej. crédito de libre inversión). Revolvente: como una tarjeta de crédito, el pago mínimo es el mayor entre el 3% del saldo y un piso mínimo configurable."
          />
        </div>
        <select
          class="w-full rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 text-sm text-ink focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
          :value="debt.tipo"
          @change="emit('update', { tipo: ($event.target as HTMLSelectElement).value as DebtType })"
        >
          <option value="cuota_fija">Cuota fija</option>
          <option value="revolvente">Revolvente (tipo tarjeta de crédito)</option>
        </select>
      </div>

      <div v-if="debt.tipo === 'cuota_fija'" class="col-span-2">
        <label class="mb-1 block text-[11px] text-ink-faint">Cuota mensual</label>
        <CurrencyInput
          :model-value="debt.cuotaMensual ?? 0"
          @update:model-value="(v) => emit('update', { cuotaMensual: v })"
        />
      </div>
      <div v-else class="col-span-2">
        <label class="mb-1 block text-[11px] text-ink-faint">Piso mínimo de pago</label>
        <CurrencyInput
          :model-value="debt.pisoMinimo ?? PISO_MINIMO_DEFAULT"
          @update:model-value="(v) => emit('update', { pisoMinimo: v })"
        />
      </div>
    </div>
  </div>
</template>
