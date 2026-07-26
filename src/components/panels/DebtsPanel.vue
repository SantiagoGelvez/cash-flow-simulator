<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'
import { useUiStore } from '@/stores/ui'
import CollapsiblePanel from '@/components/shared/CollapsiblePanel.vue'
import DynamicList from '@/components/shared/DynamicList.vue'
import DebtRow from './DebtRow.vue'

const store = useScenarioStore()
const ui = useUiStore()

function addDebt() {
  store.addDebt({
    nombre: `Deuda ${store.scenario.debts.length + 1}`,
    saldoInicial: 0,
    tasaEA: 0.2,
    tipo: 'cuota_fija',
    cuotaMensual: 0,
  })
}
</script>

<template>
  <CollapsiblePanel title="Deudas" :model-value="ui.panelsOpen.debts" @update:model-value="ui.togglePanel('debts')">
    <DynamicList
      :items="store.scenario.debts"
      add-label="Agregar deuda"
      empty-message="Sin deudas registradas."
      @add="addDebt"
    >
      <template #default="{ item }">
        <DebtRow
          :debt="item"
          @update="(patch) => store.updateDebt(item.id, patch)"
          @remove="store.removeDebt(item.id)"
        />
      </template>
    </DynamicList>
  </CollapsiblePanel>
</template>
