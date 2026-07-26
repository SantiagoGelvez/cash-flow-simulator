<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'
import { useUiStore } from '@/stores/ui'
import CollapsiblePanel from '@/components/shared/CollapsiblePanel.vue'
import DynamicList from '@/components/shared/DynamicList.vue'
import Tooltip from '@/components/shared/Tooltip.vue'
import IncomeSourceRow from './IncomeSourceRow.vue'

const store = useScenarioStore()
const ui = useUiStore()

function addSource() {
  store.addIncomeSource(`Ingreso ${store.scenario.incomeSources.length + 1}`)
}
</script>

<template>
  <CollapsiblePanel
    title="Aportantes de ingreso"
    :model-value="ui.panelsOpen.incomeSources"
    @update:model-value="ui.togglePanel('incomeSources')"
  >
    <div class="mb-3 flex items-center gap-1.5 text-xs text-ink-faint">
      <span>Cada aportante puede tener uno o varios incrementos salariales en el tiempo.</span>
      <Tooltip
        text="Un incremento aplica desde el mes que indiques en adelante, hasta que llegue el siguiente. Un aportante con un solo sueldo fijo simplemente tiene un incremento desde el mes 1."
      />
    </div>
    <DynamicList
      :items="store.scenario.incomeSources"
      add-label="Agregar aportante"
      empty-message="Todavía no hay aportantes de ingreso — agrega el primero."
      @add="addSource"
    >
      <template #default="{ item }">
        <IncomeSourceRow :source="item" />
      </template>
    </DynamicList>
  </CollapsiblePanel>
</template>
