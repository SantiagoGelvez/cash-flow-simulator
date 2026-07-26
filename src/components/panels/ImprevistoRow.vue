<script setup lang="ts">
import type { Imprevisto } from '@/types/scenario'
import CurrencyInput from '@/components/shared/CurrencyInput.vue'
import NumberField from '@/components/shared/NumberField.vue'

defineProps<{ imprevisto: Imprevisto }>()
const emit = defineEmits<{
  update: [patch: Partial<Omit<Imprevisto, 'id'>>]
  remove: []
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-2 rounded-lg border border-surface-border bg-surface-sunken/40 p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
    <div>
      <label class="mb-1 block text-[11px] text-ink-faint">Nombre</label>
      <input
        type="text"
        class="w-full rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 text-sm text-ink focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
        :value="imprevisto.nombre"
        placeholder="Ej. reparación del carro"
        @input="(e) => emit('update', { nombre: (e.target as HTMLInputElement).value })"
      />
    </div>
    <div class="w-full sm:w-28">
      <label class="mb-1 block text-[11px] text-ink-faint">Mes</label>
      <NumberField :model-value="imprevisto.mes" :min="1" @update:model-value="(v) => emit('update', { mes: v })" />
    </div>
    <div class="w-full sm:w-36">
      <label class="mb-1 block text-[11px] text-ink-faint">Monto</label>
      <CurrencyInput :model-value="imprevisto.monto" @update:model-value="(v) => emit('update', { monto: v })" />
    </div>
    <button
      type="button"
      class="inline-flex h-9 w-9 shrink-0 items-center justify-center justify-self-end rounded-lg border border-surface-border text-ink-faint hover:border-alert hover:text-alert"
      aria-label="Quitar imprevisto"
      @click="emit('remove')"
    >
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v8a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v8a1 1 0 102 0V8a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>
