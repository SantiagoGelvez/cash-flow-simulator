<script setup lang="ts">
import type { PlannedEvent, PlannedEventType } from '@/types/scenario'
import CurrencyInput from '@/components/shared/CurrencyInput.vue'
import NumberField from '@/components/shared/NumberField.vue'
import ConfirmDeleteButton from '@/components/shared/ConfirmDeleteButton.vue'
import Tooltip from '@/components/shared/Tooltip.vue'

defineProps<{ event: PlannedEvent }>()
const emit = defineEmits<{
  update: [patch: Partial<Omit<PlannedEvent, 'id'>>]
  remove: []
}>()
</script>

<template>
  <div class="rounded-lg border border-surface-border bg-surface-sunken/40 p-3">
    <div class="mb-3 flex items-center gap-2">
      <input
        type="text"
        class="min-w-0 flex-1 rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 text-sm text-ink focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
        :value="event.nombre"
        placeholder="Ej. moto, viaje, venta del carro"
        @input="(e) => emit('update', { nombre: (e.target as HTMLInputElement).value })"
      />
      <ConfirmDeleteButton @confirm="emit('remove')" />
    </div>

    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <div>
        <label class="mb-1 block text-[11px] text-ink-faint">Tipo</label>
        <select
          class="w-full rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 text-sm text-ink focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
          :value="event.tipo"
          @change="emit('update', { tipo: ($event.target as HTMLSelectElement).value as PlannedEventType })"
        >
          <option value="gasto">Gasto</option>
          <option value="ingreso">Ingreso</option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-[11px] text-ink-faint">Monto total</label>
        <CurrencyInput :model-value="event.monto" @update:model-value="(v) => emit('update', { monto: v })" />
      </div>
      <div>
        <label class="mb-1 block text-[11px] text-ink-faint">Mes</label>
        <NumberField :model-value="event.mes" :min="1" @update:model-value="(v) => emit('update', { mes: v })" />
      </div>
      <div>
        <div class="mb-1 flex items-center gap-1.5">
          <label class="text-[11px] text-ink-faint">Cuotas</label>
          <Tooltip
            text="Si el evento se paga en varias cuotas, el monto total se reparte en partes iguales a partir del mes indicado. Deja 1 si ocurre de una sola vez."
          />
        </div>
        <NumberField
          :model-value="event.cuotas ?? 1"
          :min="1"
          @update:model-value="(v) => emit('update', { cuotas: v })"
        />
      </div>
    </div>
  </div>
</template>
