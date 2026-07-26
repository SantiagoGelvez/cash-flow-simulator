<script setup lang="ts">
import type { IncomeSource } from '@/types/scenario'
import { useScenarioStore } from '@/stores/scenario'
import DynamicList from '@/components/shared/DynamicList.vue'
import ConfirmDeleteButton from '@/components/shared/ConfirmDeleteButton.vue'
import SalaryIncreaseRow from './SalaryIncreaseRow.vue'

const props = defineProps<{ source: IncomeSource }>()
const store = useScenarioStore()

function addIncrease() {
  store.addIncrease(props.source.id, { mesInicio: 1, monto: 0 })
}
</script>

<template>
  <div class="rounded-lg border border-surface-border bg-surface-sunken/40 p-3">
    <div class="mb-3 flex items-center gap-2">
      <input
        type="text"
        class="min-w-0 flex-1 rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 text-sm text-ink focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
        :value="source.nombre"
        placeholder="Nombre del aportante"
        @input="(e) => store.updateIncomeSource(source.id, { nombre: (e.target as HTMLInputElement).value })"
      />
      <ConfirmDeleteButton @confirm="store.removeIncomeSource(source.id)" />
    </div>

    <p class="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">Incrementos salariales</p>
    <DynamicList
      :items="source.incrementos"
      add-label="Agregar incremento"
      empty-message="Sin incrementos todavía — agrega el sueldo inicial."
      @add="addIncrease"
    >
      <template #default="{ item }">
        <SalaryIncreaseRow
          :increase="item"
          @update="(patch) => store.updateIncrease(source.id, item.id, patch)"
          @remove="store.removeIncrease(source.id, item.id)"
        />
      </template>
    </DynamicList>
  </div>
</template>
